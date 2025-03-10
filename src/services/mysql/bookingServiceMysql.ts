
import { ServiceInterfaceMysql } from '../../interfaces/mysql/serviceInterfaceMysql'
import { BookingModelMysql } from '../../models/mysql/bookingModelMysql'
import { BookingInterfaceMysql } from '../../interfaces/mysql/bookingInterfaceMysql'


export class BookingServiceMysql implements ServiceInterfaceMysql<BookingInterfaceMysql> {

    async fetchAll(): Promise<BookingInterfaceMysql[]> {
        try {
            const bookings: BookingInterfaceMysql[] = await BookingModelMysql.findAll()
            const bookingsParsed = bookings.map(booking => ({
                _id: booking._id,
                photo: booking.photo,
                full_name_guest: booking.full_name_guest,
                order_date: booking.order_date,
                check_in_date: booking.check_in_date,
                check_out_date: booking.check_out_date,
                special_request: booking.special_request,
                room_id: booking.room_id
            }))
            return bookingsParsed
        }
        catch (error) {
            console.error('Error in fetchAll of bookingService', error)
            throw error
        }
    }

    async fetchById(id: number): Promise<BookingInterfaceMysql | null> {
        try {
            const booking: BookingInterfaceMysql | null = await BookingModelMysql.findByPk(id)
            if (booking !== null) {
                const bookingParsed = {
                    _id: booking._id,
                    photo: booking.photo,
                    full_name_guest: booking.full_name_guest,
                    order_date: booking.order_date,
                    check_in_date: booking.check_in_date,
                    check_out_date: booking.check_out_date,
                    special_request: booking.special_request,
                    room_id: booking.room_id
                }
                return bookingParsed
            }
            else throw new Error('Booking not found')
        }
        catch (error) {
            console.error('Error in fetchById of bookingService', error)
            throw error
        }
    }

    async create(booking: BookingInterfaceMysql): Promise<BookingInterfaceMysql> {
        try {
            const newBooking: BookingInterfaceMysql = await BookingModelMysql.create(booking)
            return newBooking
        }
        catch (error) {
            console.error('Error in create of bookingService', error)
            throw error
        }
    }

    async update(id: number, booking: BookingInterfaceMysql): Promise<BookingInterfaceMysql | null> {
        try {
            const existingBooking: BookingInterfaceMysql | null = await this.fetchById(id)
            if (existingBooking == null) return null

            const [updatedBooking] = await BookingModelMysql.update(booking, { where: { _id: id } })
            if (updatedBooking === 0) return null

            return await this.fetchById(id)
        }
        catch (error) {
            console.error('Error in update of bookingService', error)
            throw error
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const deletedBooking = await BookingModelMysql.destroy({ where: { _id: id } })

            if (deletedBooking) return true
            else return false
        }
        catch (error) {
            console.error('Error in delete of bookingService', error)
            throw error
        }
    }

}