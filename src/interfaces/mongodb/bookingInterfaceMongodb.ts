
import { Document } from "mongoose"
import { OptionYesNo } from "../../enums/optionYesNo"


export interface BookingInterfaceCheckInOut {
    check_in_date: Date
    check_out_date: Date
}

export interface BookingInterfaceCheckInOutId extends BookingInterfaceCheckInOut {
    _id: string
}

export interface BookingInterfaceDTO extends BookingInterfaceCheckInOut {
    order_date: Date
    // check_in_date: Date
    // check_out_date: Date
    price: number
    special_request: string
    isArchived: OptionYesNo
    room_id_list: string[]
    client_id: string
}

export interface BookingInterfaceId extends BookingInterfaceDTO {
    _id: string
}

export interface BookingInterfaceIdMongodb extends BookingInterfaceDTO, Document {
    _id: string
}