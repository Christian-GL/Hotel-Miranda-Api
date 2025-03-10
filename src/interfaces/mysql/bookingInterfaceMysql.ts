
import { RoomInterfaceMysql } from "./roomInterfaceMysql"


export interface BookingInterfaceMysql {
    _id: number
    photo: string
    full_name_guest: string
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    special_request: string
    room_id: number
}

export interface BookingInterfaceMysqlWithRoomData {
    _id: number
    photo: string
    full_name_guest: string
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    special_request: string
    room_data: RoomInterfaceMysql
}
