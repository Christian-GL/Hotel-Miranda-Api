
import { Document } from "mongoose"
import { RoomType } from "../../enums/roomType"
import { RoomAmenities } from "../../enums/roomAmenities"
import { OptionYesNo } from "../../enums/optionYesNo"


export interface RoomInterfacePriceAndDiscount {
    price: number
    discount: number
}

export interface RoomInterface extends RoomInterfacePriceAndDiscount {
    number: string
    photos: string[]
    type: RoomType
    amenities: RoomAmenities[]
    isActive: OptionYesNo
    isArchived: OptionYesNo
    booking_id_list: string[]
}

export interface RoomInterfaceIdMongodb extends RoomInterface, Document {
    _id: string
}