
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

export const validateFullName = (fullName: string, fieldName: string = 'Full name'): string[] => {
    const errorMessages: string[] = []
    const regex = new RegExp(/^[^\d]*$/)

    if (typeof fullName !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }
    if (fullName.length < 3) {
        errorMessages.push(`${fieldName} length must be 3 characters or more`)
    }
    if (fullName.length > 50) {
        errorMessages.push(`${fieldName} length must be 50 characters or less`)
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

export const validateDate = (startDate: Date, fieldName: string = 'Date'): string[] => {
    const errorMessages: string[] = []

    const parsedDate = new Date(startDate)
    if (isNaN(parsedDate.getTime())) {
        errorMessages.push(`${fieldName} is not a valid date (must be in ISO format: YYYY-MM-DDTHH:mm:ss.sssZ)`)
        return errorMessages
    }

    const currentDate = new Date()
    if (parsedDate < currentDate) {
        errorMessages.push(`${fieldName} cant be before now`)
    }

    return errorMessages
}

export const validateTextArea = (description: string, fieldName: string = 'Text area'): string[] => {
    const errorMessages: string[] = []

    if (typeof description !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }
    if (description.length < 10) {
        errorMessages.push(`${fieldName} length must be 10 characters or more`)
    }
    if (description.length > 500) {
        errorMessages.push(`${fieldName} length must be 500 characters or less`)
    }

    return errorMessages
}

export const validatePhoneNumber = (phoneNumber: string, fieldName: string = 'Phone number'): string[] => {
    const errorMessages: string[] = []
    const regex = /^(\d{3}[-\s]?\d{3}[-\s]?\d{3,4})$/

    if (typeof phoneNumber !== "string") {
        errorMessages.push(`${fieldName} is not a String`)
    }
    if (phoneNumber.length < 9) {
        errorMessages.push(`${fieldName} length must be 9 characters or more`)
    }
    if (phoneNumber.length > 20) {
        errorMessages.push(`${fieldName} length must be 20 characters or less`)
    }
    if (!regex.test(phoneNumber)) {
        errorMessages.push(`${fieldName} only digits are available`)
    }

    return errorMessages
}