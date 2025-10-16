
import {
    validateDate, validateString, validateNumber,
    validateOptionYesNo, validateCheckInCheckOut, validateDateIsOccupied,
    validateDateIsOccupiedIfBookingExists, validateRoomPrice,
    validateTextArea, validateStringList
} from "./commonValidator"
import { BookingInterfaceDTO, BookingInterfaceId, BookingInterfaceIdMongodb } from "../interfaces/mongodb/bookingInterfaceMongodb"


export class BookingValidator {

    private validatePropertyTypes(booking: BookingInterfaceDTO): string[] {
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

    private validateBooking(booking: BookingInterfaceDTO, allRoomIdsNotArchived: string[], clientID: string, clientIdsNotArchived: string[]): string[] {
        const allErrorMessages: string[] = []

        if (booking === undefined || Object.keys(booking).length === 0) {
            allErrorMessages.push('Room is undefined or empty')
            return allErrorMessages
        }
        const errorsCheckingProperties = this.validatePropertyTypes(booking)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        validateRoomPrice(booking.price, 'Price').map(
            error => allErrorMessages.push(error)
        )
        validateTextArea(booking.special_request, 'Booking special request').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(booking.isArchived, 'Room isActive').map(
            error => allErrorMessages.push(error)
        )
        validateCheckInCheckOut(booking.check_in_date, booking.check_out_date).map(
            error => allErrorMessages.push(error)
        )

        // Comprobamos que los IDs de las rooms y el cliente asociados a la booking existan en BD
        for (let roomID in booking.room_id_list) {
            if (!allRoomIdsNotArchived.includes(roomID)) {
                allErrorMessages.push(`Room ID: ${roomID} didn't exist in DB`)
            }
        }
        if (!clientIdsNotArchived.includes(clientID)) {
            allErrorMessages.push(`Client ID: ${clientID} didn't exist in DB`)
        }

        return allErrorMessages
    }

    validateNewBooking(booking: BookingInterfaceDTO, allBookingsNotArchived: BookingInterfaceDTO[], allRoomIdsNotArchived: string[], clientID: string, clientIdsNotArchived: string[]): string[] {
        const allErrorMessages: string[] = []

        if (booking === undefined || Object.keys(booking).length === 0) {
            allErrorMessages.push('Booking is undefined or empty')
            return allErrorMessages
        }

        this.validateBooking(booking, allRoomIdsNotArchived, clientID, clientIdsNotArchived).map(
            error => allErrorMessages.push(error)
        )
        validateDateIsOccupied(booking, allBookingsNotArchived).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateExistingBooking(booking: BookingInterfaceId, allBookingsNotArchived: BookingInterfaceIdMongodb[], allRoomIdsNotArchived: string[], clientID: string, clientIdsNotArchived: string[]): string[] {
        const allErrorMessages: string[] = []

        if (booking === undefined || Object.keys(booking).length === 0) {
            allErrorMessages.push('Booking is undefined or empty')
            return allErrorMessages
        }

        this.validateBooking(booking, allRoomIdsNotArchived, clientID, clientIdsNotArchived).map(
            error => allErrorMessages.push(error)
        )
        validateDateIsOccupiedIfBookingExists(booking, allBookingsNotArchived).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

}