
import { validateIDstring as validateIdString, validateIDObjectId, validateFullName, validateDateRelativeToNow, validateTextArea } from "./commonValidator"
import { RoomInterface } from "../interfaces/roomInterface"
import { RoomType } from "../enums/roomType"
import { RoomAmenities } from "../enums/roomAmenities"
import { BookingInterface } from "../interfaces/bookingInterface"


export class RoomValidator {

    validateNewRoomProperties(room: RoomInterface): string[] {
        const errorMessages: string[] = []
        let requiredProperties = ['photos', 'number', 'type', 'amenities', 'price', 'discount', 'booking_list']

        requiredProperties.forEach((property) => {
            if (!(property in room)) {
                errorMessages.push(`Property [${property}] is required in Room`)
            }
        })
        return errorMessages
    }
    validateExistingRoomProperties(room: RoomInterface): string[] {
        const errorMessages: string[] = []
        let requiredProperties = ['photos', 'number', 'type', 'amenities', 'price', 'discount', 'booking_list']

        requiredProperties.forEach((property) => {
            if (!(property in room)) {
                errorMessages.push(`Property [${property}] is required in Room`)
            }
        })
        return errorMessages
    }

    validateNewRoom(room: RoomInterface, allRooms: RoomInterface[]): string[] {
        const errorMessages: string[] = []

        if (room === undefined || Object.keys(room).length === 0) {
            errorMessages.push('Room is undefined or empty')
            return errorMessages
        }

        // this.validatePhotos(room.photos).errorMessages.map(error => allErrorMessages.push(error))
        this.validateNewNumber(room.number, allRooms).map(error => errorMessages.push(error))
        this.validateRoomType(room.type).map(error => errorMessages.push(error))
        this.validateAmenities(room.amenities).map(error => errorMessages.push(error))
        this.validateRoomPrice(room.price).map(error => errorMessages.push(error))
        this.validateRoomDiscount(room.discount).map(error => errorMessages.push(error))

        return errorMessages
    }
    validateExistingRoom(room: RoomInterface, allRooms: RoomInterface[], allBookings: BookingInterface[]): string[] {
        const errorMessages: string[] = []

        if (room === undefined || Object.keys(room).length === 0) {
            errorMessages.push('Room is undefined or empty')
            return errorMessages
        }

        // this.validatePhotos(room.photos).errorMessages.map(error => allErrorMessages.push(error))
        this.validateNewNumber(room.number, allRooms).map(error => errorMessages.push(error))
        this.validateRoomType(room.type).map(error => errorMessages.push(error))
        this.validateAmenities(room.amenities).map(error => errorMessages.push(error))
        this.validateRoomPrice(room.price).map(error => errorMessages.push(error))
        this.validateRoomDiscount(room.discount).map(error => errorMessages.push(error))
        this.validateBookingList(room.booking_list, allBookings).map(error => errorMessages.push(error))

        return errorMessages
    }

    validatePhotos(photos: string[]): string[] {
        const errorMessages: string[] = []
        const regex = /\.(png|jpg)$/i

        photos.forEach((photo, index) => {
            if (typeof photo !== "string") {
                errorMessages.push(`Photo ${index} url is not a String`)
            }
            if (!regex.test(photo)) {
                errorMessages.push(`Photo ${index} is not .png or .jpg file`)
            }
        })

        if (photos[0] === undefined) {
            errorMessages.push('Main photo need to be set')
        }
        if (photos.length < 3) {
            errorMessages.push('Photos need to be at least 3')
        }

        return errorMessages
    }
    validateNewNumber(number: string, allRooms: RoomInterface[]): string[] {
        const errorMessages: string[] = []
        const regex = new RegExp(/^\d{3}$/)

        if (typeof number !== "string") {
            errorMessages.push('Number is not a string')
        }
        if (!regex.test(number)) {
            errorMessages.push('Number must have 3 numeric digits between 000 and 999')
        }
        if (allRooms.some(room => room.number === number)) {
            errorMessages.push('Number is already taken')
        }

        return errorMessages
    }
    // validateExistingNumber(number: string, allRooms: RoomInterface[]): string[] {
    //     const errorMessages: string[] = []
    //     const regex = new RegExp(/^\d{3}$/)

    //     if (typeof number !== "string") {
    //         errorMessages.push('Number is not a string')
    //     }
    //     if (!regex.test(number)) {
    //         errorMessages.push('Number must have 3 numeric digits between 000 and 999')
    //     }
    //     const roomExists = allRooms.some(room => room.number === number)
    //     if (!roomExists) {
    //         errorMessages.push('Number does not exist')
    //     }

    //     return errorMessages
    // }
    validateRoomType(type: string): string[] {
        const errorMessages: string[] = []

        if (typeof type !== "string") {
            errorMessages.push('Room Type is not a String')
        }
        if (!Object.values(RoomType).includes(type as RoomType)) {
            errorMessages.push('Room type is not a valid value')
        }

        return errorMessages
    }
    // DEBERIA SER ROOMAMENITIES[] y no STRING[]
    validateAmenities(amenities: string[]): string[] {
        const errorMessages: string[] = []

        if (!Array.isArray(amenities)) {
            errorMessages.push('Amenities is not an array of strings')
        }
        amenities.map(amenity => {
            if (!Object.values(RoomAmenities).includes(amenity as RoomAmenities)) {
                errorMessages.push(`Amenity: ${amenity} is not a valid value`)
            }
        })

        return errorMessages
    }
    validateRoomPrice(price: number): string[] {
        const errorMessages: string[] = []

        if (typeof price !== "number") {
            errorMessages.push('Price is not a number')
        }
        if (price < 25) {
            errorMessages.push('Price must be 25$ or more')
        }
        if (price > 100000) {
            errorMessages.push('Price must be 100 000$ or less')
        }

        return errorMessages
    }
    validateRoomDiscount(discount: number): string[] {
        const errorMessages: string[] = []

        if (typeof discount !== "number") {
            errorMessages.push('Discount is not a number')
        }
        if (discount < 0) {
            errorMessages.push('Discount must be 0 or more')
        }
        if (discount > 100) {
            errorMessages.push('Discount must be 100 or less')
        }

        return errorMessages
    }
    validateBookingList(bookingList: string[], allBookings: BookingInterface[]): string[] {
        const errorMessages: string[] = []

        bookingList.forEach((bookingId) => {
            validateIdString(bookingId, 'ID').map(error => {
                errorMessages.push(error)
            })
            const bookingExists = allBookings.some(booking => booking._id.toString() === bookingId)
            if (!bookingExists) {
                errorMessages.push(`Booking with ID #${bookingId} does not exist`)
            }
        })

        return errorMessages
    }

}