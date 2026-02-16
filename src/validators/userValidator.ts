
import {
    validateString, validateDate, validatePhoto, validateFullName,
    validateEmail, validatePhoneNumber, validateDateRelativeToAnother,
    validateTextArea, validateRole, validateNewPassword, validateOptionYesNo
} from './validators'
import { UserInterface } from '../interfaces/mongodb/userInterfaceMongodb'


export class UserValidator {

    private validatePropertyTypes(user: UserInterface): string[] {
        const allErrorMessages: string[] = []

        if (user === undefined || Object.keys(user).length === 0) {
            allErrorMessages.push('User is undefined or empty')
            return allErrorMessages
        }

        if (user.photo !== null) {
            validateString(user.photo, 'photo').map(
                error => allErrorMessages.push(error)
            )
        }
        validateString(user.full_name, 'full_name').map(
            error => allErrorMessages.push(error)
        )
        validateString(user.email, 'email').map(
            error => allErrorMessages.push(error)
        )
        validateString(user.phone_number, 'phone_number').map(
            error => allErrorMessages.push(error)
        )
        validateDate(user.start_date, 'start_date').map(
            error => allErrorMessages.push(error)
        )
        validateDate(user.end_date, 'end_date').map(
            error => allErrorMessages.push(error)
        )
        validateString(user.job_position, 'job_position').map(
            error => allErrorMessages.push(error)
        )
        validateString(user.role, 'role').map(
            error => allErrorMessages.push(error)
        )
        validateString(user.password, 'password').map(
            error => allErrorMessages.push(error)
        )
        validateString(user.isArchived, 'isArchived').map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    private validateUser(user: UserInterface): string[] {
        const allErrorMessages: string[] = []

        const errorsCheckingProperties = this.validatePropertyTypes(user)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        validatePhoto(user.photo, 'Photo').map(
            error => allErrorMessages.push(error)
        )
        validateFullName(user.full_name, 'Full name').map(
            error => allErrorMessages.push(error)
        )
        validateEmail(user.email, 'Email').map(
            error => allErrorMessages.push(error)
        )
        validatePhoneNumber(user.phone_number, 'Phone number').map(
            error => allErrorMessages.push(error)
        )
        validateDateRelativeToAnother(user.start_date, true, user.end_date, 'Start date').map(
            error => allErrorMessages.push(error)
        )
        validateTextArea(user.job_position, 'Job position').map(
            error => allErrorMessages.push(error)
        )
        validateRole(user.role, 'Role').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(user.isArchived, 'User isArchived').map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateNewUser(user: UserInterface): string[] {
        const allErrorMessages: string[] = []

        this.validateUser(user).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateExistingUser(user: UserInterface, isSamePassword: boolean): string[] {
        const allErrorMessages: string[] = []

        this.validateUser(user).map(
            error => allErrorMessages.push(error)
        )
        if (!isSamePassword) {
            validateNewPassword(user.password).map(
                error => allErrorMessages.push(error)
            )
        }

        return allErrorMessages
    }

}