
import { Document } from "mongoose"
import { RoomInterface } from "./roomInterface"
import { BookingStatus } from "../enums/bookingStatus"


export interface BookingInterface extends Document {
    photo: string
    full_name_guest: string
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    room: Partial<RoomInterface>,
    booking_status: BookingStatus
    special_request: string
}