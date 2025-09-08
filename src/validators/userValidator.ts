
import {
    validateString, validateDate, validatePhoto, validateFullName,
    validateEmail, validatePhoneNumber, validateDateRelativeToAnother,
    validateTextArea, validateRole, validateNewPassword, validateOptionYesNo
} from './commonValidator'
import { UserInterfaceDTO } from '../interfaces/mongodb/userInterfaceMongodb'


export class UserValidator {

    validatePropertyTypes(user: UserInterfaceDTO): string[] {
        const errorMessages: string[] = []

        if (user.photo !== null) {
            validateString(user.photo, 'photo').map(
                error => errorMessages.push(error)
            )
        }
        validateString(user.full_name, 'full_name').map(
            error => errorMessages.push(error)
        )
        validateString(user.email, 'email').map(
            error => errorMessages.push(error)
        )
        validateString(user.phone_number, 'phone_number').map(
            error => errorMessages.push(error)
        )
        validateDate(user.start_date, 'start_date').map(
            error => errorMessages.push(error)
        )
        validateDate(user.end_date, 'end_date').map(
            error => errorMessages.push(error)
        )
        validateString(user.job_position, 'job_position').map(
            error => errorMessages.push(error)
        )
        validateString(user.role, 'role').map(
            error => errorMessages.push(error)
        )
        validateString(user.password, 'password').map(
            error => errorMessages.push(error)
        )
        validateString(user.isArchived, 'isArchived').map(
            error => errorMessages.push(error)
        )

        return errorMessages
    }

    validateUser(user: UserInterfaceDTO, passwordHasChanged: boolean = false): string[] {
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
        if (passwordHasChanged) {
            validateNewPassword(user.password).map(
                error => allErrorMessages.push(error)
            )
        }
        validateOptionYesNo(user.isArchived, 'Room isArchived').map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

}