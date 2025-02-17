
import mongoose from "mongoose"
import { BookingInterface } from "../interfaces/bookingInterface"
// import { RoomInterface } from "../interfaces/roomInterface"
// import { RoomType } from "../enums/roomType"
import { BookingStatus } from "../enums/bookingStatus"


const BookingSchema = new mongoose.Schema<BookingInterface>
    ({
        photo: {
            type: String,
            required: true
        },
        full_name_guest: {
            type: String,
            required: true
        },
        order_date: {
            type: String,
            required: true
        },
        order_time: {
            type: String,
            required: true
        },
        check_in_date: {
            type: String,
            required: true
        },
        check_in_time: {
            type: String,
            required: true
        },
        check_out_date: {
            type: String,
            required: true
        },
        check_out_time: {
            type: String,
            required: true
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },
        room_booking_status: {
            type: String,
            required: true,
            enum: [
                BookingStatus.checkIn,
                BookingStatus.inProgress,
                BookingStatus.checkOut
            ]
        },
        special_request: {
            type: String,
            required: true
        },
    })

export const BookingModel = mongoose.model<BookingInterface>('Booking', BookingSchema)