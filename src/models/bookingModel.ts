
import { Schema, model } from "mongoose"
import { BookingInterface } from "../interfaces/bookingInterface"
import { BookingStatus } from "../enums/bookingStatus"
import { RoomType } from "../enums/roomType"
import { RoomAmenities } from "../enums/roomAmenities"


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
        status: {
            type: String,
            required: true,
            enum: Object.values(BookingStatus)
        },
        special_request: {
            type: String,
            required: true
        },
        room_list: [{
            number: { type: String, required: true },
            photos: { type: [String], required: true },
            type: { type: String, required: true, enum: Object.values(RoomType) },
            amenities: { type: [String], required: true, enum: Object.values(RoomAmenities) },
            price: { type: Number, required: true },
            discount: { type: Number, required: true }
        }]
        // room_list: [{
        //     type: Schema.Types.ObjectId,
        //     ref: "Room",
        //     required: true
        // }]
    })

export const BookingModel = model<BookingInterface>('Booking', BookingSchema)