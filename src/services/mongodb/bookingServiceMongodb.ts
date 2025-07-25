
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'
import { BookingInterfaceMongodb } from '../../interfaces/mongodb/bookingInterfaceMongodbts'


export class BookingServiceMongodb implements ServiceInterfaceMongodb<BookingInterfaceMongodb> {

    async fetchAll(): Promise<BookingInterfaceMongodb[]> {
        try {
            const bookings: BookingInterfaceMongodb[] = await BookingModelMongodb.find()
            return bookings
        }
        catch (error) {
            console.error('Error in fetchAll of bookingService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<BookingInterfaceMongodb | null> {
        try {
            const booking: BookingInterfaceMongodb | null = await BookingModelMongodb.findById(id)
            if (booking) return booking
            else throw new Error('Booking not found')
        }
        catch (error) {
            console.error('Error in fetchById of bookingService', error)
            throw error
        }
    }

    async create(booking: BookingInterfaceMongodb): Promise<BookingInterfaceMongodb> {
        try {
            const newBooking: BookingInterfaceMongodb = new BookingModelMongodb(booking)
            await newBooking.save()
            return newBooking
        }
        catch (error) {
            console.error('Error in create of bookingService', error)
            throw error
        }
    }

    async update(id: string, booking: BookingInterfaceMongodb): Promise<BookingInterfaceMongodb | null> {
        try {
            const existingBooking: BookingInterfaceMongodb | null = await this.fetchById(id)
            if (existingBooking == null) return null

            const updatedBooking: BookingInterfaceMongodb | null = await BookingModelMongodb.findOneAndUpdate(
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