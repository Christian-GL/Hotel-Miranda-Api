
import { Document } from "mongoose"
import { OptionYesNo } from "../../enums/optionYesNo"
import { RoomInterfaceIdMongodb } from "./roomInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "./clientInterfaceMongodb"


interface BookingInterfaceBaseMongodb extends Document {
    _id: string
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    price: number
    special_request: string
    isArchived: OptionYesNo
}

export interface BookingInterfaceIdMongodb extends BookingInterfaceBaseMongodb {
    room_id: string
    client_id: string
}

export interface BookingInterfaceFullDataMongodb extends BookingInterfaceBaseMongodb {
    room_data: RoomInterfaceIdMongodb
    client_data: ClientInterfaceIdMongodb
}

export interface BookingInterfaceReviewMongodb extends BookingInterfaceBaseMongodb {
    room_data: {
        room_id: string
        review_date: Date
        review_comment: string
    }[]
}