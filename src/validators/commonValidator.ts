
import { BookingInterfaceDTO, BookingInterfaceId, BookingInterfaceIdMongodb } from "../interfaces/mongodb/bookingInterfaceMongodb"
import { RoomInterfaceDTO } from "../interfaces/mongodb/roomInterfaceMongodb"
import { RoomType } from "../enums/roomType"
import { Role } from "../enums/role"
import { RoomAmenities } from "../enums/roomAmenities"
import { OptionYesNo } from "../enums/optionYesNo"


/* TYPE VALIDATORS */
export const validateString = (str: any, fieldName: string = 'String field'): string[] => {
    const errorMessages: string[] = []

    if (typeof str !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }

    return errorMessages
}

export const validateStringList = (list: any[], fieldName: string = 'String list field'): string[] => {
    const errorMessages: string[] = []

    list.forEach((element, index) => {
        if (typeof element !== "string") {
            errorMessages.push(`${fieldName} ${index} is not a String`)
        }
    })

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

export const validateNumber = (str: any, fieldName: string = 'Number field'): string[] => {
    const errorMessages: string[] = []

    if (typeof str !== "number") {
        errorMessages.push(`${fieldName} is not a Number`)
    }

    return errorMessages
}

export const validateBoolean = (bool: any, fieldName: string = 'Boolean field'): string[] => {
    const errorMessages: string[] = []

    if (typeof bool !== "boolean") {
        errorMessages.push(`${fieldName} is not a Boolean`)
    }

    return errorMessages
}

export const validateDate = (date: any, fieldName: string = 'Date field'): string[] => {
    const errorMessages: string[] = []

    if (!(date instanceof Date) || isNaN(date.getTime())) {
        errorMessages.push(`${fieldName} is not a valid date (must be in ISO format: YYYY-MM-DDTHH:mm:ss.sssZ)`)
        return errorMessages
    }

    return errorMessages
}


/* COMMON VALIDATORS */
export const validatePhotos = (photos: any[], fieldName: string = 'Photos'): string[] => {
    const errorMessages: string[] = []
    // const regex = /\.(png|jpe?g)$/i

    photos.forEach((photo, index) => {
        if (typeof photo !== "string") {
            errorMessages.push(`${fieldName} ${index} url is not a String`)
        }
        // if (!regex.test(photo)) {
        //     errorMessages.push(`${fieldName} ${index} is not .png .jpg .jpeg file`)
        // }
    })

    if (photos[0] === undefined) {
        errorMessages.push(`Main ${fieldName} need to be set`)
    }
    if (photos.length < 2) {
        errorMessages.push(`${fieldName} need to be at least 3`)
    }

    return errorMessages
}

export const validatePhoto = (photo: any, fieldName: string = 'Photo'): string[] => {
    const errorMessages: string[] = []
    // const regex = /\.(png|jpe?g)$/i

    if (photo === null || photo === undefined) {
        errorMessages.push(`${fieldName} is required`)
    }
    if (typeof photo !== "string") {
        errorMessages.push(`${fieldName} url is not a String`)
    }
    // if (!regex.test(photo)) {
    //     errorMessages.push(`${fieldName} is not .png .jpg .jpeg file`)
    // }

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

export const validatePhoneNumber = (phoneNumber: any, fieldName: string = 'Phone number'): string[] => {
    const errorMessages: string[] = []
    const regex = /^\+?\d{1,4}([-\s]?\d{2,4})+$/

    if (typeof phoneNumber !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }
    if (phoneNumber.length < 9 || phoneNumber.length > 20) {
        errorMessages.push(`${fieldName} length must be between 9 and 20 characters`)
    }
    if (!regex.test(phoneNumber)) {
        errorMessages.push(`${fieldName} only [digits, -, +, spaces] are available`)
    }

    return errorMessages
}

export const validateNewPassword = (password: any, fieldName: string = 'Password'): string[] => {
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

export const validateRoomNumber = (roomNumber: string, fieldName: string = 'Room number'): string[] => {
    const errorMessages: string[] = []
    const regex = new RegExp(/^\d{3}$/)

    if (typeof roomNumber !== "string") {
        errorMessages.push(`${fieldName} is not a string`)
    }
    const roomNumberString = String(roomNumber)
    if (!regex.test(roomNumberString)) {
        errorMessages.push(`${fieldName} must have 3 numeric digits between 000 and 999`)
    }

    return errorMessages
}

export const validateMongoDBObjectIdList = (list: any, fieldName: string = 'ID list'): string[] => {
    const errorMessages: string[] = []
    const objectIdRegex = /^[a-f\d]{24}$/i

    if (!Array.isArray(list)) {
        errorMessages.push(`${fieldName} must be an array`)
        return errorMessages
    }

    list.forEach((id, index) => {
        if (typeof id !== 'string' || !objectIdRegex.test(id)) {
            errorMessages.push(`${fieldName}[${index}] is not a valid MongoDB ObjectId`)
        }
    })

    return errorMessages
}


/* OPERATION VALIDATORS */
export const validateDateRelativeToAnother = (date1: Date, mustBeBeforeNow: boolean, date2: Date, fieldName: string = 'Date'): string[] => {
    const errorMessages: string[] = []

    validateDate(date1, 'Date 1').map(error => {
        errorMessages.push(error)
    })
    validateDate(date2, 'Date 2').map(error => {
        errorMessages.push(error)
    })
    if (errorMessages.length > 0) { return errorMessages }

    if (mustBeBeforeNow && date1 > date2) {
        errorMessages.push(`${fieldName} can't be after now`)
    }
    if (!mustBeBeforeNow && date1 < date2) {
        errorMessages.push(`${fieldName} can't be before now`)
    }

    return errorMessages
}

export const validateCheckInCheckOut = (checkIn: Date, checkOut: Date): string[] => {
    const errorMessages: string[] = []

    validateDateRelativeToAnother(checkIn, false, new Date(), 'Check in date').map(
        error => errorMessages.push(error)
    )
    validateDateRelativeToAnother(checkOut, false, new Date(), 'Check out date').map(
        error => errorMessages.push(error)
    )
    if (checkIn >= checkOut) {
        errorMessages.push('Check in date must be before Check out date')
    }

    return errorMessages
}

export const validateDateIsOccupied = (booking: BookingInterfaceDTO, bookings: BookingInterfaceDTO[]): string[] => {
    const errorMessages: string[] = []

    for (let i = 0; i < bookings.length; i++) {
        if (new Date(booking.check_in_date) < new Date(bookings[i].check_out_date) &&
            new Date(booking.check_out_date) > new Date(bookings[i].check_in_date)) {
            errorMessages.push(`This period is already occupied`)
        }
    }
    return errorMessages
}

export const validateDateIsOccupiedIfBookingExists = (booking: BookingInterfaceId, bookings: BookingInterfaceIdMongodb[]): string[] => {
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

export const validateRoomPrice = (price: number, fieldName: string = 'Room price'): string[] => {
    const errorMessages: string[] = []

    if (typeof price !== "number") {
        errorMessages.push(`${fieldName} is not a number`)
    }
    if (price < 25) {
        errorMessages.push(`${fieldName} must be 25$ or more`)
    }
    if (price > 10000) {
        errorMessages.push(`${fieldName} must be 10 000$ or less`)
    }

    return errorMessages
}

export const validateRoomDiscount = (discount: number, fieldName: string = 'Room discount'): string[] => {
    const errorMessages: string[] = []

    if (typeof discount !== "number") {
        errorMessages.push(`${fieldName} is not a number`)
    }
    if (discount < 0) {
        errorMessages.push(`${fieldName} must be 0 or more`)
    }
    if (discount > 100) {
        errorMessages.push(`${fieldName} must be 100 or less`)
    }

    return errorMessages
}

export const validateExistingListItemsInAnotherList = (list1: string[], list2: string[] = [], fieldName: string = 'List 2'): string[] => {
    const errorMessages: string[] = []

    if (list1.length === 0) return errorMessages
    const referenceSet = new Set(list2)
    const seen = new Set<string>()

    for (let i = 0; i < list1.length; i++) {
        const item = list1[i]

        if (seen.has(item)) continue
        seen.add(item)

        if (!referenceSet.has(item)) {
            errorMessages.push(`${item} didnt exist in ${fieldName}`)
        }
    }

    return errorMessages
}

export const validateStringExistsInList = (elementToTest: string, elementsInList: string[], fieldName: string = 'Element'): string[] => {
    const errorMessages: string[] = []

    if (typeof elementToTest !== 'string') {
        errorMessages.push(`${fieldName} is not a string`)
        return errorMessages
    }
    if (!Array.isArray(elementsInList)) {
        errorMessages.push(`Internal error: ${fieldName} reference list is not an array`)
        return errorMessages
    }

    const normalize = (s: string) => String(s ?? '').trim()
    const target = normalize(elementToTest)
    const existing = new Set(elementsInList.map(normalize))

    if (existing.has(target)) {
        errorMessages.push(`${fieldName} ${target} already exists`)
    }

    return errorMessages
}


/* ENUM VALIDATORS */
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

export const validateRole = (type: any, fieldName: string = 'Role'): string[] => {
    const errorMessages: string[] = []

    if (typeof type !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }
    if (!Object.values(Role).includes(type as Role)) {
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

export const validateOptionYesNo = (option: any, fieldName: string = 'Option Yes-No'): string[] => {
    const errorMessages: string[] = []

    if (typeof option !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }
    if (!Object.values(OptionYesNo).includes(option as OptionYesNo)) {
        errorMessages.push(`${fieldName} is not set`)
    }

    return errorMessages
}