
import {
    validateFullName, validateEmail, validatePhoneNumber,
    validateOptionYesNo, validateMongoDBObjectIdList
} from "./commonValidator"
import { ClientInterfaceIdMongodb } from "../interfaces/mongodb/clientInterfaceMongodb"


export class ClientValidator {

    validateProperties(client: ClientInterfaceIdMongodb): string[] {
        const errorMessages: string[] = []
        const requiredProperties: string[] = [
            'full_name',
            'email',
            'phone_number',
            'isArchived',
            'booking_id_list'
        ]

        requiredProperties.map((property) => {
            if (!(property in client)) {
                errorMessages.push(`Property [${property}] is required in Client`)
            }
        })
        return errorMessages
    }

    validateClient(client: ClientInterfaceIdMongodb): string[] {
        const allErrorMessages: string[] = []

        const errorsCheckingProperties = this.validateProperties(client)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        validateFullName(client.full_name, 'Full name').map(
            error => allErrorMessages.push(error)
        )
        validateEmail(client.email, 'Email').map(
            error => allErrorMessages.push(error)
        )
        validatePhoneNumber(client.phone_number, 'Phone Number').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(client.isArchived).map(
            error => allErrorMessages.push(error)
        )
        validateMongoDBObjectIdList(client.booking_id_list).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

}