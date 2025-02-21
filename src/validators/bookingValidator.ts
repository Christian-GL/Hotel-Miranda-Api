
import { validatePhoto, validateFullName, validateDateRelativeToNow, validateTextArea } from "./commonValidator"
import { BookingInterface } from "../interfaces/bookingInterface"
import { BookingStatus } from "../enums/bookingStatus"
import { RoomType } from "../enums/roomType"


export class BookingValidator {

    validateProperties(booking: BookingInterface): string[] {
        const errorMessages: string[] = []
        const bookingRequiredProperties: string[] = ['photo', 'full_name_guest', 'order_date',
            'check_in_date', 'check_out_date', 'room', 'booking_status', 'special_request']
        const roomRequiredProperties: string[] = ['id', 'type']

        bookingRequiredProperties.map(property => {
            if (!(property in booking)) {
                errorMessages.push(`Property [${property}] is required in Booking`)
            }
        })
        if (booking.room) {
            roomRequiredProperties.map(property => {
                if (!(property in booking.room)) {
                    errorMessages.push(`Property [${property}] is required in Booking.room`)
                }
            })
        } else errorMessages.push('Property [Booking.room] is required in Booking')

        return errorMessages
    }

    validateBooking(booking: BookingInterface, allBookings: BookingInterface[]): string[] {
        const allErrorMessages: string[] = []

        const errorsCheckingProperties = this.validateProperties(booking)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        // validatePhoto(booking.photo, 'Photo').map(
        //     error => allErrorMessages.push(error)
        // )
        validateFullName(booking.full_name_guest, 'Full name guest').map(
            error => allErrorMessages.push(error)
        )
        validateDateRelativeToNow(booking.order_date, true, 'Order date').map(
            error => allErrorMessages.push(error)
        )
        this.validateCheckInCheckOut(booking.check_in_date, booking.check_out_date).map(
            error => allErrorMessages.push(error)
        )
        this.validateDateIsOccupied(booking.check_in_date, booking.check_out_date, allBookings).map(
            error => allErrorMessages.push(error)
        )
        if (booking.room.id) {
            this.validateRoomId(booking.room.id).map(
                error => allErrorMessages.push(error)
            )
        } else allErrorMessages.push('Booking.room.id not found')

        if (booking.room.type) {
            this.validateRoomType(booking.room.type).map(
                error => allErrorMessages.push(error)
            )
        } else allErrorMessages.push('Booking.room.type not found')

        this.validateBookingStatus(booking.booking_status).map(
            error => allErrorMessages.push(error)
        )
        validateTextArea(booking.special_request, 'Special request').map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateRoomId(roomId: string): string[] {
        const errorMessages: string[] = []

        if (typeof roomId !== "string") {
            errorMessages.push('Room id is not a string')
        }

        return errorMessages
    }
    validateRoomType(type: string): string[] {
        const errorMessages: string[] = []

        if (typeof type !== "string") {
            errorMessages.push('Room Type is not a String')
        }
        if (!Object.values(RoomType).includes(type as RoomType)) {
            errorMessages.push('Room type is not a valid value')
        }

        return errorMessages
    }
    validateBookingStatus(type: string): string[] {
        const errorMessages: string[] = []

        if (typeof type !== "string") {
            errorMessages.push('Booking status is not a String')
        }
        if (!Object.values(BookingStatus).includes(type as BookingStatus)) {
            errorMessages.push('Booking status is not a valid value')
        }

        return errorMessages
    }
    validateCheckInCheckOut(checkIn: Date, checkOut: Date): string[] {
        const errorMessages: string[] = []

        validateDateRelativeToNow(checkIn, false, 'Check in date').map(
            error => errorMessages.push(error)
        )
        validateDateRelativeToNow(checkOut, false, 'Check out date').map(
            error => errorMessages.push(error)
        )
        if (checkIn >= checkOut) {
            errorMessages.push('Check in date must be before Check out date')
        }

        return errorMessages
    }
    validateDateIsOccupied(checkIn: Date, checkOut: Date, bookings: BookingInterface[]): string[] {
        const errorMessages: string[] = []

        for (let i = 0; i < bookings.length; i++) {
            if (checkIn < bookings[i].check_out_date && checkOut > bookings[i].check_in_date) {
                errorMessages.push(`This period is already occupied by booking #${bookings[i]._id}`)
            }
        }
        return errorMessages
    }


}