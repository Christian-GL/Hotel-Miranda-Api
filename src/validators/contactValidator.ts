
import {
    validateDate, validateFullName, validateEmail,
    validatePhoneNumber, validateTextArea
} from "./commonValidator"
import { ContactInterface } from "../interfaces/contactInterface"


export class ContactValidator {

    validateProperties(contact: ContactInterface): string[] {
        const errorMessages: string[] = []
        const requiredProperties: string[] = ['publish_date', 'full_name', 'email', 'phone_number', 'comment']
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

        validateDate(contact.publish_date, 'Publish date').map(
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

        return allErrorMessages
    }

}