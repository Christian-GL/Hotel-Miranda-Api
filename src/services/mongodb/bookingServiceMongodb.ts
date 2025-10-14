
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

    async fetchAllIDsNotArchived(): Promise<BookingInterfaceIdMongodb[]> {
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

    async delete(id: string): Promise<boolean> {
        try {
            const deletedBooking = await BookingModelMongodb.findByIdAndDelete(id)
            if (deletedBooking) {
                return true
            }
            else return false
        }
        catch (error) {
            console.error('Error in delete of bookingService', error)
            throw error
        }
    }

}