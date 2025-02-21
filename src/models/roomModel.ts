
import { Schema, model } from "mongoose"
import { RoomInterface } from "../interfaces/roomInterface"
import { RoomType } from "../enums/roomType"
import { RoomAmenities } from "../enums/roomAmenities"


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
        booking_list: {
            type: [String],
            required: true
        }
    })

export const RoomModel = model<RoomInterface>('Room', RoomSchema)