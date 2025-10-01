
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { RoomModelMongodb } from '../../models/mongodb/roomModelMongodb'
import { RoomInterfaceDTO, RoomInterfaceIdMongodb } from '../../interfaces/mongodb/roomInterfaceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'
import mongoose, { ClientSession } from 'mongoose'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'


export class RoomServiceMongodb implements ServiceInterfaceMongodb<RoomInterfaceIdMongodb> {

    async fetchAll(): Promise<RoomInterfaceIdMongodb[]> {
        try {
            const rooms: RoomInterfaceIdMongodb[] = await RoomModelMongodb.find()
            return rooms
        }
        catch (error) {
            console.error('Error in fetchAll of roomService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<RoomInterfaceIdMongodb | null> {
        try {
            const room: RoomInterfaceIdMongodb | null = await RoomModelMongodb.findById(id)
            if (room) return room
            else throw new Error('Room not found')
        }
        catch (error) {
            console.error('Error in fetchById of roomService', error)
            throw error
        }
    }

    async create(room: RoomInterfaceDTO): Promise<RoomInterfaceIdMongodb> {
        try {
            const newRoom: RoomInterfaceIdMongodb = new RoomModelMongodb(room)
            await newRoom.save()
            return newRoom
        }
        catch (error) {
            console.error('Error in create of roomService', error)
            throw error
        }
    }

    // Viejo Update
    // async update(id: string, room: RoomInterfaceDTO): Promise<RoomInterfaceIdMongodb | null> {
    //     try {
    //         const existingRoom: RoomInterfaceIdMongodb | null = await this.fetchById(id)
    //         if (existingRoom == null) return null

    //         const updatedRoom: RoomInterfaceIdMongodb | null = await RoomModelMongodb.findOneAndUpdate(
    //             { _id: id },
    //             room,
    //             { new: true }
    //         )
    //         if (updatedRoom === null) return null

    //         return updatedRoom
    //     }
    //     catch (error) {
    //         console.error('Error in update of roomService', error)
    //         throw error
    //     }
    // }
    // // updateRoomWithSession

    async update(id: string, roomDTO: RoomInterfaceDTO, session?: ClientSession): Promise<RoomInterfaceIdMongodb | null> {
        try {
            const updatedRoom = await RoomModelMongodb.findOneAndUpdate(
                { _id: id },
                roomDTO,
                { new: true, session }
            ).exec()

            return updatedRoom as RoomInterfaceIdMongodb | null
        }
        catch (error) {
            console.error('Error in update of roomService', error)
            throw error
        }
    }

    async updateRoomAndArchiveBookings(roomId: string, roomDTO: RoomInterfaceDTO, bookingIDs: string[]): Promise<RoomInterfaceIdMongodb | null> {
        /**
     * Método compuesto: hace la actualización de la room y (si procede)
     * archiva las bookings en una única transacción. Devuelve la room final.
     * - Realiza su propia session/withTransaction.
     * - Lanza errores para que el controller los traduzca a 400/404/500.
     */
        const session = await mongoose.startSession()
        try {
            let finalRoom: RoomInterfaceIdMongodb | null = null

            await session.withTransaction(async () => {
                const updatedRoom = await RoomModelMongodb.findOneAndUpdate(
                    { _id: roomId },
                    roomDTO,
                    { new: true, session }
                ).exec()

                if (!updatedRoom) {
                    throw new Error(`Room #${roomId} not found`)
                }

                if ((roomDTO.isActive === OptionYesNo.no || roomDTO.isArchived === OptionYesNo.yes) && bookingIDs && bookingIDs.length > 0) {
                    await BookingModelMongodb.updateMany(
                        { _id: { $in: bookingIDs }, isArchived: OptionYesNo.no },
                        { $set: { isArchived: OptionYesNo.yes } },
                        { session }
                    ).exec()
                }

                finalRoom = updatedRoom as RoomInterfaceIdMongodb
            })

            const finalRoomFresh = await RoomModelMongodb.findById(roomId).lean()
            return finalRoomFresh as RoomInterfaceIdMongodb | null
        }
        catch (error) {
            throw error
        }
        finally {
            session.endSession()
        }
    }

    async archiveBookingsByIds(bookingIDs: string[], session?: ClientSession): Promise<{ matchedCount: number, modifiedCount: number } | null> {
        /**
     * Archiva (isArchived = yes) bookings por lista de ids dentro de session opcional.
     * Devuelve el resultado de la operación (matchedCount/modifiedCount) o null si IDs vacíos.
     */
        try {
            if (!bookingIDs || bookingIDs.length === 0) return { matchedCount: 0, modifiedCount: 0 }

            const res = await BookingModelMongodb.updateMany(
                { _id: { $in: bookingIDs }, isArchived: OptionYesNo.no },
                { $set: { isArchived: OptionYesNo.yes } },
                { session }
            ).exec()

            // res puede ser un UpdateWriteResult / UpdateResult según driver, estandarizamos
            return {
                matchedCount: (res as any).matchedCount ?? (res as any).n ?? 0,
                modifiedCount: (res as any).modifiedCount ?? (res as any).nModified ?? 0
            }
        }
        catch (err) {
            console.error('Error in archiveBookingsByIds of roomService', err)
            throw err
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const deletedRoom = await RoomModelMongodb.findByIdAndDelete(id)
            if (deletedRoom) {
                return true
            }
            else return false
        }
        catch (error) {
            console.error('Error in delete of roomService', error)
            throw error
        }
    }

    async fetchAllIDsNotArchived(): Promise<string[]> {
        try {
            const rooms = await RoomModelMongodb.find(
                { isArchived: OptionYesNo.no },
                { _id: 1 }
            ).lean()
            return rooms.map((r: any) => String(r._id))
        }
        catch (err) {
            console.error('Error in fetchAllIds of roomService', err)
            throw err
        }
    }

    async fetchAllNumbersNotArchived(): Promise<string[]> {
        try {
            const rooms = await RoomModelMongodb.find(
                { isArchived: OptionYesNo.no },
                { number: 1, _id: 0 }
            ).lean()
            return rooms.map((r: any) => String(r.number))
        }
        catch (err) {
            console.error('Error in fetchAllNumbers of roomService', err)
            throw err
        }
    }

}