
import { BookingInterface } from "../interfaces/bookingInterface"
import { dateFormatToYYYYMMDD } from "../utils/dateUtils"
import { BookingStatus } from "../enums/bookingStatus"
import { RoomType } from "../enums/roomType"


export class BookingValidator {

    validateProperties(booking: BookingInterface): string[] {
        const errorMessages: string[] = []
        const bookingRequiredProperties: string[] = ['photo', 'full_name_guest', 'order_date', 'order_time', 'check_in_date', 'check_in_time',
            'check_out_date', 'check_out_time', 'room', 'room_booking_status', 'special_request']
        const roomRequiredProperties: string[] = ['id', 'type']
        bookingRequiredProperties.map(property => {
            if (!(property in booking)) {
                errorMessages.push(`Property [${property}] is required in Booking`)
            }
        })
        roomRequiredProperties.map(property => {
            if (!(property in booking.room)) {
                errorMessages.push(`Property [${property}] is required in Booking.room`)
            }
        })
        return errorMessages
    }

    validateBooking(booking: BookingInterface): string[] {
        const allErrorMessages: string[] = []

        const checkProperties = this.validateProperties(booking)
        if (checkProperties.length > 0) {
            return checkProperties
        }

        // this.validatePhoto(booking.photo).map(
        //     error => allErrorMessages.push(error)
        // )
        this.validateFullNameGuest(booking.full_name_guest).map(
            error => allErrorMessages.push(error)
        )
        this.validateOrderDate(booking.order_date).map(
            error => allErrorMessages.push(error)
        )
        this.validateOrderTime(booking.order_time).map(
            error => allErrorMessages.push(error)
        )
        this.validateCheckInDate(booking.check_in_date).map(
            error => allErrorMessages.push(error)
        )
        this.validateCheckInTime(booking.check_in_time).map(
            error => allErrorMessages.push(error)
        )
        this.validateCheckOutDate(booking.check_out_date).map(
            error => allErrorMessages.push(error)
        )
        this.validateCheckOutTime(booking.check_out_time).map(
            error => allErrorMessages.push(error)
        )
        if (booking.room.id) {
            this.validateRoomId(booking.room.id).map(
                error => allErrorMessages.push(error)
            )
        }
        if (booking.room.type) {
            this.validateRoomType(booking.room.type).map(
                error => allErrorMessages.push(error)
            )
        }
        this.validateBookingStatus(booking.room_booking_status).map(
            error => allErrorMessages.push(error)
        )
        this.validateSpecialRequest(booking.special_request).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validatePhoto(photo: string): string[] {
        const errorMessages: string[] = []
        const regex = /\.(png|jpg)$/i

        if (typeof photo !== "string") {
            errorMessages.push('Photo url is not a String')
        }
        if (!regex.test(photo)) {
            errorMessages.push('Not .png or .jpg file')
        }

        return errorMessages
    }
    validateFullNameGuest(fullNameGuest: string): string[] {
        const errorMessages: string[] = []
        const regex = new RegExp(/^[^\d]*$/)

        if (typeof fullNameGuest !== "string") {
            errorMessages.push('Name is not a String')
        }
        if (fullNameGuest.length < 3) {
            errorMessages.push('Name length must be 3 characters or more')
        }
        if (fullNameGuest.length > 50) {
            errorMessages.push('Name length must be 50 characters or less')
        }
        if (!regex.test(fullNameGuest)) {
            errorMessages.push('Name must not contain numbers')
        }

        return errorMessages
    }
    validateOrderDate(orderDate: string): string[] {
        const errorMessages: string[] = []

        const regex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/

        if (!regex.test(orderDate)) {
            errorMessages.push('Order date must be in the format DD/MM/YYYY')
            return errorMessages
        }

        const orderDateFormatted = dateFormatToYYYYMMDD(orderDate)
        const orderDateTypeDate = new Date(orderDateFormatted)
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)
        orderDateTypeDate.setHours(0, 0, 0, 0)

        if (isNaN(orderDateTypeDate.getTime())) {
            errorMessages.push('Order date is not a valid date')
        }
        if (orderDateTypeDate > currentDate) {
            errorMessages.push('Order date cant be afer today')
        }
        return errorMessages
    }
    validateOrderTime(orderTime: string): string[] {
        const errorMessages: string[] = []
        const regex = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/i

        if (!regex.test(orderTime)) {
            errorMessages.push('Order time must be in the format HH:MM AM/PM')
            return errorMessages
        }

        const [time, period] = orderTime.split(' ')
        const [hour, minute] = time.split(':')
        const hours = parseInt(hour)
        const minutes = parseInt(minute)

        if (hours < 1 || hours > 12) {
            errorMessages.push('Order time hours must be between 1 and 12');
        }
        if (minutes < 0 || minutes > 59) {
            errorMessages.push('Order time minutes must be between 00 and 59');
        }

        return errorMessages
    }
    validateCheckInDate(checkInDate: string): string[] {
        const errorMessages: string[] = []
        const regex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/

        if (!regex.test(checkInDate)) {
            errorMessages.push('Check in date must be in the format DD/MM/YYYY')
            return errorMessages
        }

        const checkInDateFormatted = dateFormatToYYYYMMDD(checkInDate)
        const checkInDateTypeDate = new Date(checkInDateFormatted)
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)
        checkInDateTypeDate.setHours(0, 0, 0, 0)

