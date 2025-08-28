
import {
    validateDate, validateString, validateNumber,
    validateOptionYesNo, validateCheckInCheckOut, validateDateIsOccupied,
    validateDateIsOccupiedIfBookingExists,
    validateRoomPrice,
    validateTextArea
} from "./commonValidator"
import { BookingInterfaceDTO } from "../interfaces/mongodb/bookingInterfaceMongodb"
import { RoomInterfaceDTO, RoomInterfaceIdMongodb } from "../interfaces/mongodb/roomInterfaceMongodb"


export class BookingValidator {

    validatePropertyTypes(booking: BookingInterfaceDTO): string[] {
        const errorMessages: string[] = []

        validateDate(booking.order_date, 'order_date').map(
            error => errorMessages.push(error)
        )
        validateDate(booking.check_in_date, 'check_in_date').map(
            error => errorMessages.push(error)
        )
        validateDate(booking.check_out_date, 'check_out_date').map(
            error => errorMessages.push(error)
        )
        validateNumber(booking.price, 'price').map(
            error => errorMessages.push(error)
        )
        validateString(booking.special_request, 'special_request').map(
            error => errorMessages.push(error)
        )
        validateOptionYesNo(booking.isArchived, 'isArchived').map(
            error => errorMessages.push(error)
        )
        validateString(booking.room_id_list, 'room_id').map(
            error => errorMessages.push(error)
        )
        validateString(booking.client_id, 'client_id').map(
            error => errorMessages.push(error)
        )

        return errorMessages
    }

    private validateBooking(booking: BookingInterfaceDTO, allBookings: BookingInterfaceDTO[], allRooms: RoomInterfaceDTO[]): string[] {
        const allErrorMessages: string[] = []

        if (booking === undefined || Object.keys(booking).length === 0) {
            allErrorMessages.push('Room is undefined or empty')
            return allErrorMessages
        }
        const errorsCheckingProperties = this.validatePropertyTypes(booking)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        validateTextArea(booking.special_request, 'Booking special request').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(booking.isArchived, 'Room isActive').map(
            error => allErrorMessages.push(error)
        )
        validateCheckInCheckOut(booking.check_in_date, booking.check_out_date).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateNewBooking(booking: BookingInterfaceDTO, allBookings: BookingInterfaceDTO[], allRooms: RoomInterfaceDTO[]): string[] {
        const allErrorMessages: string[] = []

        if (booking === undefined || Object.keys(booking).length === 0) {
            allErrorMessages.push('Booking is undefined or empty')
            return allErrorMessages
        }
        const errorsCheckingProperties = this.validatePropertyTypes(booking)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        this.validateBooking(booking, allBookings, allRooms).map(
            error => allErrorMessages.push(error)
        )
        validateDateIsOccupied(booking, allBookings).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateExistingBooking(booking: BookingInterfaceDTO, allBookings: BookingInterfaceDTO[], allRooms: RoomInterfaceDTO[]): string[] {
        const allErrorMessages: string[] = []

        if (booking === undefined || Object.keys(booking).length === 0) {
            allErrorMessages.push('Booking is undefined or empty')
            return allErrorMessages
        }
        const errorsCheckingProperties = this.validatePropertyTypes(booking)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        this.validateBooking(booking, allBookings, allRooms).map(
            error => allErrorMessages.push(error)
        )
        // validateDateIsOccupiedIfBookingExists(booking, allBookings).map(
        //     error => allErrorMessages.push(error)
        // )

        return allErrorMessages
    }

}