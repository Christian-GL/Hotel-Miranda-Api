
import { Document } from "mongoose"
import { RoomInterfaceMongoDB } from "./roomInterfaceMongodb"
import { ClientInterfaceMongoDB } from "./clientInterfaceMongodb"


export interface BookingInterfaceMongoDB extends Document {
    _id: string
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    special_request: string
    room_id: string
    client_id: string
}

export interface BookingInterfaceWithRoomDataMongoDB extends Document {
    _id: string
    full_name_guest: string
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    special_request: string
    room_data: RoomInterfaceMongoDB
    client_data: ClientInterfaceMongoDB
}
