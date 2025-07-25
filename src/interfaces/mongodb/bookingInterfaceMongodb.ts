
import { Document } from "mongoose"
import { OptionYesNo } from "../../enums/optionYesNo"
import { RoomInterfaceMongodb } from "./roomInterfaceMongodb"
import { ClientInterfaceMongodb } from "./clientInterfaceMongodb"


export interface BookingInterfaceMongodb extends Document {
    _id: string
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    special_request: string
    isArchived: OptionYesNo
    room_id: string
    client_id: string
}

export interface BookingInterfaceWithDataMongodb extends Document {
    _id: string
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    special_request: string
    isArchived: OptionYesNo
    room_data: RoomInterfaceMongodb
    client_data: ClientInterfaceMongodb
}