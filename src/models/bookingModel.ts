
import { Schema, model } from "mongoose"
import { BookingInterface } from "../interfaces/bookingInterface"
import { BookingStatus } from "../enums/bookingStatus"
import { RoomType } from "../enums/roomType"


const BookingSchema = new Schema<BookingInterface>
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
            type: Date,
            required: true
        },
        check_in_date: {
            type: Date,
            required: true
        },
        check_out_date: {
            type: Date,
            required: true
        },
        room: {
            id: { type: String, required: true },
            type: { type: String, required: true, enum: Object.values(RoomType) }
        },
        booking_status: {
            type: String,
            required: true,
            enum: Object.values(BookingStatus)
        },
        special_request: {
            type: String,
            required: true
        },
    })

export const BookingModel = model<BookingInterface>('Booking', BookingSchema)