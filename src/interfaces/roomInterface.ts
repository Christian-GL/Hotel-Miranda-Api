
import mongoose from "mongoose"
import { RoomType } from "../enums/roomType"


export interface RoomInterface extends mongoose.Document {
    id: number
    photos: string[]
    type: RoomType
    amenities: string[]
    price: number
    discount: number
    booking_list: number[]
}