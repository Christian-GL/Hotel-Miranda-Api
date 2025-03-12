
import { Schema, model } from "mongoose"
import { RoomInterfaceMongodb } from "../../interfaces/mongodb/roomInterfaceMongodb"
import { RoomType } from "../../enums/roomType"
import { RoomAmenities } from "../../enums/roomAmenities"


const RoomSchemaMongodb = new Schema<RoomInterfaceMongodb>
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
        booking_id_list: {
            type: [String],
            required: true
        }
    })

export const RoomModelMongodb = model<RoomInterfaceMongodb>('Room', RoomSchemaMongodb)