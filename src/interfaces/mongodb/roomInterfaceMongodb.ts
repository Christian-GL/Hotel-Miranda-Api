
import { Document } from "mongoose"
import { RoomType } from "../../enums/roomType"
import { RoomAmenities } from "../../enums/roomAmenities"
import { BookingInterfaceIdMongodb } from "./bookingInterfaceMongodb"
import { OptionYesNo } from "../../enums/optionYesNo"


export interface RoomInterfaceDTO {
    number: string
    photos: string[]
    type: RoomType
    amenities: RoomAmenities[]
    price: number
    discount: number
    isActive: OptionYesNo
    isArchived: OptionYesNo
    booking_id_list: string[]
}

export interface RoomInterfaceIdMongodb extends RoomInterfaceDTO, Document {
    _id: string
}

// export interface RoomInterfaceFullDataMongodb extends Omit<RoomInterfaceIdMongodb, 'booking_id_list'> {
//     booking_data_list: BookingInterfaceIdMongodb[]
// }
