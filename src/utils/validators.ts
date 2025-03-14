
import { RoomAmenities } from "../enums/roomAmenities.js"
import { RoomType } from "../enums/roomType.js"
import { RoomInterfaceMysqlWithBookingData } from "../interfaces/mysql/roomInterfaceMysql.js"
import { BookingInterfaceMysql, BookingInterfaceMysqlWithRoomData } from "../interfaces/mysql/bookingInterfaceMysql.js"


export const validatePhotos = (photos: any[], fieldName: string = 'Photo'): string[] => {
    const errorMessages: string[] = []
    const regex = /\.(png|jpe?g)$/i

    photos.forEach((photo, index) => {
        if (typeof photo !== "string") {
            errorMessages.push(`${fieldName} ${index} url is not a String`)
        }
        if (!regex.test(photo)) {
            errorMessages.push(`${fieldName} ${index} is not .png .jpg .jpeg file`)
        }
    })

    if (photos[0] === undefined) {
        errorMessages.push(`Main ${fieldName} need to be set`)
    }
    if (photos.length < 3) {
        errorMessages.push(`${fieldName}s need to be at least 3`)
    }

    return errorMessages
}

export const validatePhoto = (photo: any, fieldName: string = 'Photo'): string[] => {
    const errorMessages: string[] = []
    const regex = /\.(png|jpe?g)$/i

    if (photo === null || photo === undefined) {
        errorMessages.push(`${fieldName} is required`)
    }
    if (typeof photo !== "string") {
        errorMessages.push(`${fieldName} url is not a String`)
    }
    if (!regex.test(photo)) {
        errorMessages.push(`${fieldName} is not .png .jpg .jpeg file`)
    }

    return errorMessages
}

export const validateFullName = (fullName: any, fieldName: string = 'Full name'): string[] => {
    const errorMessages: string[] = []
    const regex = new RegExp(/^[^\d]*$/)

    if (typeof fullName !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }
    if (fullName.length < 3 || fullName.length > 50) {
        errorMessages.push(`${fieldName} length must be between 3 and 50 characters`)
    }
    if (!regex.test(fullName)) {
        errorMessages.push(`${fieldName} must not contain numbers`)
    }

    return errorMessages
}

