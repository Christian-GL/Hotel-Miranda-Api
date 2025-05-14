
import {
    validateDateRelativeToNow, validateFullName, validateEmail,
    validatePhoneNumber, validateTextArea
} from "./commonValidator"
import { ContactInterfaceMongodb } from "../interfaces/mongodb/contactInterfaceMongodb"
import { ContactInterfaceMysql } from "../interfaces/mysql/contactInterfaceMysql"
import { ContactArchived } from "../enums/contactArchived"


export class ContactValidator {

    validateProperties(contact: ContactInterfaceMongodb | ContactInterfaceMysql): string[] {
        const errorMessages: string[] = []
        const requiredProperties: string[] = ['publish_date', 'full_name', 'email', 'phone_number', 'comment', 'archived']
        requiredProperties.map((property) => {
            if (!(property in contact)) {
                errorMessages.push(`Property [${property}] is required in Contact`)
            }
        })
        return errorMessages
    }
    

    validateContact(contact: ContactInterfaceMongodb | ContactInterfaceMysql): string[] {
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

    validateArchived(archived: ContactArchived): string[] {
        const errorMessages: string[] = []

        if (typeof archived !== "string") {
            errorMessages.push('Archived is not a String')
        }
        if (!Object.values(ContactArchived).includes(archived as ContactArchived)) {
            errorMessages.push('Archived is not a valid value')
        }

        return errorMessages
    }

}