
import mongoose from "mongoose"
import { RoomInterface } from "../interfaces/roomInterface"
import { RoomType } from "../enums/roomType"
import { RoomAmenities } from "../enums/roomAmenities"


const RoomSchema = new mongoose.Schema<RoomInterface>
    ({
        photos: {
            type: [String],
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: [
                RoomType.singleBed,
                RoomType.doubleBed,
                RoomType.doubleSuperior,
                RoomType.suite
            ]
        },
        amenities: {
            type: [String],
            required: true,
            enum: [
                RoomAmenities.bedSpace3,
                RoomAmenities.bathroom2,
                RoomAmenities.wiFi,
                RoomAmenities.tv,
                RoomAmenities.ledTv,
                RoomAmenities.airConditioner,
                RoomAmenities.balcony,
                RoomAmenities.shower,
                RoomAmenities.towel,
                RoomAmenities.bathtub,
                RoomAmenities.coffeeSet,
                RoomAmenities.guard24Hours
            ]
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
            type: [Number],
            required: true
        }
    })

export const RoomModel = mongoose.model<RoomInterface>('Room', RoomSchema)