
import { Document, Types } from "mongoose"
import { BookingStatus } from "../enums/bookingStatus"


export interface BookingInterface extends Document {
    _id: string
    photo: string
    full_name_guest: string
    order_date: Date
    check_in_date: Date
    check_out_date: Date
    status: BookingStatus
    special_request: string
    room_id: string
}