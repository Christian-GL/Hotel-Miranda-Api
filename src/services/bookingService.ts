
import bookingData from '../data/bookingData.json'
import { BookingInterface } from '../interfaces/bookingInterface'
import { ServiceInterface } from '../interfaces/serviceInterface'
import { checkFirstIDAvailable } from '../utils/dateUtils'


export class BookingService implements ServiceInterface<BookingInterface> {

    private bookings: BookingInterface[] = bookingData as BookingInterface[]

    fetchAll(): BookingInterface[] {
        return this.bookings
    }

    fetchById(id: number): BookingInterface | null {
        const booking = this.bookings.find(booking => booking.id === id)
        return booking === undefined ? null : booking
    }

    create(booking: BookingInterface): BookingInterface {
        const newBooking = { ...booking, id: checkFirstIDAvailable(this.bookings.map(item => item.id)) }
        this.bookings.push(newBooking)
        return newBooking
    }

    update(bookingIn: BookingInterface): BookingInterface | null {
        const bookingToUpdate = this.bookings.find(booking => booking.id === bookingIn.id)
        if (bookingToUpdate) {
            const updatedBooking = { ...bookingToUpdate, ...bookingIn }
            this.bookings = this.bookings.map(booking =>
                booking.id === bookingIn.id ? updatedBooking : booking
            )
            return updatedBooking
        }
        else return null
    }

    delete(id: number): boolean {
        const bookingToDelete = this.bookings.find(booking => booking.id === id)
        if (bookingToDelete) {
            this.bookings = this.bookings.filter(booking => booking.id !== id)
            return true
        }
        return false
    }

}