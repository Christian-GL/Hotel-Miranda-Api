
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

    async fetchAllIdsNotArchived(): Promise<string[]> {
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

    async fetchBookingIdsByRoomId(id: string): Promise<string[] | null> {
        try {
            const room: RoomInterfaceIdMongodb | null = await RoomModelMongodb.findById(id)
            if (room) return room.booking_id_list
            else throw new Error('Room not found')
        }
        catch (error) {
            console.error('Error in fetchBookingIdsByRoomId of roomService', error)
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

    async updateAndArchiveBookingsIfNeeded(roomId: string, roomToUpdate: RoomInterfaceDTO): Promise<RoomInterfaceIdMongodb | null> {
        // Actualiza la room y (si procede) archiva las bookings en una única transacción.
        const session = await mongoose.startSession()
        try {
            await session.withTransaction(async () => {

                // Actualiza la room
                const updatedRoom = await RoomModelMongodb.findOneAndUpdate(
                    { _id: roomId },
                    roomToUpdate,
                    { new: true, session }
                ).exec()
                if (!updatedRoom) {
                    throw new Error(`Room #${roomId} not found`)
                }

                // Archiba las bookings asociadas en caso de que la room ya no esté disponible
                if ((roomToUpdate.isActive === OptionYesNo.no || roomToUpdate.isArchived === OptionYesNo.yes) && roomToUpdate.booking_id_list && roomToUpdate.booking_id_list.length > 0) {
                    await BookingModelMongodb.updateMany(
                        { _id: { $in: roomToUpdate.booking_id_list }, isArchived: OptionYesNo.no },
                        { $set: { isArchived: OptionYesNo.yes } },
                        { session }
                    ).exec()
                }
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

    async delete(id: string): Promise<boolean> {
        const session = await mongoose.startSession()
        try {
            await session.withTransaction(async () => {
                const room = await RoomModelMongodb.findById(id).session(session).lean() as (RoomInterfaceIdMongodb | null)
                if (!room) {
                    return false
                }

                const bookingIds: string[] = Array.isArray((room as any).booking_id_list)
                    ? Array.from(new Set((room as any).booking_id_list.map((x: any) => String(x).trim())))
                    : []
                if (bookingIds.length > 0) {
                    await BookingModelMongodb.updateMany(
                        { _id: { $in: bookingIds }, isArchived: OptionYesNo.no },
                        { $set: { isArchived: OptionYesNo.yes } },
                        { session }
                    ).exec()
                }

                const deletedRoom = await RoomModelMongodb.findOneAndDelete({ _id: id }, { session }).exec()
                if (!deletedRoom) {
                    // Condición muy rara (race): lanzar error para provocar rollback
                    throw new Error(`Room #${id} not found during delete`)
                }
            })
            return true
        }
        catch (error: any) {
            throw error
        }
        finally {
            session.endSession()
        }
    }

}