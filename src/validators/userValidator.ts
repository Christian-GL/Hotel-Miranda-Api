
import { UserInterface } from "../interfaces/userInterface"
import { UserStatus } from "../enums/userStatus"
import { dateFormatToYYYYMMDD } from "../utils/dateUtils"


export class UserValidator {

    validateProperties(user: UserInterface): string[] {
        const errorMessages: string[] = []
        const requiredProperties: string[] = ['photo', 'full_name', 'email', 'start_date', 'description', 'phone_number', 'status']
        requiredProperties.map((property) => {
            if (!(property in user)) {
                errorMessages.push(`Property [${property}] is required in User`)
            }
        })
        return errorMessages
    }

    validateUser(user: UserInterface): string[] {
        const allErrorMessages: string[] = []

        const checkProperties = this.validateProperties(user)
        if (checkProperties.length > 0) {
            return checkProperties
        }

        // this.validatePhoto(user.photo).map(
        //     error => allErrorMessages.push(error)
        // )
        this.validateFullName(user.full_name).map(
            error => allErrorMessages.push(error)
        )
        this.validateEmail(user.email).map(
            error => allErrorMessages.push(error)
        )
        this.validateStartDate(user.start_date).map(
            error => allErrorMessages.push(error)
        )
        this.validateDescription(user.description).map(
            error => allErrorMessages.push(error)
        )
        this.validatePhoneNumber(user.phone_number).map(
            error => allErrorMessages.push(error)
        )
        this.validateStatusActive(user.status).map(
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
    validateFullName(fullName: string): string[] {
        const errorMessages: string[] = []
        const regex = new RegExp(/^[^\d]*$/)

        if (typeof fullName !== "string") {
            errorMessages.push('Name is not a String')
        }
        if (fullName.length < 3) {
            errorMessages.push('Name length must be 3 characters or more')
        }
        if (fullName.length > 50) {
            errorMessages.push('Name length must be 50 characters or less')
        }
        if (!regex.test(fullName)) {
            errorMessages.push('Name must not contain numbers')
        }

        return errorMessages
    }
    validateEmail(email: string): string[] {
        const errorMessages: string[] = []
        const regex = new RegExp(/^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

        if (typeof email !== "string") {
            errorMessages.push('Email is not a String')
        }
        if (!regex.test(email)) {
            errorMessages.push('Email format no valid')
        }

        return errorMessages
    }
    validateStartDate(startDate: string): string[] {
        const errorMessages: string[] = []
        const regex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/

        if (!regex.test(startDate)) {
            errorMessages.push('Start date must be in the format DD/MM/YYYY')
            return errorMessages
        }

        const startDateFormatted = dateFormatToYYYYMMDD(startDate)
        const startDateTypeDate = new Date(startDateFormatted)
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)
        startDateTypeDate.setHours(0, 0, 0, 0)

        if (isNaN(startDateTypeDate.getTime())) {
            errorMessages.push('Start date is not a valid date')
        }
        if (startDateTypeDate < currentDate) {
            errorMessages.push('Start date cant be before today')
        }
        return errorMessages
    }
    validateDescription(description: string): string[] {
        const errorMessages: string[] = []

        if (typeof description !== "string") {
            errorMessages.push('Text is not a String')
        }
        if (description.length < 10) {
            errorMessages.push('Text length must be 10 characters or more')
        }
        if (description.length > 500) {
            errorMessages.push('Text length must be 500 characters or less')
        }

        return errorMessages
    }
    validatePhoneNumber(phoneNumber: string): string[] {
        const errorMessages: string[] = []
        const regex = /^(\d{3}[-\s]?\d{3}[-\s]?\d{3,4})$/

        if (typeof phoneNumber !== "string") {
            errorMessages.push('Phone number is not a String')
        }
        if (phoneNumber.length < 9) {
            errorMessages.push('Phone number length must be 9 characters or more')
        }
        if (phoneNumber.length > 20) {
            errorMessages.push('Phone number length must be 20 characters or less')
        }
        if (!regex.test(phoneNumber)) {
            errorMessages.push('Phone number only digits are available')
        }

        return errorMessages
    }
    validateStatusActive(status: string): string[] {
        const errorMessages: string[] = []

        if (typeof status !== "string") {
            errorMessages.push('User status is not a String')
        }
        if (!Object.values(UserStatus).includes(status as UserStatus)) {
            errorMessages.push('User status is not a valid value')
        }

        return errorMessages
    }

}