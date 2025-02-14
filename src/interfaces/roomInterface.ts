
import { RoomType } from "../enums/roomType"


export interface RoomInterface {
    id: number
    photos: string[]
    type: RoomType
    amenities: string[]
    price: number
    discount: number
    booking_list: number[]
}