
import { ServiceInterface } from '../interfaces/serviceInterface'
import { BookingModel } from '../models/bookingModel'
import { BookingInterface } from '../interfaces/bookingInterface'


export class BookingService implements ServiceInterface<BookingInterface> {

    async fetchAll(): Promise<BookingInterface[]> {
        try {
            const bookings: BookingInterface[] = await BookingModel.find()
            return bookings
        }
        catch (error) {
            console.error('Error in fetchAll of bookingService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<BookingInterface | null> {
        try {
            const booking: BookingInterface | null = await BookingModel.findById(id)
            if (booking) return booking
            else throw new Error('Booking not found')
        }
        catch (error) {
            console.error('Error in fetchById of bookingService', error)
            throw error
        }
    }

    async create(booking: BookingInterface): Promise<BookingInterface> {
        try {
            const newBooking: BookingInterface = new BookingModel(booking)
            await newBooking.save()
            return newBooking
        }
        catch (error) {
            console.error('Error in create of bookingService', error)
            throw error
        }
    }

    async update(id: string, booking: BookingInterface): Promise<BookingInterface | null> {
        try {
            const existingBooking: BookingInterface | null = await this.fetchById(id)
            if (existingBooking == null) return null

            const updatedBooking: BookingInterface | null = await BookingModel.findOneAndUpdate(
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
            const deletedBooking = await BookingModel.findByIdAndDelete(id)
            if (deletedBooking) {
                // await RoomModel.updateMany(
                //     { 'booking_list.id': id },
                //     { $pull: { booking_list: { id } } }
                // )
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