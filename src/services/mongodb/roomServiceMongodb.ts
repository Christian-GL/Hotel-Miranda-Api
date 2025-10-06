
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { RoomModelMongodb } from '../../models/mongodb/roomModelMongodb'
import { RoomInterfaceDTO, RoomInterfaceIdMongodb } from '../../interfaces/mongodb/roomInterfaceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'
import mongoose from 'mongoose'
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

    async update(id: string, room: RoomInterfaceDTO): Promise<RoomInterfaceIdMongodb | null> {
        try {
            const existingRoom: RoomInterfaceIdMongodb | null = await this.fetchById(id)
            if (existingRoom == null) return null

            const updatedRoom: RoomInterfaceIdMongodb | null = await RoomModelMongodb.findOneAndUpdate(
                { _id: id },
                room,
                { new: true }
            )
            if (updatedRoom === null) return null

            return updatedRoom
        }
        catch (error) {
            console.error('Error in update of roomService', error)
            throw error
        }
    }

    async updateRoomAndArchiveBookings(roomId: string, roomDTO: RoomInterfaceDTO, bookingIDs: string[]): Promise<RoomInterfaceIdMongodb | null> {
        //Actualiza la room y (si procede) archiva las bookings en una única transacción. Devuelve la room final.
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

    // async delete(id: string): Promise<boolean> {
    //     try {
    //         const deletedRoom = await RoomModelMongodb.findByIdAndDelete(id)
    //         if (deletedRoom) {
    //             return true
    //         }
    //         else return false
    //     }
    //     catch (error) {
    //         console.error('Error in delete of roomService', error)
    //         throw error
    //     }
    // }

    async delete(id: string): Promise<boolean> {
        const session = await mongoose.startSession()

        try {
            let found = false

            // Intentamos hacerlo dentro de una transacción (atomicidad)
            await session.withTransaction(async () => {
                // 1) Leer la room dentro de la sesión
                const roomDoc = await RoomModelMongodb.findById(id).session(session).lean()
                if (!roomDoc) {
                    // no existe => no hacemos nada en la transacción, salimos
                    found = false
                    return
                }

                found = true

                // 2) obtener booking ids (deduplicados)
                const bookingIDs: string[] = Array.isArray((roomDoc as any).booking_id_list)
                    ? Array.from(new Set((roomDoc as any).booking_id_list.map((x: any) => String(x).trim())))
                    : []

                // 3) archivar bookings asociadas (si las hay)
                if (bookingIDs.length > 0) {
                    await BookingModelMongodb.updateMany(
                        { _id: { $in: bookingIDs }, isArchived: OptionYesNo.no },
                        { $set: { isArchived: OptionYesNo.yes } },
                        { session }
                    ).exec()
                }

                // 4) borrar la room dentro de la misma transacción
                const deletedRoom = await RoomModelMongodb.findOneAndDelete({ _id: id }, { session }).exec()
                if (!deletedRoom) {
                    // condición muy rara (race) -> lanzar para rollback y que controller devuelva 500
                    throw new Error(`Room #${id} not found during delete`)
                }
            })

            // Si la room no existía, found === false -> devolvemos false (controller hará 404)
            return found
        }
        catch (err: any) {
            const message = String(err?.message ?? '').toLowerCase()

            // Si la causa es que el servidor no soporta transacciones, intentamos fallback no transaccional
            if (message.includes('transactions') || message.includes('replica set') || message.includes('withtransaction')) {
                try {
                    // fallback: sin sesión/transacción (no atómico)
                    const roomDoc = await RoomModelMongodb.findById(id).lean()
                    if (!roomDoc) return false

                    const bookingIDs: string[] = Array.isArray((roomDoc as any).booking_id_list)
                        ? Array.from(new Set((roomDoc as any).booking_id_list.map((x: any) => String(x).trim())))
                        : []

                    if (bookingIDs.length > 0) {
                        await BookingModelMongodb.updateMany(
                            { _id: { $in: bookingIDs }, isArchived: OptionYesNo.no },
                            { $set: { isArchived: OptionYesNo.yes } }
                        ).exec()
                    }

                    const deleted = await RoomModelMongodb.findByIdAndDelete(id).exec()
                    return !!deleted
                } catch (fallbackErr) {
                    console.error('Fallback delete (no-transaction) failed:', fallbackErr)
                    // relanzamos para que el controller devuelva 500
                    throw fallbackErr
                }
            }

            // cualquier otro error: relanzar para que controller lo trate (500)
            throw err
        } finally {
            session.endSession()
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