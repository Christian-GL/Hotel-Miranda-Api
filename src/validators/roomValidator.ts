
import {
    validateString, validateStringList, validateNumber,
    validatePhotos, validateNewRoomNumber, validateExistingRoomNumber,
    validateRoomType, validateAmenities, validateRoomPrice,
    validateRoomDiscount, validateOptionYesNo, validateMongoDBObjectIdList
} from "./commonValidator"
import { RoomInterfaceDTO } from "../interfaces/mongodb/roomInterfaceMongodb"


export class RoomValidator {

    validatePropertyTypes(room: RoomInterfaceDTO): string[] {
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
        validateStringList(room.booking_id_list, 'booking_id_list').map(
            error => errorMessages.push(error)
        )

        return errorMessages
    }

    private validateRoom(room: RoomInterfaceDTO, allRooms: RoomInterfaceDTO[]): string[] {
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
        validateMongoDBObjectIdList(room.booking_id_list).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateNewRoom(room: RoomInterfaceDTO, allRooms: RoomInterfaceDTO[]): string[] {
        const allErrorMessages: string[] = []

        if (room === undefined || Object.keys(room).length === 0) {
            allErrorMessages.push('Room is undefined or empty')
            return allErrorMessages
        }

        this.validateRoom(room, allRooms).map(
            error => allErrorMessages.push(error)
        )
        validateNewRoomNumber(room.number, allRooms, 'Room number').map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

    validateExistingRoom(room: RoomInterfaceDTO, allRooms: RoomInterfaceDTO[]): string[] {
        const allErrorMessages: string[] = []

        if (room === undefined || Object.keys(room).length === 0) {
            allErrorMessages.push('Room is undefined or empty')
            return allErrorMessages
        }

        this.validateRoom(room, allRooms).map(
            error => allErrorMessages.push(error)
        )
        validateExistingRoomNumber(room.number, allRooms, 'Room number').map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
    }

}