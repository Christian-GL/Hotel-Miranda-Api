
import { validatePhoto, validateFullName, validateDateRelativeToNow, validateTextArea } from "./commonValidator"
import { BookingInterface } from "../interfaces/bookingInterface"
import { BookingStatus } from "../enums/bookingStatus"
import { RoomType } from "../enums/roomType"
import { RoomValidator } from "./roomValidator"
import { RoomInterface } from "../interfaces/roomInterface"


export class BookingValidator {

    validateProperties(booking: BookingInterface, checkRoomList: boolean): string[] {
        const errorMessages: string[] = []
        let bookingRequiredProperties: string[]
        checkRoomList ?
            bookingRequiredProperties = ['photo', 'full_name_guest', 'order_date',
                'check_in_date', 'check_out_date', 'status', 'special_request', 'room_list']
            :
            bookingRequiredProperties = ['photo', 'full_name_guest', 'order_date',
                'check_in_date', 'check_out_date', 'status', 'special_request']

        bookingRequiredProperties.map(property => {
            if (!(property in booking)) {
                errorMessages.push(`Property [${property}] is required in Booking`)
            }
        })
        return errorMessages
    }

    validateBooking(booking: BookingInterface, allBookings: BookingInterface[], allRooms?: RoomInterface[]): string[] {

        const allErrorMessages: string[] = []

        let checkRoomList: boolean
        allRooms === undefined ? checkRoomList = false : checkRoomList = true
        const errorsCheckingProperties = this.validateProperties(booking, checkRoomList)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        // validatePhoto(booking.photo, 'Photo').map(error => allErrorMessages.push(error))
        validateFullName(booking.full_name_guest, 'Full name guest').map(error => allErrorMessages.push(error))
        validateDateRelativeToNow(new Date(booking.order_date), true, 'Order date').map(error => allErrorMessages.push(error))
        this.validateCheckInCheckOut(new Date(booking.check_in_date), new Date(booking.check_out_date)).map(error => allErrorMessages.push(error))
        // this.validateDateIsOccupied(new Date(booking.check_in_date), new Date(booking.check_out_date), allBookings).map(error => allErrorMessages.push(error))
        this.validateDateIsOccupied(booking, allBookings).map(error => allErrorMessages.push(error))
        this.validateBookingStatus(booking.status).map(error => allErrorMessages.push(error))
        validateTextArea(booking.special_request, 'Special request').map(error => allErrorMessages.push(error))
        if (allRooms !== undefined) {
            this.validateRoomList(booking.room_list, allRooms).map(error => allErrorMessages.push(error))
        }

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
    validateDateIsOccupied(booking: BookingInterface, bookings: BookingInterface[]): string[] {
        const errorMessages: string[] = []

        for (let i = 0; i < bookings.length; i++) {
            console.log(booking._id)
            console.log(bookings[i]._id)
            if (new Date(booking.check_in_date) < new Date(bookings[i].check_out_date) &&
                new Date(booking.check_out_date) > new Date(bookings[i].check_in_date)) {
                errorMessages.push(`This period is already occupied by booking #${bookings[i]._id}`)
            }
        }
        return errorMessages
    }
    validateRoomList(roomList: Partial<RoomInterface[]>, allRooms: RoomInterface[]): string[] {
        const errorMessages: string[] = []
        const roomValidator = new RoomValidator()

        roomList.map(room => {
            if (room === undefined || Object.keys(room).length === 0) {
                errorMessages.push('Some booking in booking_list of rooms is undefined or empty')
                return
            }

            roomValidator.validateProperties(room, false)
            roomValidator.validateRoom(room, allRooms)
        })

        return errorMessages
    }

}