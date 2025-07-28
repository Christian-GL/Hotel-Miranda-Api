
import {
    validateDateRelativeToNow, validateFullName, validateEmail,
    validatePhoneNumber, validateTextArea
} from "./commonValidator"
import { ClientInterfaceMongodb } from "../interfaces/mongodb/clientInterfaceMongodb"
import { ContactInterfaceMysql } from "../interfaces/mysql/contactInterfaceMysql"
// import { ClientArchived } from "../enums/clientArchived"


export class ClientValidator {

    validateProperties(client: ClientInterfaceMongodb | ContactInterfaceMysql): string[] {
        const errorMessages: string[] = []
        const requiredProperties: string[] = ['publish_date', 'full_name', 'email', 'phone_number', 'comment', 'archived']
        requiredProperties.map((property) => {
            if (!(property in client)) {
                errorMessages.push(`Property [${property}] is required in Client`)
            }
        })
        return errorMessages
    }
    

    validateClient(client: ClientInterfaceMongodb | ContactInterfaceMysql): string[] {
        const allErrorMessages: string[] = []

        // const errorsCheckingProperties = this.validateProperties(client)
        // if (errorsCheckingProperties.length > 0) {
        //     return errorsCheckingProperties
        // }

        // validateDateRelativeToNow(new Date(client.publish_date), true, 'Publish date').map(
        //     error => allErrorMessages.push(error)
        // )
        // validateFullName(client.full_name, 'Full name').map(
        //     error => allErrorMessages.push(error)
        // )
        // validateEmail(client.email, 'Email').map(
        //     error => allErrorMessages.push(error)
        // )
        // validatePhoneNumber(client.phone_number, 'Phone Number').map(
        //     error => allErrorMessages.push(error)
        // )
        // validateTextArea(client.comment, 'Comment').map(
        //     error => allErrorMessages.push(error)
        // )
        // this.validateArchived(client.archived).map(
        //     error => allErrorMessages.push(error)
        // )

        return allErrorMessages
    }

    validateArchived(archived: any): string[] {
        const errorMessages: string[] = []

        if (typeof archived !== "string") {
            errorMessages.push('Archived is not a String')
        }
        // if (!Object.values(ClientArchived).includes(archived as ClientArchived)) {
        //     errorMessages.push('Archived is not a valid value')
        // }

        return errorMessages
    }

}