
import {
    validatePhoto, validateFullName, validateEmail,
    validatePhoneNumber, validateDateRelativeToAnother,
    validateTextArea, validateRole, validateNewPassword
} from './commonValidator'
import { UserInterfaceMongodb } from '../interfaces/mongodb/userInterfaceMongodb'
import { UserInterfaceMysql } from '../interfaces/mysql/userInterfaceMysql'


export class UserValidator {

    validateProperties(user: UserInterfaceMongodb): string[] {
        const errorMessages: string[] = []
        const requiredProperties: string[] = [
            'photo',
            'full_name',
            'email',
            'start_date',
            'end_date',
            'job_position',
            'phone_number',
            'role',
            'password'
        ]

        requiredProperties.map((property) => {
            if (!(property in user)) {
                errorMessages.push(`Property [${property}] is required in User`)
            }
        })

        return errorMessages
    }

    validateUser(user: UserInterfaceMongodb, passwordHasChanged: boolean = false): string[] {
        const allErrorMessages: string[] = []

        const errorsCheckingProperties = this.validateProperties(user)
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

        return allErrorMessages
    }

}