        if (isNaN(checkInDateTypeDate.getTime())) {
            errorMessages.push('Check in date is not a valid date')
        }
        if (checkInDateTypeDate < currentDate) {
            errorMessages.push('Check in date cant be before today')
        }
        return errorMessages
    }
    validateCheckInTime(checkInTime: string): string[] {
        const errorMessages: string[] = []
        const regex = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/i

        if (!regex.test(checkInTime)) {
            errorMessages.push('Check in time must be in the format HH:MM AM/PM')
            return errorMessages
        }

        const [time, period] = checkInTime.split(' ')
        const [hour, minute] = time.split(':')
        const hours = parseInt(hour)
        const minutes = parseInt(minute)

        if (hours < 1 || hours > 12) {
            errorMessages.push('Check in time hours must be between 1 and 12');
        }
        if (minutes < 0 || minutes > 59) {
            errorMessages.push('Check in time minutes must be between 00 and 59');
        }

        return errorMessages
    }
    validateCheckOutDate(checkOutDate: string): string[] {
        const errorMessages: string[] = []
        const regex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/

        if (!regex.test(checkOutDate)) {
            errorMessages.push('Check out date must be in the format DD/MM/YYYY')
            return errorMessages
        }

        const checkOutDateFormatted = dateFormatToYYYYMMDD(checkOutDate)
        const checkOutDateTypeDate = new Date(checkOutDateFormatted)
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)
        checkOutDateTypeDate.setHours(0, 0, 0, 0)

        if (isNaN(checkOutDateTypeDate.getTime())) {
            errorMessages.push('Check out date is not a valid date')
        }
        if (checkOutDateTypeDate < currentDate) {
            errorMessages.push('Check out date cant be before today')
        }
        return errorMessages
    }
    validateCheckOutTime(checkOutTime: string): string[] {
        const errorMessages: string[] = []
        const regex = /^(0?[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/i

        if (!regex.test(checkOutTime)) {
            errorMessages.push('Check out time must be in the format HH:MM AM/PM')
            return errorMessages
        }

        const [time, period] = checkOutTime.split(' ')
        const [hour, minute] = time.split(':')
        const hours = parseInt(hour)
        const minutes = parseInt(minute)

        if (hours < 1 || hours > 12) {
            errorMessages.push('Check out time hours must be between 1 and 12');
        }
        if (minutes < 0 || minutes > 59) {
            errorMessages.push('Check out time minutes must be between 00 and 59');
        }

        return errorMessages
    }
    validateRoomId(roomId: number): string[] {
        const errorMessages: string[] = []

        if (typeof roomId !== "number") {
            errorMessages.push('Room id is not a number')
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
    validateSpecialRequest(specialRequest: string): string[] {
        const errorMessages: string[] = []

        if (typeof specialRequest !== "string") {
            errorMessages.push('Special request is not a String')
        }
        if (specialRequest.length < 10) {
            errorMessages.push('Special request length must be 10 characters or more')
        }
        if (specialRequest.length > 500) {
            errorMessages.push('Special request length must be 500 characters or less')
        }

        return errorMessages
    }

}