
import { validateFullName, validateDateRelativeToNow, validateTextArea } from "./commonValidator"
import { RoomInterface } from "../interfaces/roomInterface"
import { RoomType } from "../enums/roomType"
import { RoomAmenities } from "../enums/roomAmenities"
import { BookingValidator } from "./bookingValidator"
import { BookingInterface } from "../interfaces/bookingInterface"


export class RoomValidator {

    validateProperties(room: RoomInterface): string[] {
        const errorMessages: string[] = []
        const requiredProperties: string[] = ['photos', 'number', 'type', 'amenities', 'price', 'discount', 'booking_list']

        requiredProperties.map((property) => {
            if (!(property in room)) {
                errorMessages.push(`Property [${property}] is required in Room`)
            }
        })
        // FALTA COMPROBAR PORPIEDADES DE LAS BOOKING DE BOOKING LIST (LO MISMO PARA BOOKINGVALIDATOR)
        return errorMessages
    }

    validateRoom(room: RoomInterface, allRooms: RoomInterface[], allBookings: BookingInterface[]): string[] {
        const allErrorMessages: string[] = []

        const errorsCheckingProperties = this.validateProperties(room)
        if (errorsCheckingProperties.length > 0) {
            return errorsCheckingProperties
        }

        // this.validatePhotos(room.photos).errorMessages.map(
        //     error => allErrorMessages.push(error)
        // )
        this.validateNumber(room.number, false, allRooms).map(
            error => allErrorMessages.push(error)
        )
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
        this.validateBookingList(room.booking_list, allBookings).map(
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
    validateNumber(number: string, validateExistingRoom: boolean, allRooms: RoomInterface[]): string[] {
        const errorMessages: string[] = []
        const regex = new RegExp(/^\d{3}$/)

        if (typeof number !== "string") {
            errorMessages.push('Number is not a string')
        }
        if (!regex.test(number)) {
            errorMessages.push('Number must have 3 numeric digits between 000 and 999')
        }
        if (!validateExistingRoom) {
            allRooms.map(room => {
                if (room.number === number) {
                    errorMessages.push('Number is already taken')
                }
            })
        }

        return errorMessages
    }
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
    validateBookingList(bookingList: Partial<BookingInterface[]>, allBookings: BookingInterface[]): string[] {
        const errorMessages: string[] = []
        const bookingValidator = new BookingValidator()
        const bookingRequiredProperties: string[] = ['_id', 'photo', 'full_name_guest', 'order_date',
            'check_in_date', 'check_out_date', 'status', 'special_request']

        bookingList.map(booking => {
            if (booking === undefined || Object.keys(booking).length === 0) {
                errorMessages.push('Some room in room_list of bookings is undefined or empty')
                return
            }
            bookingRequiredProperties.map((property) => {
                if (!(property in booking)) {
                    errorMessages.push(`Property [${property}] is required in Booking of booking_list`)
                    return errorMessages
                }
            })

            // VALIDAR FOTO
            validateFullName(booking.full_name_guest, 'Full name guest').map(
                error => errorMessages.push(error)
            )
            validateDateRelativeToNow(new Date(booking.order_date), true, 'Order date').map(
                error => errorMessages.push(error)
            )
            bookingValidator.validateCheckInCheckOut(booking.check_in_date, booking.check_out_date).map(
                error => errorMessages.push(error)
            )
            bookingValidator.validateDateIsOccupied(booking.check_in_date, booking.check_out_date, allBookings).map(
                error => errorMessages.push(error)
            )
            bookingValidator.validateBookingStatus(booking.status).map(
                error => errorMessages.push(error)
            )
            validateTextArea(booking.special_request, 'Special request').map(
                error => errorMessages.push(error)
            )
        })

        return errorMessages
    }

}