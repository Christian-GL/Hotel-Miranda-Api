
import { validatePhoto, validateFullName, validateDateRelativeToNow, validateTextArea } from "./commonValidator"
import { BookingInterface } from "../interfaces/bookingInterface"
import { BookingStatus } from "../enums/bookingStatus"
import { RoomType } from "../enums/roomType"
import { RoomValidator } from "./roomValidator"
import { RoomInterface } from "../interfaces/roomInterface"


export class BookingValidator {

    validateProperties(booking: BookingInterface): string[] {
        const errorMessages: string[] = []
        const bookingRequiredProperties: string[] = ['photo', 'full_name_guest', 'order_date',
            'check_in_date', 'check_out_date', 'status', 'special_request', 'room_list']

        bookingRequiredProperties.map(property => {
            if (!(property in booking)) {
                errorMessages.push(`Property [${property}] is required in Booking`)
            }
        })
        return errorMessages
    }

    validateBooking(booking: BookingInterface, allBookings: BookingInterface[], allRooms: RoomInterface[]): string[] {
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
        validateDateRelativeToNow(new Date(booking.order_date), true, 'Order date').map(
            error => allErrorMessages.push(error)
        )
        this.validateCheckInCheckOut(new Date(booking.check_in_date), new Date(booking.check_out_date)).map(
            error => allErrorMessages.push(error)
        )
        this.validateDateIsOccupied(new Date(booking.check_in_date), new Date(booking.check_out_date), allBookings).map(
            error => allErrorMessages.push(error)
        )
        this.validateBookingStatus(booking.status).map(
            error => allErrorMessages.push(error)
        )
        validateTextArea(booking.special_request, 'Special request').map(
            error => allErrorMessages.push(error)
        )
        this.validateRoomList(booking.room_list, allRooms).map(
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
    validateRoomList(roomList: Partial<RoomInterface[]>, allRooms: RoomInterface[]): string[] {
        const errorMessages: string[] = []
        const roomValidator = new RoomValidator()
        const roomRequiredProperties: string[] = ['_id', 'photos', 'number', 'type', 'amenities', 'price', 'discount']

        roomList.map(room => {
            if (room === undefined || Object.keys(room).length === 0) {
                errorMessages.push('Some booking in booking_list of rooms is undefined or empty')
                return
            }
            roomRequiredProperties.map((property) => {
                if (!(property in room)) {
                    errorMessages.push(`Property [${property}] is required in Room of room_list`)
                    return errorMessages
                }
            })

            roomValidator.validateNumber(room.number, true, allRooms).forEach(
                error => errorMessages.push(error)
            )
            roomValidator.validateRoomType(room.type).forEach(
                error => errorMessages.push(error)
            )
            roomValidator.validateAmenities(room.amenities).forEach(
                error => errorMessages.push(error)
            )
            roomValidator.validateRoomPrice(room.price).forEach(
                error => errorMessages.push(error)
            )
            roomValidator.validateRoomDiscount(room.discount).forEach(
                error => errorMessages.push(error)
            )
        })

        return errorMessages
    }

}