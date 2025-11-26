
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'
import { BookingInterfaceDatesAndIdNotArchived, BookingInterfaceDatesNotArchived, BookingInterfaceDTO, BookingInterfaceIdMongodb } from '../../interfaces/mongodb/bookingInterfaceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'
import mongoose from 'mongoose'
import { RoomModelMongodb } from '../../models/mongodb/roomModelMongodb'
import { ClientModelMongodb } from '../../models/mongodb/clientModelMongodb'


export class BookingServiceMongodb implements ServiceInterfaceMongodb<BookingInterfaceIdMongodb> {

    async fetchAll(): Promise<BookingInterfaceIdMongodb[]> {
        try {
            const bookings: BookingInterfaceIdMongodb[] = await BookingModelMongodb.find()
            return bookings
        }
        catch (error) {
            console.error('Error in fetchAll of bookingService', error)
            throw error
        }
    }

    async fetchAllIdsNotArchived(): Promise<BookingInterfaceIdMongodb[]> {
        try {
            const bookings = await BookingModelMongodb.find(
                { isArchived: OptionYesNo.no },
                { _id: 1 }
            ).lean()
            return bookings
        }
        catch (error) {
            console.error('Error in fetchAllIdsNotArchived of bookingService', error)
            throw error
        }
    }

    async fetchAllDatesNotArchived(): Promise<BookingInterfaceDatesNotArchived[]> {
        try {
            const bookings = await BookingModelMongodb.find(
                { isArchived: OptionYesNo.no },
                { check_in_date: 1, check_out_date: 1, _id: 0 }
            ).lean()
            return bookings
        }
        catch (error) {
            console.error('Error in fetchAllDatesNotArchived of bookingService', error)
            throw error
        }
    }

