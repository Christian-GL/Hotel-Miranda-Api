
import { RoomInterface } from "./roomInterface"


export interface BookingInterface {
    id: number
    photo: string
    full_name_guest: string
    order_date: string
    order_time: string
    check_in_date: string
    check_in_time: string
    check_out_date: string
    check_out_time: string
    room: Partial<RoomInterface>,
    room_booking_status: string
    special_request: string
}