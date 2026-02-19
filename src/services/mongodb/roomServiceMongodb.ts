
import mongoose, { ClientSession } from 'mongoose'

import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { RoomModelMongodb } from '../../models/mongodb/roomModelMongodb'
import { RoomInterface, RoomInterfaceIdMongodb, RoomInterfacePriceAndDiscount } from '../../interfaces/mongodb/roomInterfaceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'
import { BookingInterfaceIdMongodb } from '../../interfaces/mongodb/bookingInterfaceMongodb'
import { BookingServiceMongodb } from '../../services/mongodb/bookingServiceMongodb'
import { ClientModelMongodb } from '../../models/mongodb/clientModelMongodb'
import { ClientInterfaceIdMongodb } from '../../interfaces/mongodb/clientInterfaceMongodb'
import { ClientServiceMongodb } from '../../services/mongodb/clientServiceMongodb'
import { RoomDeleteResponseInterface } from '../../interfaces/mongodb/response/room/roomDeleteResponseInterface'
import { RoomArchiveResponseInterface } from '../../interfaces/mongodb/response/room/roomArchiveResponseInterface'


export class RoomServiceMongodb implements ServiceInterfaceMongodb<
    RoomInterface,
    RoomInterfaceIdMongodb,
    RoomInterfaceIdMongodb | null,
    // RoomArchiveResponseInterface,
    RoomDeleteResponseInterface