    async fetchAllDatesAndIdNotArchived(): Promise<BookingInterfaceDatesAndIdNotArchived[]> {
        try {
            const bookings = await BookingModelMongodb.find(
                { isArchived: OptionYesNo.no },
                { _id: 1, check_in_date: 1, check_out_date: 1 }
            ).lean()
            return bookings
        }
        catch (error) {
            console.error('Error in fetchAllDatesNotArchived of bookingService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<BookingInterfaceIdMongodb | null> {
        try {
            const booking: BookingInterfaceIdMongodb | null = await BookingModelMongodb.findById(id)
            if (booking) return booking
            else throw new Error('Booking not found')
        }
        catch (error) {
            console.error('Error in fetchById of bookingService', error)
            throw error
        }
    }

    async create(booking: BookingInterfaceDTO): Promise<BookingInterfaceIdMongodb> {
        try {
            const newBooking: BookingInterfaceIdMongodb = new BookingModelMongodb(booking)
            await newBooking.save()
            return newBooking
        }
        catch (error) {
            console.error('Error in create of bookingService', error)
            throw error
        }
    }

    async createAndLinkRoomsClient(booking: BookingInterfaceDTO): Promise<BookingInterfaceIdMongodb> {
        // Crea una booking y añade su _id al "booking_id_list" de todas las rooms indicadas y al cliente asociado.
        const session = await mongoose.startSession()
        try {
            let createdBookingId: string | null = null

            await session.withTransaction(async () => {

                // Creamos la booking
                const createdArr = await BookingModelMongodb.create([booking], { session })
                const bookingDoc = createdArr[0] as any
                createdBookingId = String(bookingDoc._id)

                // Actualizamos las rooms asociadas añadiendo el id de la booking a su "booking_id_list"
                const roomIds: string[] = Array.isArray(booking.room_id_list) ? booking.room_id_list.map(String) : []
                if (roomIds.length > 0) {
                    const foundRooms = await RoomModelMongodb.find({ _id: { $in: roomIds } })
                        .select('_id')
                        .session(session)
                        .lean()
                    const foundSet = new Set(foundRooms.map((r: any) => String(r._id)))
                    const missingRooms = roomIds.filter(id => !foundSet.has(id))

                    if (missingRooms.length > 0) {
                        throw new Error(`Some room IDs do not exist: ${missingRooms.join(', ')}`)
                    }
                    await RoomModelMongodb.updateMany(
                        { _id: { $in: roomIds } },
                        { $addToSet: { booking_id_list: bookingDoc._id } },
                        { session }
                    ).exec()
                }

                // Validar y actualizar client (añadir el booking id)
                const clientId = String(booking.client_id ?? '')
                if (!clientId) {
                    throw new Error('Client id is required')
                }
                const foundClient = await ClientModelMongodb.findById(clientId).select('_id').session(session).lean()
                if (!foundClient) {
                    throw new Error(`Client #${clientId} not found`)
                }
                await ClientModelMongodb.findOneAndUpdate(
                    { _id: clientId },
                    { $addToSet: { booking_id_list: bookingDoc._id } },
                    { session }
                ).exec()
            })

            // Condición rara: comprobamos que "createdBookingId" fue asignado (si algo raro ocurriese y no se creó la booking, lanzamos error.
            if (!createdBookingId) {
                throw new Error('Booking creation failed (no id returned)')
            }

            const finalBooking = await BookingModelMongodb.findById(createdBookingId).lean()
            return finalBooking as BookingInterfaceIdMongodb
        }
        finally {
            session.endSession()
        }
    }

    async update(id: string, booking: BookingInterfaceDTO): Promise<BookingInterfaceIdMongodb | null> {
        try {
            const existingBooking: BookingInterfaceIdMongodb | null = await this.fetchById(id)
            if (existingBooking == null) return null

            const updatedBooking: BookingInterfaceIdMongodb | null = await BookingModelMongodb.findOneAndUpdate(
                { _id: id },
                booking,
                { new: true }
            )
            if (updatedBooking === null) return null

            return updatedBooking
        }
        catch (error) {
            console.error('Error in update of bookingService', error)
            throw error
        }
    }

    async updateAndLinkRoomsClient(id: string, bookingDTO: BookingInterfaceDTO): Promise<BookingInterfaceIdMongodb | null> {
        const session = await mongoose.startSession()
        try {

            await session.withTransaction(async () => {
                const bookingToUpdate = await BookingModelMongodb.findOne({ _id: id }).session(session).lean()
                if (!bookingToUpdate) {
                    throw new Error(`Booking #${id} not found`)
                }

                const oldRoomIds: string[] = Array.isArray(bookingToUpdate.room_id_list)
                    ? Array.from(new Set(bookingToUpdate.room_id_list.map(String)))
                    : []
                const newRoomIds: string[] = Array.isArray(bookingDTO.room_id_list)
                    ? Array.from(new Set(bookingDTO.room_id_list.map(String)))
                    : []
                const IdsToAdd = newRoomIds.filter(rid => !(new Set(oldRoomIds)).has(rid))
                const IdsToRemove = oldRoomIds.filter(rid => !(new Set(newRoomIds)).has(rid))

                // --- Validar existencia de rooms que vamos a AÑADIR (IdsToAdd) ---
                if (IdsToAdd.length > 0) {
                    const found = await RoomModelMongodb.find({ _id: { $in: IdsToAdd } }).select('_id').session(session).lean()
                    const foundSet = new Set(found.map((r: any) => String(r._id)))
                    const missing = IdsToAdd.filter(id => !foundSet.has(id))
                    if (missing.length > 0) {
                        throw new Error(`Some room IDs do not exist: ${missing.join(', ')}`)
                    }
                }

                // --- Validar existencia de rooms que vamos a AÑADIR (IdsToAdd) ---
                const oldClientId = String(bookingToUpdate.client_id ?? '')
                const newClientId = String(bookingDTO.client_id ?? '')

                if (newClientId && oldClientId !== newClientId) {
                    const foundClient = await ClientModelMongodb.findById(newClientId).select('_id').session(session).lean()
                    if (!foundClient) {
                        throw new Error(`Client #${newClientId} not found`)
                    }
                }

                // --- Actualizar la booking dentro de la sesión ---
                const updatedBookingDoc = await BookingModelMongodb.findOneAndUpdate(
                    { _id: id },
                    bookingDTO,
                    { new: true, session }
                ).exec()
                if (!updatedBookingDoc) {
                    throw new Error(`Booking #${id} not found`)
                }

                // --- ROOMS: lógica sobre isArchived y diferencias entre listas ---
                const oldArchived = String(bookingToUpdate.isArchived ?? '').toLowerCase()
                const newArchived = String(bookingDTO.isArchived ?? '').toLowerCase()

                if (oldArchived !== newArchived) {
                    if (newArchived === String(OptionYesNo.yes)) {
                        // Booking pasó a archivada: quitar referencia de todas las oldRoomIds
                        if (oldRoomIds.length > 0) {
                            await RoomModelMongodb.updateMany(
                                { _id: { $in: oldRoomIds }, booking_id_list: updatedBookingDoc._id },
                                { $pull: { booking_id_list: updatedBookingDoc._id } },
                                { session }
                            ).exec()
                        }
                    } else {
                        // Booking dejó de estar archivada: añadir referencia a newRoomIds (validando existencia)
                        if (newRoomIds.length > 0) {
                            const found = await RoomModelMongodb.find({ _id: { $in: newRoomIds } }).select('_id').session(session).lean()
                            const foundSet = new Set(found.map((r: any) => String(r._id)))
                            const missing = newRoomIds.filter(id => !foundSet.has(id))
                            if (missing.length > 0) {
                                throw new Error(`Some room IDs do not exist: ${missing.join(', ')}`)
                            }
                            await RoomModelMongodb.updateMany(
                                { _id: { $in: newRoomIds } },
                                { $addToSet: { booking_id_list: updatedBookingDoc._id } },
                                { session }
                            ).exec()
                        }
                    }
                }
                else {
                    // Si no hubo cambio en isArchived: aplicar diferencias normales entre listas
                    if (IdsToAdd.length > 0) {
                        await RoomModelMongodb.updateMany(
                            { _id: { $in: IdsToAdd } },
                            { $addToSet: { booking_id_list: updatedBookingDoc._id } },
                            { session }
                        ).exec()
                    }
                    if (IdsToRemove.length > 0) {
                        await RoomModelMongodb.updateMany(
                            { _id: { $in: IdsToRemove } },
                            { $pull: { booking_id_list: updatedBookingDoc._id } },
                            { session }
                        ).exec()
                    }
                }

                // CLIENT: lógica de archivado / cambio de client (Si cambió la propiedad isArchived en la booking)
                if (oldArchived !== newArchived) {
                    if (newArchived === String(OptionYesNo.yes)) {
                        // Booking pasó a archivada -> quitar referencia del client actual (oldClientId o newClientId según cambio)
                        // Si client cambió junto con archivado, quitamos de oldClientId (si existe).
                        const targetClientForPull = oldClientId || newClientId
                        if (targetClientForPull) {
                            await ClientModelMongodb.updateOne(
                                { _id: targetClientForPull, booking_id_list: updatedBookingDoc._id },
                                { $pull: { booking_id_list: updatedBookingDoc._id } },
                                { session }
                            ).exec()
                        }
                    }
                    else {
                        // booking dejó de estar archivada: asegurarnos de que está en el client nuevo (newClientId)
                        if (newClientId) {
                            const foundClient = await ClientModelMongodb.findById(newClientId).select('_id').session(session).lean()
                            if (!foundClient) {
                                throw new Error(`Client #${newClientId} not found`)
                            }
                            await ClientModelMongodb.updateOne(
                                { _id: newClientId },
                                { $addToSet: { booking_id_list: updatedBookingDoc._id } },
                                { session }
                            ).exec()
                        }
                    }
                }
                else {
                    // Si no cambió isArchived, pero cambió el client: mover referencia de oldClientId a newClientId
                    if (newClientId && oldClientId !== newClientId) {
                        if (oldClientId) {
                            await ClientModelMongodb.updateOne(
                                { _id: oldClientId, booking_id_list: updatedBookingDoc._id },
                                { $pull: { booking_id_list: updatedBookingDoc._id } },
                                { session }
                            ).exec()
                        }
                        await ClientModelMongodb.updateOne(
                            { _id: newClientId },
                            { $addToSet: { booking_id_list: updatedBookingDoc._id } },
                            { session }
                        ).exec()
                    }
                }
            })
            const finalFresh = await BookingModelMongodb.findById(id).lean()
            return finalFresh as BookingInterfaceIdMongodb | null
        }
        catch (error) {
            throw error
        }
        finally {
            session.endSession()
        }
    }

    async deleteAndArchiveBookings(id: string): Promise<boolean> {
        // Borra la booking y elimina su id de referencia en las rooms y en el client asociados
        const session = await mongoose.startSession()
        try {
            await session.withTransaction(async () => {
                const booking = await BookingModelMongodb.findById(id).session(session).lean() as (BookingInterfaceIdMongodb | null)
                if (!booking) {
                    return false
                }

                const roomIds: string[] = Array.isArray(booking.room_id_list)
                    ? Array.from(new Set(booking.room_id_list.map((x: any) => String(x).trim())))
                    : []
                if (roomIds.length > 0) {
                    await RoomModelMongodb.updateMany(
                        { _id: { $in: roomIds } },
                        { $pull: { booking_id_list: id } },
                        { session }
                    ).exec()
                }

                const clientId = booking.client_id ? String(booking.client_id).trim() : ''
                if (clientId) {
                    await ClientModelMongodb.updateOne(
                        { _id: clientId, booking_id_list: id },
                        { $pull: { booking_id_list: id } },
                        { session }
                    ).exec()
                }

                const deletedDoc = await BookingModelMongodb.findOneAndDelete({ _id: id }, { session }).exec()
                if (!deletedDoc) {
                    // Condición muy rara: existía al principio pero no ahora: forzar rollback
                    throw new Error(`Booking #${id} not found during delete`)
                }
            })
            return true
        }
        catch (error) {
            throw error
        }
        finally {
            session.endSession()
        }
    }

}

