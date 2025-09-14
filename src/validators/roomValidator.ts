
import {
    validateString, validateStringList, validateNumber, validatePhotos,
    validateRoomNumber, validateRoomNumberExistsInDB,
    validateRoomType, validateAmenities, validateRoomPrice,
    validateRoomDiscount, validateOptionYesNo, validateMongoDBObjectIdList
} from "./commonValidator"
import { RoomInterfaceDTO } from "../interfaces/mongodb/roomInterfaceMongodb"


export class RoomValidator {

    private validatePropertyTypes(room: RoomInterfaceDTO): string[] {
        const errorMessages: string[] = []

        validateStringList(room.photos, 'photos').map(
            error => errorMessages.push(error)
        )
        validateString(room.number, 'number').map(
            error => errorMessages.push(error)
        )
        validateString(room.type, 'type').map(
            error => errorMessages.push(error)
        )
        validateStringList(room.amenities, 'amenities').map(
            error => errorMessages.push(error)
        )
        validateNumber(room.price, 'price').map(
            error => errorMessages.push(error)
        )
        validateNumber(room.discount, 'discount').map(
            error => errorMessages.push(error)
        )
        validateString(room.isActive, 'isActive').map(
            error => errorMessages.push(error)
        )
        validateString(room.isArchived, 'isArchived').map(
            error => errorMessages.push(error)
        )
        validateStringList(room.booking_id_list, 'booking_id_list').map(
            error => errorMessages.push(error)
        )

        return errorMessages
    }

    private validateRoom(room: RoomInterfaceDTO): string[] {
        const allErrorMessages: string[] = []

        if (room === undefined || Object.keys(room).length === 0) {
            allErrorMessages.push('Room is undefined or empty')
            return allErrorMessages
        }
        const errorsCheckingProperties = this.validatePropertyTypes(room)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        validatePhotos(room.photos, 'Photos').map(
            error => allErrorMessages.push(error)
        )
        validateRoomNumber(room.number, 'Room number').map(
            error => allErrorMessages.push(error)
        )
        validateRoomType(room.type, 'Room type').map(
            error => allErrorMessages.push(error)
        )
        validateAmenities(room.amenities, 'Room amenities').map(
            error => allErrorMessages.push(error)
        )
        validateRoomPrice(room.price, 'Room price').map(
            error => allErrorMessages.push(error)
        )
        validateRoomDiscount(room.discount, 'Room type').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(room.isActive, 'Room isActive').map(
            error => allErrorMessages.push(error)
        )
        validateOptionYesNo(room.isArchived, 'Room isArchived').map(
            error => allErrorMessages.push(error)
        )
        validateMongoDBObjectIdList(room.booking_id_list).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateNewRoom(room: RoomInterfaceDTO, allRoomNumbers: string[]): string[] {
        const allErrorMessages: string[] = []

        if (room === undefined || Object.keys(room).length === 0) {
            allErrorMessages.push('Room is undefined or empty')
            return allErrorMessages
        }

        this.validateRoom(room).map(
            error => allErrorMessages.push(error)
        )
        validateRoomNumberExistsInDB(room.number, allRoomNumbers, 'Room number').map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateExistingRoom(room: RoomInterfaceDTO, oldRoomNumber: string, allRoomNumbers: string[]): string[] {
        const allErrorMessages: string[] = []

        if (room === undefined || Object.keys(room).length === 0) {
            allErrorMessages.push('Room is undefined or empty')
            return allErrorMessages
        }

        this.validateRoom(room).map(
            error => allErrorMessages.push(error)
        )
        // Si el número de habitación es diferente, se debe comprobar que el nuevo valor no exista
        if (room.number !== oldRoomNumber) {
            validateRoomNumberExistsInDB(room.number, allRoomNumbers, 'Room number').map(
                error => allErrorMessages.push(error)
            )
        }

        return allErrorMessages
    }

}