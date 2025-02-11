
import { RoomInterface } from "../interfaces/roomInterface"


export class RoomValidator {

    validateProperties(room: RoomInterface): string[] {
        const errorMessages: string[] = []
        const requiredProperties: string[] = ['photos', 'type', 'amenities', 'price', 'discount', 'booking_list']
        requiredProperties.map((property) => {
            if (!(property in room)) {
                errorMessages.push(`Property [${property}] is required in Room`)
            }
        })
        return errorMessages
    }

    validateRoom(room: RoomInterface): string[] {
        const allErrorMessages: string[] = []

        const checkProperties = this.validateProperties(room)
        if (checkProperties.length > 0) {
            return checkProperties
        }

        // this.validatePhotos(room.photos).errorMessages.map(
        //     error => allErrorMessages.push(error)
        // )
        this.validateRoomType(room.type).map(
            error => allErrorMessages.push(error)
        )
        this.validateAmenities(room.amenities).map(
            error => allErrorMessages.push(error)
        )
        this.validateRoomPrice(room.price).map(
            error => allErrorMessages.push(error)
        )
        this.validateRoomDiscount(room.discount).map(
            error => allErrorMessages.push(error)
        )

        return allErrorMessages
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
    validateRoomType(type: string): string[] {
        const errorMessages: string[] = []
        enum RoomType {
            suite = "Suite",
            singleBed = "Single Bed",
            doubleBed = "Double Bed",
            doubleSuperior = "Double Superior"
        }

        if (typeof type !== "string") {
            errorMessages.push('Room Type is not a String')
        }
        if (!Object.values(RoomType).includes(type as RoomType)) {
            errorMessages.push('Room type is not a valid value')
        }

        return errorMessages
    }
    validateAmenities(type: string[]): string[] {
        const errorMessages: string[] = []
        enum RoomAmenities {
            bedSpace3 = "3 Bed Space",
            bathroom2 = "2 Bathroom",
            wiFi = "WiFi",
            tv = "TV",
            ledTv = "LED TV",
            airConditioner = "Air Conditioner",
            minibar = "Minibar",
            balcony = "Balcony",
            shower = "Shower",
            towel = "Towel",
            bathtub = "Bathup",
            coffeeSet = "Cofee Set",
            guard24Hours = "24 Hours Guard"
        }

        if (!Array.isArray(type)) {
            errorMessages.push('Amenities is not an array of strings')
        }
        type.map(amenity => {
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

}