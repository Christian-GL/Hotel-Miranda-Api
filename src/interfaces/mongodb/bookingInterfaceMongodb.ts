
import { Document } from "mongoose"
import { OptionYesNo } from "../../enums/optionYesNo"


export interface BookingInterfaceCheckInOut {
    check_in_date: Date
    check_out_date: Date
}

export interface BookingInterfaceCheckInOutId extends BookingInterfaceCheckInOut {
    _id: string
}

export interface BookingInterface extends BookingInterfaceCheckInOut {
    order_date: Date
    price: number
    special_request: string
    isArchived: OptionYesNo
    room_id_list: string[]
    client_id: string
}

export interface BookingInterfaceId extends BookingInterface {
    _id: string
}

export interface BookingInterfaceIdMongodb extends BookingInterface, Document {
    _id: string
}