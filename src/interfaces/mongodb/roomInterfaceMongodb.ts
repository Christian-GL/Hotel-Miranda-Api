
import { Document } from "mongoose"
import { RoomType } from "../../enums/roomType"
import { RoomAmenities } from "../../enums/roomAmenities"
import { BookingInterfaceIdMongodb } from "./bookingInterfaceMongodb"
import { OptionYesNo } from "../../enums/optionYesNo"


interface RoomInterfaceMongodb extends Document {
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

export interface RoomInterfaceIdMongodb extends RoomInterfaceMongodb {
    booking_id_list: string[]
}

export interface RoomInterfaceFullDataMongodb extends RoomInterfaceMongodb {
    booking_data_list: BookingInterfaceIdMongodb[]
}
