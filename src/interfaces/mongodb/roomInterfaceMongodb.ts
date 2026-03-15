
import { Document } from "mongoose"

import { OptionYesNo } from "enums/optionYesNo"
import { RoomAmenities } from "enums/roomAmenities"
import { RoomType } from "enums/roomType"


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