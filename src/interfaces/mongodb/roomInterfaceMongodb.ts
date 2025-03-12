
import { Document } from "mongoose"
import { RoomType } from "../../enums/roomType"
import { RoomAmenities } from "../../enums/roomAmenities"
import { BookingInterfaceMongodb } from "./bookingInterfaceMongodb"


export interface RoomInterfaceMongodb extends Document {
    _id: string
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    booking_id_list: string[]
}

export interface RoomInterfaceMongodbWithBookingData extends Document {
    _id: string
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    booking_data_list: BookingInterfaceMongodb[]
}
