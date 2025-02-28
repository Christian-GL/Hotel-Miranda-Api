
import { validateIDstring, validateIDObjectId, validatePhoto, validateFullName, validateDateRelativeToNow, validateTextArea } from "./commonValidator"
import { BookingInterface } from "../interfaces/bookingInterface"
import { BookingStatus } from "../enums/bookingStatus"
import { RoomType } from "../enums/roomType"
import { RoomInterface } from "../interfaces/roomInterface"


export class BookingValidator {

    validateNewBookingProperties(booking: BookingInterface): string[] {
        const errorMessages: string[] = []
        let bookingRequiredProperties = ['photo', 'full_name_guest', 'order_date',
            'check_in_date', 'check_out_date', 'status', 'special_request', 'room_id']

        bookingRequiredProperties.map(property => {
            if (!(property in booking)) {
                errorMessages.push(`Property [${property}] is required in Booking`)
            }
        })
        return errorMessages
    }
    validateExistingBookingProperties(booking: BookingInterface): string[] {
        const errorMessages: string[] = []
        let bookingRequiredProperties = ['_id', 'photo', 'full_name_guest', 'order_date',
            'check_in_date', 'check_out_date', 'status', 'special_request', 'room_id']

        bookingRequiredProperties.map(property => {
            if (!(property in booking)) {
                errorMessages.push(`Property [${property}] is required in Booking`)
            }
        })
        return errorMessages
    }

    validateBooking(booking: BookingInterface, allBookings: BookingInterface[], allRooms: RoomInterface[]): string[] {

        const errorMessages: string[] = []

        if (booking === undefined || Object.keys(booking).length === 0) {
            errorMessages.push('Room is undefined or empty')
            return errorMessages
        }

        validateIDObjectId(booking._id, '_ID').map(error => errorMessages.push(error))
        // validatePhoto(booking.photo, 'Photo').map(error => allErrorMessages.push(error))
        validateFullName(booking.full_name_guest, 'Full name guest').map(error => errorMessages.push(error))
        validateDateRelativeToNow(new Date(booking.order_date), true, 'Order date').map(error => errorMessages.push(error))
        this.validateCheckInCheckOut(new Date(booking.check_in_date), new Date(booking.check_out_date)).map(error => errorMessages.push(error))
        // this.validateDateIsOccupied(new Date(booking.check_in_date), new Date(booking.check_out_date), allBookings).map(error => allErrorMessages.push(error))
        this.validateDateIsOccupied(booking, allBookings).map(error => errorMessages.push(error))
        this.validateBookingStatus(booking.status).map(error => errorMessages.push(error))
        validateTextArea(booking.special_request, 'Special request').map(error => errorMessages.push(error))
        this.validateRoomList(booking.room_id, allRooms).map(error => errorMessages.push(error))

        return errorMessages
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
    validateDateIsOccupied(booking: BookingInterface, bookings: BookingInterface[]): string[] {
        const errorMessages: string[] = []

        for (let i = 0; i < bookings.length; i++) {
            if (new Date(booking.check_in_date) < new Date(bookings[i].check_out_date) &&
                new Date(booking.check_out_date) > new Date(bookings[i].check_in_date)) {
                errorMessages.push(`This period is already occupied by booking #${bookings[i]._id}`)
            }
        }
        return errorMessages
    }
    validateRoomList(roomId: string, allRooms: RoomInterface[]): string[] {
        const errorMessages: string[] = []

        validateIDstring(roomId, 'ID').map(error => {
            errorMessages.push(error)
        })
        const roomExists = allRooms.some(room => room._id.toString() === roomId)
        if (!roomExists) {
            errorMessages.push(`Room with ID #${roomId} does not exist`)
        }

        return errorMessages
    }

}