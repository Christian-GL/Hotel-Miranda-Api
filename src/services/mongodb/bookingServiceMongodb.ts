
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'
import { BookingInterfaceDTO, BookingInterfaceIdMongodb } from '../../interfaces/mongodb/bookingInterfaceMongodb'


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