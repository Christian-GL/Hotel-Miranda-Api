
import { RoomType } from "../../enums/roomType"
import { RoomAmenities } from "../../enums/roomAmenities"
import { BookingInterfaceMysql } from "./bookingInterfaceMysql"


export interface RoomInterfaceMysql {
    _id: number
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
}

export interface RoomInterfaceMysqlWithBookingData {
    _id: number
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    booking_data_list: BookingInterfaceMysql[]
}
