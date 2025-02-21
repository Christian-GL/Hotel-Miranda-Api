
import { Document } from "mongoose"
import { RoomType } from "../enums/roomType"
import { RoomAmenities } from "../enums/roomAmenities"


export interface RoomInterface extends Document {
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    booking_list: string[]
}