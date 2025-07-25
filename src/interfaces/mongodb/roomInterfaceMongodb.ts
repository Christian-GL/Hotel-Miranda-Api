
import { Document } from "mongoose"
import { RoomType } from "../../enums/roomType"
import { RoomAmenities } from "../../enums/roomAmenities"
import { BookingInterfaceMongodb } from "./bookingInterfaceMongodb"
import { OptionYesNo } from "../../enums/optionYesNo"


export interface RoomInterfaceMongodb extends Document {
    _id: string
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    isActive: OptionYesNo
    booking_id_list: string[]
}

export interface RoomInterfaceWithDataMongodb extends Document {
    _id: string
    photos: string[]
    number: string
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    isActive: OptionYesNo
    booking_data_list: BookingInterfaceMongodb[]
}
