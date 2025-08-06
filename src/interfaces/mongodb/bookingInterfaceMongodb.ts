
import { Document } from "mongoose"
import { OptionYesNo } from "../../enums/optionYesNo"
import { RoomInterfaceIdMongodb } from "./roomInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "./clientInterfaceMongodb"


export interface BookingInterfaceDTO {
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    price: number
    special_request: string
    isArchived: OptionYesNo
    room_id: string
    client_id: string
}

export interface BookingInterfaceIdMongodb extends BookingInterfaceDTO, Document {
    _id: string
}

export interface BookingInterfaceIdFullDataMongodb extends Omit<BookingInterfaceIdMongodb, 'room_id' | 'client_id'> {
    room_data: RoomInterfaceIdMongodb
    client_data: ClientInterfaceIdMongodb
}