> {

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
            console.error('Error in fetchAllNumbersNotArchived of roomService', err)
            throw err
        }
    }

    async fetchAllIdsActived(): Promise<string[]> {
        try {
            const rooms = await RoomModelMongodb.find(
                { isActive: OptionYesNo.yes },
                { _id: 1 }
            ).lean()
            return rooms.map((r: any) => String(r._id))
        }
        catch (err) {
            console.error('Error in fetchAllIdsActived of roomService', err)
            throw err
        }
    }

    async fetchIdByNumber(roomNumber: string): Promise<string | null> {
        try {
            const room = await RoomModelMongodb.findOne(
                { number: roomNumber },
                { _id: 1 }
            ).lean()

            return room ? String(room._id) : null
        }
        catch (err) {
            console.error('Error in fetchIdByNumber of roomService', err)
            throw err
        }
    }

    async fetchPricesAndDiscounts(ids: string[]): Promise<RoomInterfacePriceAndDiscount[]> {
        try {
            if (!Array.isArray(ids) || ids.length === 0) {
                return []
            }
            const rooms = await RoomModelMongodb.find(
                {
                    _id: { $in: ids },
                    isArchived: OptionYesNo.no
                },
                {
                    _id: 0,
                    price: 1,
                    discount: 1
                }
            ).lean()
            return rooms as RoomInterfacePriceAndDiscount[]
        }
        catch (error) {
            console.error('Error in fetchPricesAndDiscounts of bookingService', error)
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

    async create(room: RoomInterface): Promise<RoomInterfaceIdMongodb> {
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

    // async update(roomId: string, roomToUpdate: RoomInterface): Promise<RoomArchiveResponseInterface> {
    //     // Actualiza la room y si es necesario archiva las bookings y los clientes asociados.
    //     const session = await mongoose.startSession()
    //     let updatedBookingsNotArchived: BookingInterfaceIdMongodb[] = []
    //     let updatedClients: ClientInterfaceIdMongodb[] = []

    //     try {
    //         await session.withTransaction(async () => {

    //             // Actualiza la room
    //             const updatedRoom = await RoomModelMongodb.findOneAndUpdate(
    //                 { _id: roomId },
    //                 roomToUpdate,
    //                 { new: true, session }
    //             ).exec()
    //             if (!updatedRoom) {
    //                 throw new Error(`Room #${roomId} not found`)
    //             }

    //             // Archiba las bookings asociadas y actualiza sus clientes en caso de que la room ya no esté disponible
    //             if ((roomToUpdate.isActive === OptionYesNo.no || roomToUpdate.isArchived === OptionYesNo.yes) && roomToUpdate.booking_id_list && roomToUpdate.booking_id_list.length > 0) {

    //                 await BookingModelMongodb.updateMany(
    //                     { _id: { $in: roomToUpdate.booking_id_list }, isArchived: OptionYesNo.no },
    //                     { $set: { isArchived: OptionYesNo.yes } },
    //                     { session }
    //                 ).exec()
    //                 updatedBookingsNotArchived = await BookingModelMongodb.find({
    //                     _id: { $in: roomToUpdate.booking_id_list },
    //                     isArchived: OptionYesNo.yes
    //                 }
    //                 ).session(session).lean()

    //                 // Actualizar lista de bookings de los clientes asociados:
    //                 // Agrupar bookings archivadas por cliente
    //                 const bookingsByClient = new Map<string, string[]>()
    //                 for (const booking of updatedBookingsNotArchived) {
    //                     if (booking.isArchived !== OptionYesNo.yes) continue
    //                     if (!booking.client_id) continue

    //                     const clientId = booking.client_id.toString()
    //                     const bookingId = booking._id.toString()

    //                     const list = bookingsByClient.get(clientId) ?? []
    //                     list.push(bookingId)
    //                     bookingsByClient.set(clientId, list)
    //                 }
    //                 // Actualizar clientes dentro de la misma transacción
    //                 for (const [clientId, bookingIds] of bookingsByClient.entries()) {
    //                     await ClientModelMongodb.updateOne(
    //                         { _id: clientId },
    //                         {
    //                             $pull: {
    //                                 booking_id_list: { $in: bookingIds }
    //                             }
    //                         },
    //                         { session }
    //                     ).exec()
    //                     const clientIds = Array.from(bookingsByClient.keys())
    //                     if (clientIds.length > 0) {
    //                         updatedClients = await ClientModelMongodb.find(
    //                             { _id: { $in: clientIds } }
    //                         ).session(session).lean() as ClientInterfaceIdMongodb[]
    //                     }

    //                 }

    //             }
    //         })

    //         const finalRoomFresh = await RoomModelMongodb.findById(roomId).lean()
    //         return {
    //             roomUpdated: finalRoomFresh as RoomInterfaceIdMongodb,
    //             updatedBookings: updatedBookingsNotArchived,
    //             updatedClients: updatedClients
    //         }
    //     }
    //     catch (error) {
    //         throw error
    //     }
    //     finally {
    //         session.endSession()
    //     }
    // }

    async update(roomId: string, roomToUpdate: RoomInterface): Promise<RoomInterfaceIdMongodb | null> {
        try {
            const updatedRoom = await RoomModelMongodb.findOneAndUpdate(
                { _id: roomId },
                { $set: roomToUpdate },
                { new: true, runValidators: true, context: 'query' }
            ).lean() as RoomInterfaceIdMongodb | null

            return updatedRoom
        }
        catch (error) {
            throw error
        }
    }

    async updateArchiveState(id: string, isArchived: OptionYesNo, session?: ClientSession): Promise<RoomInterfaceIdMongodb | null> {
        try {
            const updatedRoom = await RoomModelMongodb.findByIdAndUpdate(
                id,
                { $set: { isArchived: isArchived } },
                { new: true, session }
            )

            return updatedRoom
        }
        catch (error) {
            throw error
        }
    }

    async archive(id: string, isArchived: OptionYesNo): Promise<RoomArchiveResponseInterface | null> {
        // Archiva la room y si es necesario archiva las bookings y los clientes asociados.
        const session = await mongoose.startSession()
        let updatedBookings: BookingInterfaceIdMongodb[] = []
        let updatedClients: ClientInterfaceIdMongodb[] = []
        let finalRoomFresh: RoomInterfaceIdMongodb | null = null

        try {
            await session.withTransaction(async () => {
                const oldRoom = await RoomModelMongodb.findById(id).session(session).lean() as RoomInterfaceIdMongodb | null
                if (!oldRoom) {
                    throw new Error(`Room #${id} not found`)
                }

                const updatedRoom = await this.updateArchiveState(id, isArchived, session)
                if (!updatedRoom) {
                    throw new Error(`Room #${id} not found`)
                }

                // Si se está archivando la room, archivar las bookings y actualizar los clientes asociados:
                if (isArchived === OptionYesNo.yes && updatedRoom.booking_id_list?.length) {
                    const bookingService = new BookingServiceMongodb()
                    const bookingPromises = updatedRoom.booking_id_list.map(bookingId =>
                        bookingService.updateArchiveState(bookingId, OptionYesNo.yes, session)
                    )
                    updatedBookings = (await Promise.all(bookingPromises)).filter(Boolean) as BookingInterfaceIdMongodb[]

                    // Agrupamos las bookings archivadas por cliente para eliminar los IDs necesarios:
                    const bookingsByClient = new Map<string, string[]>()
                    const validBookings = updatedBookings.filter((booking): booking is BookingInterfaceIdMongodb =>
                        !!booking &&
                        booking.isArchived === OptionYesNo.yes &&
                        !!booking.client_id
                    )
                    for (const booking of validBookings) {
                        const clientId = String(booking.client_id)
                        const list = bookingsByClient.get(clientId) ?? []
                        list.push(String(booking._id))
                        bookingsByClient.set(clientId, list)
                    }
                    const clientIds = Array.from(bookingsByClient.keys())
                    if (clientIds.length > 0) {
                        const clientService = new ClientServiceMongodb()
                        const removals = Array.from(bookingsByClient.entries()).map(([clientId, bookingIds]) =>
                            clientService.removeBookingIdsFromClient(clientId, bookingIds, session)
                        )
                        await Promise.all(removals)
                        updatedClients = await clientService.fetchByIds(clientIds, session)
                    }
                }
            })

            finalRoomFresh = await RoomModelMongodb.findById(id).lean() as RoomInterfaceIdMongodb | null
            return {
                roomUpdated: finalRoomFresh as RoomInterfaceIdMongodb,
                updatedBookings,
                updatedClients
            }
        }
        catch (error) {
            throw error
        }
        finally {
            session.endSession()
        }
    }

    async delete(id: string): Promise<RoomDeleteResponseInterface> {
        // Elimina la room y si es necesario archiva las bookings y los clientes asociados.
        const session = await mongoose.startSession()
        let updatedBookings: BookingInterfaceIdMongodb[] = []
        let updatedClients: ClientInterfaceIdMongodb[] = []

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
                    updatedBookings = await BookingModelMongodb.find(
                        { _id: { $in: bookingIds } }
                    ).session(session).lean() as BookingInterfaceIdMongodb[]

                    const clientIds = Array.from(
                        new Set(updatedBookings.map(b => String(b.client_id)))
                    )

                    await ClientModelMongodb.updateMany(
                        { _id: { $in: clientIds } },
                        {
                            $pull: {
                                booking_id_list: { $in: bookingIds }
                            }
                        },
                        { session }
                    ).exec()
                    updatedClients = await ClientModelMongodb.find(
                        { _id: { $in: clientIds } }
                    ).session(session).lean()
                }

                const deletedRoom = await RoomModelMongodb.findOneAndDelete({ _id: id }, { session }).exec()
                if (!deletedRoom) {
                    // Condición muy rara (race): lanzar error para provocar rollback
                    throw new Error(`Room #${id} not found during delete`)
                }
            })

            return {
                roomIsDeleted: true,
                roomId: id,
                updatedBookings,
                updatedClients
            }
        }
        catch (error: any) {
            throw error
        }
        finally {
            session.endSession()
        }
    }

}