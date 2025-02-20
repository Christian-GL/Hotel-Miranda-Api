
import {
    validatePhoto, validateFullName, validateEmail,
    validateDate, validateTextArea, validatePhoneNumber
} from './commonValidator'
import { UserInterface } from "../interfaces/userInterface"
import { UserStatus } from "../enums/userStatus"


export class UserValidator {

    validateProperties(user: UserInterface): string[] {
        const errorMessages: string[] = []
        const requiredProperties: string[] = ['photo', 'full_name', 'email', 'start_date', 'description', 'phone_number', 'status', 'password']
        requiredProperties.map((property) => {
            if (!(property in user)) {
                errorMessages.push(`Property [${property}] is required in User`)
            }
        })
        return errorMessages
    }

    validateUser(user: UserInterface): string[] {
        const allErrorMessages: string[] = []

        const errorsCheckingProperties = this.validateProperties(user)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        // validatePhoto(user.photo, 'Photo').map(
        //     error => allErrorMessages.push(error)
        // )
        validateFullName(user.full_name, 'Full name').map(
            error => allErrorMessages.push(error)
        )
        validateEmail(user.email, 'Email').map(
            error => allErrorMessages.push(error)
        )
        validateDate(user.start_date, 'Start date').map(
            error => allErrorMessages.push(error)
        )
        validateTextArea(user.description, 'Description').map(
            error => allErrorMessages.push(error)
        )
        validatePhoneNumber(user.phone_number, 'Phone number').map(
            error => allErrorMessages.push(error)
        )
        this.validateStatusActive(user.status).map(
            error => allErrorMessages.push(error)
        )
        this.validatePassword(user.password).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
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

    validatePassword(password: string): string[] {
        const errorMessages: string[] = []
        const regexUppercase = /[A-Z]/
        const regexNumber = /\d/
        const regexSymbols = /[*\-.,!@#$%^&*()_+={}|\[\]:;"'<>,.?/~`]/

        if (password.length < 8 || password.length > 20) {
            errorMessages.push('Password length must be between 8 and 20 characters')
        }
        if (!regexUppercase.test(password)) {
            errorMessages.push('Password must contain at least one uppercase letter')
        }
        if (!regexNumber.test(password)) {
            errorMessages.push('Password must contain at least one number')
        }
        if (!regexSymbols.test(password)) {
            errorMessages.push('Password must contain at least one symbol (*, -, ., etc)')
        }

        return errorMessages
    }

}