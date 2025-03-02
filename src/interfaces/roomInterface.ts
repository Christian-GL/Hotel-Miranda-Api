
import { Document } from "mongoose"
import { RoomType } from "../enums/roomType"
import { RoomAmenities } from "../enums/roomAmenities"
import { BookingInterface } from "./bookingInterface"


export interface RoomInterface extends Document {
    _id: string
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    booking_list: string[]
}

export interface RoomInterfaceWithBookingData extends Document {
    _id: string
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    booking_data_list: BookingInterface[]
}