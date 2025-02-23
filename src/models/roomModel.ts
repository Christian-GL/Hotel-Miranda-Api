
import { Schema, model } from "mongoose"
import { BookingInterface } from "../interfaces/bookingInterface"
import { RoomInterface } from "../interfaces/roomInterface"
import { RoomType } from "../enums/roomType"
import { RoomAmenities } from "../enums/roomAmenities"
import { BookingStatus } from "../enums/bookingStatus"


const RoomSchema = new Schema<RoomInterface>
    ({
        photos: {
            type: [String],
            required: true
        },
        number: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: Object.values(RoomType)
        },
        amenities: {
            type: [String],
            required: true,
            enum: Object.values(RoomAmenities)
        },
        price: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        booking_list: [{
            photo: { type: String, required: true },
            full_name_guest: { type: String, required: true },
            order_date: { type: Date, required: true },
            check_in_date: { type: Date, required: true },
            check_out_date: { type: Date, required: true },
            status: { type: String, required: true, enum: Object.values(BookingStatus) },
            special_request: { type: String, required: true }
        }]
    })

export const RoomModel = model<RoomInterface>('Room', RoomSchema)