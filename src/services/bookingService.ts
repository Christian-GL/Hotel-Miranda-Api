
import { ServiceInterface } from '../interfaces/serviceInterface'
import { BookingModel } from '../models/bookingModel'
import { BookingInterface } from '../interfaces/bookingInterface'
import { RoomService } from './roomService'


export class BookingService implements ServiceInterface<BookingInterface> {

    private roomService: RoomService
    constructor() {
        this.roomService = new RoomService()
    }

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
            const roomOfBooking = await this.roomService.fetchById(booking.room.id)
            if (roomOfBooking === null) {
                throw { status: 404, message: `Room #${booking.room.id} not found` }
            }
            else {
                const newBooking: BookingInterface = new BookingModel(booking)
                await newBooking.save()
                return newBooking
            }
        }
        catch (error) {
            console.error('Error in create of bookingService', error)
            throw error
        }
    }

    async update(id: number | string, booking: BookingInterface): Promise<BookingInterface | null> {
        try {
            const roomOfBooking = await this.roomService.fetchById(booking.room.id)
            if (roomOfBooking === null) {
                throw { status: 404, message: `Room #${booking.room.id} not found` }
            }
            else {
                const updatedBooking: BookingInterface | null = await BookingModel.findOneAndUpdate(
                    { _id: id },
                    booking,
                    { new: true }
                )
                if (updatedBooking) return updatedBooking
                else return null
            }
        }
        catch (error) {
            console.error('Error in update of bookingService', error)
            throw error
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const deletedBooking = await BookingModel.findByIdAndDelete(id)
            if (deletedBooking) return true
            else return false
        }
        catch (error) {
            console.error('Error in delete of bookingService', error)
            throw error
        }
    }

}