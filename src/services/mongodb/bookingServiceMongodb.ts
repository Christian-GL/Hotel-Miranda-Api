
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'
import { BookingInterfaceDTO, BookingInterfaceIdMongodb } from '../../interfaces/mongodb/bookingInterfaceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'
import mongoose from 'mongoose'
import { RoomModelMongodb } from '../../models/mongodb/roomModelMongodb'


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
            console.error('Error in fetchAllIds of bookingService', error)
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

    async createAndLinkRooms(bookingDTO: BookingInterfaceDTO): Promise<BookingInterfaceIdMongodb> {
        // Crea una booking y añade su _id al "booking_id_list" de todas las rooms indicadas.
        const session = await mongoose.startSession()
        try {
            let createdBookingId: string | null = null

            await session.withTransaction(async () => {

                // Creamos la booking
                const createdArr = await BookingModelMongodb.create([bookingDTO], { session })
                const bookingDoc = createdArr[0] as any
                createdBookingId = String(bookingDoc._id)

                // Actualizamos las rooms asociadas añadiendo el id de la booking a su "booking_id_list"
                const roomIds: string[] = Array.isArray(bookingDTO.room_id_list) ? bookingDTO.room_id_list.map(String) : []
                if (roomIds.length > 0) {
                    const foundRooms = await RoomModelMongodb.find({ _id: { $in: roomIds } })
                        .select('_id')
                        .session(session)
                        .lean()
                    const foundSet = new Set(foundRooms.map((room: any) => String(room._id)))
                    const missing = roomIds.filter(id => !foundSet.has(id))

                    if (missing.length > 0) {
                        throw new Error(`Some room IDs do not exist: ${missing.join(', ')}`)
                    }
                    else {
                        await RoomModelMongodb.updateMany(
                            { _id: { $in: roomIds } },
                            { $addToSet: { booking_id_list: bookingDoc._id } },
                            { session }
                        )
                    }
                }
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

    async updateAndLinkRooms(id: string, bookingDTO: BookingInterfaceDTO): Promise<BookingInterfaceIdMongodb | null> {
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

                // Validar existencia de rooms que vamos a AÑADIR (IdsToAdd)
                if (IdsToAdd.length > 0) {
                    const found = await RoomModelMongodb.find({ _id: { $in: IdsToAdd } }).select('_id').session(session).lean()
                    const foundSet = new Set(found.map((r: any) => String(r._id)))
                    const missing = IdsToAdd.filter(id => !foundSet.has(id))
                    if (missing.length > 0) {
                        throw new Error(`Some room IDs do not exist: ${missing.join(', ')}`)
                    }
                }

                // Actualizar la booking dentro de la sesión
                const updatedBookingDoc = await BookingModelMongodb.findOneAndUpdate(
                    { _id: id },
                    bookingDTO,
                    { new: true, session }
                ).exec()

                // Condición de error rara pero realizada por seguridad:
                if (!updatedBookingDoc) {
                    throw new Error(`Booking #${id} not found`)
                }

                // Lógica sobre isArchived
                const oldArchived = String(bookingToUpdate.isArchived ?? '').toLowerCase()
                const newArchived = String(bookingDTO.isArchived ?? '').toLowerCase()

                if (oldArchived !== newArchived) {
                    if (newArchived === String(OptionYesNo.yes)) {
                        if (oldRoomIds.length > 0) {
                            await RoomModelMongodb.updateMany(
                                { _id: { $in: oldRoomIds }, booking_id_list: updatedBookingDoc._id },
                                { $pull: { booking_id_list: updatedBookingDoc._id } },
                                { session }
                            ).exec()
                        }
                    }
                    else {
                        if (newRoomIds.length > 0) {
                            // validación ya hecha para IdsToAdd, pero aquí añadimos a todas las newRoomIds (asegúrate que existen)
                            // Para seguridad validamos existencia de newRoomIds (si no lo validaste antes):
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


    async delete(id: string): Promise<boolean> {
        // Borra la booking y elimina su id de referencia en las rooms asociadas
        const session = await mongoose.startSession()
        try {
            let deleted = false

            await session.withTransaction(async () => {
                const booking = await BookingModelMongodb.findById(id).session(session).lean() as (BookingInterfaceIdMongodb | null)
                if (!booking) {
                    deleted = false
                    return
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

                const deletedDoc = await BookingModelMongodb.findOneAndDelete({ _id: id }, { session }).exec()
                if (!deletedDoc) {
                    // condición rara: hubo booking al inicio, pero aquí no se encuentra: provocar rollback
                    throw new Error(`Booking #${id} not found during delete`)
                }

                deleted = true
            })
            return deleted
        }
        catch (error) {
            throw error
        }
        finally {
            session.endSession()
        }
    }

}

