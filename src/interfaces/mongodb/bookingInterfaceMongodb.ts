
import { Document } from "mongoose"
import { RoomInterfaceMongodb } from "./roomInterfaceMongodb"


export interface BookingInterfaceMongodb extends Document {
    _id: string
    photo: string
    full_name_guest: string
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    special_request: string
    room_id: string
}

export interface BookingInterfaceMongodbWithRoomData extends Document {
    _id: string
    photo: string
    full_name_guest: string
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    special_request: string
    room_data: RoomInterfaceMongodb
}
