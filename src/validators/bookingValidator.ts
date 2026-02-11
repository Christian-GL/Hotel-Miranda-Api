
import {
    validateDate, validateString, validateNumber, validateOptionYesNo,
    validateCheckInCheckOutNewBooking, validateDateIsOccupied,
    validateDateIsOccupiedIfBookingExists, validateTextArea, validateStringList,
    validateCheckInCheckOutExistingBooking
} from "./commonValidator"
import { BookingInterfaceCheckInOutId, BookingInterfaceCheckInOut, BookingInterface, BookingInterfaceId } from "../interfaces/mongodb/bookingInterfaceMongodb"


export class BookingValidator {

    private validatePropertyTypes(booking: BookingInterface): string[] {
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
        validateStringList(booking.room_id_list, 'room_id_list').map(
            error => errorMessages.push(error)
        )
        validateString(booking.client_id, 'client_id').map(
            error => errorMessages.push(error)
        )

        return errorMessages
    }

    private validateBooking(booking: BookingInterface, allRoomIdsNotArchived: string[], clientId: string, allClientIdsNotArchived: string[]): string[] {
        const allErrorMessages: string[] = []

        if (booking === undefined || Object.keys(booking).length === 0) {
            allErrorMessages.push('Room is undefined or empty')
            return allErrorMessages
        }
        const errorsCheckingProperties = this.validatePropertyTypes(booking)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        if (booking.room_id_list.length < 1) {
            allErrorMessages.push('Room ID list is empty')
        }
        if (booking.client_id === '') {
            allErrorMessages.push('Client ID is empty')
        }
        validateTextArea(booking.special_request, 'Booking special request').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(booking.isArchived, 'Booking isArchived').map(
            error => allErrorMessages.push(error)
        )

        // Comprobamos que los IDs de las rooms y el cliente asociados a la booking existan en BD
        for (const roomID of booking.room_id_list) {
            if (!allRoomIdsNotArchived.includes(roomID)) {
                allErrorMessages.push(`Room ID: ${roomID} didn't exist in DB or is archived`)
            }
        }
        if (!allClientIdsNotArchived.includes(clientId)) {
            allErrorMessages.push(`Client ID: ${clientId} didn't exist in DB or is archived`)
        }

        return allErrorMessages
    }

    validateNewBooking(booking: BookingInterface, allBookingDatesByRoomsNotArchived: BookingInterfaceCheckInOut[], allRoomIdsNotArchived: string[], clientID: string, allClientIdsNotArchived: string[]): string[] {
        const allErrorMessages: string[] = []

        if (booking === undefined || Object.keys(booking).length === 0) {
            allErrorMessages.push('Booking is undefined or empty')
            return allErrorMessages
        }

        this.validateBooking(booking, allRoomIdsNotArchived, clientID, allClientIdsNotArchived).map(
            error => allErrorMessages.push(error)
        )
        validateCheckInCheckOutNewBooking(booking.check_in_date, booking.check_out_date).map(
            error => allErrorMessages.push(error)
        )
        validateDateIsOccupied(booking, allBookingDatesByRoomsNotArchived).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateExistingBooking(booking: BookingInterfaceId, allBookingDatesAndIdByRoomsNotArchived: BookingInterfaceCheckInOutId[], allRoomIdsNotArchived: string[], clientID: string, allClientIdsNotArchived: string[]): string[] {
        const allErrorMessages: string[] = []

        if (booking === undefined || Object.keys(booking).length === 0) {
            allErrorMessages.push('Booking is undefined or empty')
            return allErrorMessages
        }

        this.validateBooking(booking, allRoomIdsNotArchived, clientID, allClientIdsNotArchived).map(
            error => allErrorMessages.push(error)
        )
        validateCheckInCheckOutExistingBooking(booking.check_in_date, booking.check_out_date).map(
            error => allErrorMessages.push(error)
        )
        validateDateIsOccupiedIfBookingExists(booking, allBookingDatesAndIdByRoomsNotArchived).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

}