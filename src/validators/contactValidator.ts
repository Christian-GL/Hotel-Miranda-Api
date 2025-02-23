
import {
    validateDateRelativeToNow, validateFullName, validateEmail,
    validatePhoneNumber, validateTextArea
} from "./commonValidator"
import { ContactInterface } from "../interfaces/contactInterface"


export class ContactValidator {

    validateProperties(contact: ContactInterface): string[] {
        const errorMessages: string[] = []
        const requiredProperties: string[] = ['publish_date', 'full_name', 'email', 'phone_number', 'comment', 'archived']
        requiredProperties.map((property) => {
            if (!(property in contact)) {
                errorMessages.push(`Property [${property}] is required in Contact`)
            }
        })
        return errorMessages
    }

    validateContact(contact: ContactInterface): string[] {
        const allErrorMessages: string[] = []

        const errorsCheckingProperties = this.validateProperties(contact)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        validateDateRelativeToNow(new Date(contact.publish_date), true, 'Publish date').map(
            error => allErrorMessages.push(error)
        )
        validateFullName(contact.full_name, 'Full name').map(
            error => allErrorMessages.push(error)
        )
        validateEmail(contact.email, 'Email').map(
            error => allErrorMessages.push(error)
        )
        validatePhoneNumber(contact.phone_number, 'Phone Number').map(
            error => allErrorMessages.push(error)
        )
        validateTextArea(contact.comment, 'Comment').map(
            error => allErrorMessages.push(error)
        )
        this.validateArchived(contact.archived).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateArchived(archived: boolean): string[] {
        const errorMessages: string[] = []

        if (typeof archived !== "boolean") {
            errorMessages.push('Archived is not a Boolean')
        }

        return errorMessages
    }

}