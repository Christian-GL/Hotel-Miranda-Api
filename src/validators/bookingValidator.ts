
import { BookingInterface } from "../interfaces/bookingInterface"
import { dateFormatToYYYYMMDD } from "../utils/utils"
import { hourFormatTo24H } from "../utils/utils"


export class BookingValidator {

    validateProperties(booking: BookingInterface): string[] {
        const errorMessages: string[] = []
        const requiredProperties: string[] = ['photo', 'full_name_guest', 'order_date', 'order_time', 'check_in_date', 'check_in_time',
            'check_out_date', 'check_out_time', 'room_id', 'room_type', 'room_booking_status', 'special_request']
        requiredProperties.map((property) => {
            if (!(property in booking)) {
                errorMessages.push(`Property [${property}] is required in Booking`)
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
        this.validateRoomId(booking.room_id).map(
            error => allErrorMessages.push(error)
        )
        this.validateRoomType(booking.room_type).map(
            error => allErrorMessages.push(error)
        )
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

        const orderTimeFormatted = hourFormatTo24H(orderTime)
        const orderTimeParts = orderTimeFormatted.split(':')
        const hours = parseInt(orderTimeParts[0])
        const minutes = parseInt(orderTimeParts[1])

        if (isNaN(hours) || isNaN(minutes)) {
            errorMessages.push('Order time is not a valid time')
        }
        if (hours < 0 || hours > 23) {
            errorMessages.push('Order time hours is not a valid number (<0 or >23)')
        }
        if (minutes < 0 || minutes > 59) {
            errorMessages.push('Order time minutes is not a valid number (<0 or >59)')
        }

        return errorMessages
    }
    validateCheckInDate(checkInDate: string): string[] {
        const errorMessages: string[] = []

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

        const checkInTimeFormatted = hourFormatTo24H(checkInTime)
        const checkInTimeParts = checkInTimeFormatted.split(':')
        const hours = parseInt(checkInTimeParts[0])
        const minutes = parseInt(checkInTimeParts[1])

        if (isNaN(hours) || isNaN(minutes)) {
            errorMessages.push('Check in time is not a valid time')
        }
        if (hours < 0 || hours > 23) {
            errorMessages.push('Check in time hours is not a valid number (<0 or >23)')
        }
        if (minutes < 0 || minutes > 59) {
            errorMessages.push('Check in time minutes is not a valid number (<0 or >59)')
        }

        return errorMessages
    }
    validateCheckOutDate(checkOutDate: string): string[] {
        const errorMessages: string[] = []

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

        const checkOutTimeFormatted = hourFormatTo24H(checkOutTime)
        const checkOutTimeParts = checkOutTimeFormatted.split(':')
        const hours = parseInt(checkOutTimeParts[0])
        const minutes = parseInt(checkOutTimeParts[1])

        if (isNaN(hours) || isNaN(minutes)) {
            errorMessages.push('Check out time is not a valid time')
        }
        if (hours < 0 || hours > 23) {
            errorMessages.push('Check out time hours is not a valid number (<0 or >23)')
        }
        if (minutes < 0 || minutes > 59) {
            errorMessages.push('Check out time minutes is not a valid number (<0 or >59)')
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
        enum RoomType {
            suite = "Suite",
            singleBed = "Single Bed",
            doubleBed = "Double Bed",
            doubleSuperior = "Double Superior"
        }

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
        enum RoomType {
            checkIn = "Check In",
            inProgress = "In Progress",
            checkOut = "Check Out"
        }

        if (typeof type !== "string") {
            errorMessages.push('Booking status is not a String')
        }
        if (!Object.values(RoomType).includes(type as RoomType)) {
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