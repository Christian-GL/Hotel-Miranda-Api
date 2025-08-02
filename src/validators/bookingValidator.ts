
// import { validatePhoto, validateFullName, validateDateRelativeToNow, validateTextArea } from "./commonValidator"
import { BookingInterfaceIdMongodb } from "../interfaces/mongodb/bookingInterfaceMongodb"
import { BookingInterfaceMysql } from "../interfaces/mysql/bookingInterfaceMysql"
import { RoomType } from "../enums/roomType"
import { RoomInterfaceIdMongodb } from "../interfaces/mongodb/roomInterfaceMongodb"
import { RoomInterfaceMysql } from "../interfaces/mysql/roomInterfaceMysql"


export class BookingValidator {

    validateProperties(booking: BookingInterfaceIdMongodb | BookingInterfaceMysql): string[] {
        const errorMessages: string[] = []
        let bookingRequiredProperties = ['photo', 'full_name_guest', 'order_date',
            'check_in_date', 'check_out_date', 'special_request', 'room_id']

        bookingRequiredProperties.map(property => {
            if (!(property in booking)) {
                errorMessages.push(`Property [${property}] is required in Booking`)
            }
        })
        return errorMessages
    }

    validateBooking(booking: BookingInterfaceIdMongodb | BookingInterfaceMysql, allBookings: BookingInterfaceIdMongodb[] | BookingInterfaceMysql[], allRooms: RoomInterfaceIdMongodb[] | RoomInterfaceMysql[]): string[] {
        const errorMessages: string[] = []

        if (booking === undefined || Object.keys(booking).length === 0) {
            errorMessages.push('Room is undefined or empty')
            return errorMessages
        }
        const errorsCheckingProperties = this.validateProperties(booking)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        // validateIDObjectId(booking._id, '_ID').map(error => errorMessages.push(error))
        // validatePhoto(booking.photo, 'Photo').map(error => allErrorMessages.push(error))
        // validateFullName(booking.full_name_guest, 'Full name guest').map(error => errorMessages.push(error))
        // validateDateRelativeToNow(new Date(booking.order_date), true, 'Order date').map(error => errorMessages.push(error))
        // this.validateCheckInCheckOut(new Date(booking.check_in_date), new Date(booking.check_out_date)).map(error => errorMessages.push(error))
        // this.validateDateIsOccupied(booking, allBookings).map(error => errorMessages.push(error))
        // validateTextArea(booking.special_request, 'Special request').map(error => errorMessages.push(error))
        // this.validateRoomList(booking.room_id, allRooms).map(error => errorMessages.push(error))

        return errorMessages
    }

    // validateRoomId(roomId: string): string[] {
    //     const errorMessages: string[] = []

    //     if (typeof roomId !== "string") {
    //         errorMessages.push('Room id is not a string')
    //     }

    //     return errorMessages
    // }
    // validateRoomType(type: string): string[] {
    //     const errorMessages: string[] = []

    //     if (typeof type !== "string") {
    //         errorMessages.push('Room Type is not a String')
    //     }
    //     if (!Object.values(RoomType).includes(type as RoomType)) {
    //         errorMessages.push('Room type is not a valid value')
    //     }

    //     return errorMessages
    // }
    // validateCheckInCheckOut(checkIn: Date, checkOut: Date): string[] {
    //     const errorMessages: string[] = []

    //     validateDateRelativeToNow(checkIn, false, 'Check in date').map(
    //         error => errorMessages.push(error)
    //     )
    //     validateDateRelativeToNow(checkOut, false, 'Check out date').map(
    //         error => errorMessages.push(error)
    //     )
    //     if (checkIn >= checkOut) {
    //         errorMessages.push('Check in date must be before Check out date')
    //     }

    //     return errorMessages
    // }
    // validateDateIsOccupied(booking: BookingInterfaceIdMongodb | BookingInterfaceMysql, bookings: BookingInterfaceIdMongodb[] | BookingInterfaceMysql[]): string[] {
    //     const errorMessages: string[] = []

    //     for (let i = 0; i < bookings.length; i++) {
    //         if (new Date(booking.check_in_date) < new Date(bookings[i].check_out_date) &&
    //             new Date(booking.check_out_date) > new Date(bookings[i].check_in_date)) {
    //             if (booking._id.toString() !== bookings[i]._id.toString()) {
    //                 errorMessages.push(`This period is already occupied by booking #${bookings[i]._id}`)
    //             }
    //         }
    //     }
    //     return errorMessages
    // }
    // validateRoomList(roomId: string, allRooms: RoomInterfaceIdMongodb[] | RoomInterfaceMysql[]): string[] {
    //     const errorMessages: string[] = []

    //     // validateIDstring(roomId, 'ID').map(error => {
    //     //     errorMessages.push(error)
    //     // })
    //     const roomExists = allRooms.some(room => room._id.toString() === roomId)
    //     if (!roomExists) {
    //         errorMessages.push(`Room with ID #${roomId} does not exist`)
    //     }

    //     return errorMessages
    // }

}