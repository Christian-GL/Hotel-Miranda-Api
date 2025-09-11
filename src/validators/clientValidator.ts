
import {
    validateString, validateStringList,
    validateFullName, validateEmail, validatePhoneNumber,
    validateOptionYesNo, validateMongoDBObjectIdList,
    validateExistingListItemsInAnotherList
} from "./commonValidator"
import { ClientInterfaceDTO } from "../interfaces/mongodb/clientInterfaceMongodb"


export class ClientValidator {

    private validatePropertyTypes(client: ClientInterfaceDTO): string[] {
        const errorMessages: string[] = []

        validateString(client.full_name, 'full_name').map(
            error => errorMessages.push(error)
        )
        validateString(client.email, 'email').map(
            error => errorMessages.push(error)
        )
        validateString(client.phone_number, 'phone_number').map(
            error => errorMessages.push(error)
        )
        validateString(client.isArchived, 'isArchived').map(
            error => errorMessages.push(error)
        )
        validateStringList(client.booking_id_list, 'booking_id_list').map(
            error => errorMessages.push(error)
        )

        return errorMessages
    }

    private validateClient(client: ClientInterfaceDTO): string[] {
        const allErrorMessages: string[] = []

        const errorsCheckingProperties = this.validatePropertyTypes(client)
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
        validateOptionYesNo(client.isArchived, 'isArchived').map(
            error => allErrorMessages.push(error)
        )
        validateMongoDBObjectIdList(client.booking_id_list, 'Client Booking ID List').map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateNewClient(client: ClientInterfaceDTO): string[] {
        const allErrorMessages: string[] = []

        if (client === undefined || Object.keys(client).length === 0) {
            allErrorMessages.push('Client is undefined or empty')
            return allErrorMessages
        }

        this.validateClient(client).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateExistingClient(client: ClientInterfaceDTO, bookingIdList: string[]): string[] {
        const allErrorMessages: string[] = []

        if (client === undefined || Object.keys(client).length === 0) {
            allErrorMessages.push('Client is undefined or empty')
            return allErrorMessages
        }
        const errorsCheckingProperties = this.validatePropertyTypes(client)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }


        this.validateClient(client).map(
            error => allErrorMessages.push(error)
        )
        validateMongoDBObjectIdList(bookingIdList, 'Storaged Booking ID List').map(
            error => allErrorMessages.push(error)
        )
        // Se valida que las reservas existan:
        validateExistingListItemsInAnotherList(client.booking_id_list, bookingIdList, 'Storaged Booking ID List').map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

}