export const validateEmail = (email: any, fieldName: string = 'Email'): string[] => {
    const errorMessages: string[] = []
    const regex = new RegExp(/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

    if (typeof email !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }
    if (!regex.test(email)) {
        errorMessages.push(`${fieldName} format no valid`)
    }

    return errorMessages
}

export const validateDate = (date: any, fieldName: string = 'Date'): string[] => {
    const errorMessages: string[] = []

    if (!(date instanceof Date) || isNaN(date.getTime())) {
        errorMessages.push(`${fieldName} is not a valid date (must be in ISO format: YYYY-MM-DDTHH:mm:ss.sssZ)`)
        return errorMessages
    }

    return errorMessages
}

export const validateDateRelativeToNow = (date: any, mustBeBeforeNow: boolean, fieldName: string = 'Date'): string[] => {
    const errorMessages: string[] = []
    const currentTime = new Date()

    validateDate(date, 'Date').map(error => {
        errorMessages.push(error)
        return errorMessages
    })
    if (mustBeBeforeNow && date > currentTime) {
        errorMessages.push(`${fieldName} can't be after now`)
    }
    if (!mustBeBeforeNow && date < currentTime) {
        errorMessages.push(`${fieldName} can't be before now`)
    }

    return errorMessages
}

export const validateCheckInCheckOut = (checkIn: Date, checkOut: Date): string[] => {
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

// FUSIONAR LAS DOS VALIDATEISOCCUPIED ?? (tema de IDS como?)
export const validateDateIsOccupied = (booking: BookingInterfaceMysql, bookings: BookingInterfaceMysqlWithRoomData[]): string[] => {
    const errorMessages: string[] = []

    for (let i = 0; i < bookings.length; i++) {
        if (new Date(booking.check_in_date) < new Date(bookings[i].check_out_date) &&
            new Date(booking.check_out_date) > new Date(bookings[i].check_in_date)) {
            errorMessages.push(`This period is already occupied by booking #${bookings[i]._id}`)
        }
    }
    return errorMessages
}

export const validateDateIsOccupiedIfBookingExists = (booking: BookingInterfaceMysql, bookings: BookingInterfaceMysqlWithRoomData[]): string[] => {
    const errorMessages: string[] = []

    for (let i = 0; i < bookings.length; i++) {
        if (new Date(booking.check_in_date) < new Date(bookings[i].check_out_date) &&
            new Date(booking.check_out_date) > new Date(bookings[i].check_in_date)) {
            if (booking._id.toString() !== bookings[i]._id.toString()) {
                errorMessages.push(`This period is already occupied by booking #${bookings[i]._id}`)
            }
        }
    }
    return errorMessages
}

export const validateTextArea = (textArea: any, fieldName: string = 'Text area'): string[] => {
    const errorMessages: string[] = []

    if (typeof textArea !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }
    if (textArea.length < 10 || textArea.length > 500) {
        errorMessages.push(`${fieldName} length must be between 10 and 500 characters`)
    }

    return errorMessages
}

export const validatePhoneNumber = (phoneNumber: any, fieldName: string = 'Phone number'): string[] => {
    const errorMessages: string[] = []
    const regex = /^\+?\d{1,4}[-\s]?\d{3}[-\s]?\d{3,4}$/

    if (typeof phoneNumber !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }
    if (phoneNumber.length < 9 || phoneNumber.length > 20) {
        errorMessages.push(`${fieldName} length must be bertween 9 and 20 characters`)
    }
    if (!regex.test(phoneNumber)) {
        errorMessages.push(`${fieldName} only [digits, -, +, spaces] are available`)
    }

    return errorMessages
}

export const validateBoolean = (bool: any, fieldName: string = 'Bool field'): string[] => {
    const errorMessages: string[] = []

    if (typeof bool !== "boolean") {
        errorMessages.push(`${fieldName} is not a Boolean`)
    }

    return errorMessages
}

export const validateCreatePassword = (password: any, fieldName: string = 'Password'): string[] => {
    const errorMessages: string[] = []
    const regexUppercase = /[A-Z]/
    const regexNumber = /\d/
    const regexSymbols = /[*\-.,!@#$%^&*()_+={}|\[\]:;"'<>,.?/~`]/

    if (typeof password !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }
    if (password.length < 8 || password.length > 20) {
        errorMessages.push(`${fieldName} length must be between 8 and 20 characters`)
    }
    if (!regexUppercase.test(password)) {
        errorMessages.push(`${fieldName} must contain at least one uppercase letter`)
    }
    if (!regexNumber.test(password)) {
        errorMessages.push(`${fieldName} must contain at least one number`)
    }
    if (!regexSymbols.test(password)) {
        errorMessages.push(`${fieldName} must contain at least one symbol (*, -, ., etc)`)
    }

    return errorMessages
}

export const validateNumberBetween = (price: any, minor: number, mayor: number, fieldName: string = 'Number'): string[] => {
    const errorMessages: string[] = []

    if (price === null || typeof price !== "number" || isNaN(price)) {
        errorMessages.push(`${fieldName} is not a number`)
        return errorMessages
    }
    if (price < minor) {
        errorMessages.push(`${fieldName} must be ${minor} or more`)
    }
    if (price > mayor) {
        errorMessages.push(`${fieldName} must be ${mayor} or less`)
    }

    return errorMessages
}

export const validateRoomType = (type: any, fieldName: string = 'Room type'): string[] => {
    const errorMessages: string[] = []

    if (typeof type !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }
    if (!Object.values(RoomType).includes(type as RoomType)) {
        errorMessages.push(`${fieldName} is not set`)
    }

    return errorMessages
}

export const validateAmenities = (amenities: any[], fieldName: string = 'Amenities'): string[] => {
    const errorMessages: string[] = []

    if (!Array.isArray(amenities)) {
        errorMessages.push(`${fieldName} is not an array of strings`)
        return errorMessages
    }
    amenities.map(amenity => {
        if (!Object.values(RoomAmenities).includes(amenity as RoomAmenities)) {
            errorMessages.push(`${fieldName}: ${amenity} is not a valid value`)
        }
    })

    return errorMessages
}

const validateRoomNumber = (number: any, allRooms: RoomInterfaceMysqlWithBookingData[], actualNumber?: string, fieldName: string = 'Room number'): string[] => {
    const errorMessages: string[] = []
    const regex = new RegExp(/^\d{3}$/)

    if (!Array.isArray(allRooms)) {
        errorMessages.push(`${fieldName}: invalid room list`)
        return errorMessages
    }
    if (typeof number !== "string") {
        errorMessages.push(`${fieldName} is not a string`)
    }
    const numStr = String(number)
    if (!regex.test(numStr)) {
        errorMessages.push(`${fieldName} must have 3 numeric digits between 000 and 999`)
    }
    if (allRooms.some(room => room.number === numStr && room.number !== actualNumber)) {
        errorMessages.push('Number is already taken')
    }

    return errorMessages
}

export const validateNewRoomNumber = (number: string, allRooms: RoomInterfaceMysqlWithBookingData[], fieldName: string = 'Room number'): string[] => {
    return validateRoomNumber(number, allRooms, undefined, fieldName)
}
export const validateExistingRoomNumber = (number: string, actualNumber: string, allRooms: RoomInterfaceMysqlWithBookingData[], fieldName: string = 'Room number'): string[] => {
    return validateRoomNumber(number, allRooms, actualNumber, fieldName)
}