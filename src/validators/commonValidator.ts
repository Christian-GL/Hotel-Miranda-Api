
import { Types } from "mongoose"


export const validatePhoto = (photo: string, fieldName: string = 'Photo'): string[] => {
    const errorMessages: string[] = []
    const regex = /\.(png|jpg)$/i

    if (typeof photo !== "string") {
        errorMessages.push(`${fieldName} url is not a String`)
    }
    if (!regex.test(photo)) {
        errorMessages.push(`${fieldName} is not .png or .jpg file`)
    }

    return errorMessages
}

export const validateIDObjectId = (id: any, fieldName: string = '_ID'): string[] => {
    const errorMessages: string[] = []

    if (!Types.ObjectId.isValid(id)) {
        errorMessages.push(`${fieldName} is not a valid ObjectId`)
    }

    return errorMessages
}

export const validateIDstring = (id: string, fieldName: string = 'ID'): string[] => {
    const errorMessages: string[] = []

    if (typeof id !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }

    return errorMessages
}

export const validateFullName = (fullName: string, fieldName: string = 'Full name'): string[] => {
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

export const validateEmail = (email: string, fieldName: string = 'Email'): string[] => {
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

export const validateDate = (date: Date, fieldName: string = 'Date'): string[] => {
    const errorMessages: string[] = []

    if (isNaN(date.getTime())) {
        errorMessages.push(`${fieldName} is not a valid date (must be in ISO format: YYYY-MM-DDTHH:mm:ss.sssZ)`)
        return errorMessages
    }

    return errorMessages
}

export const validateDateRelativeToNow = (date: Date, mustBeBeforeNow: boolean, fieldName: string = 'Date'): string[] => {
    const errorMessages: string[] = []
    const currentTime = new Date()

    validateDate(date, 'Date').map(
        error => errorMessages.push(error)
    )
    if (mustBeBeforeNow && date > currentTime) {
        errorMessages.push(`${fieldName} can't be after now`)
    }
    if (!mustBeBeforeNow && date < currentTime) {
        errorMessages.push(`${fieldName} can't be before now`)
    }

    return errorMessages
}

export const validateTextArea = (textArea: string, fieldName: string = 'Text area'): string[] => {
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