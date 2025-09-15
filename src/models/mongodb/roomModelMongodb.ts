
import { Schema, model } from "mongoose"
import { RoomInterfaceIdMongodb } from "../../interfaces/mongodb/roomInterfaceMongodb"
import { RoomType } from "../../enums/roomType"
import { RoomAmenities } from "../../enums/roomAmenities"
import { OptionYesNo } from "../../enums/optionYesNo"


const RoomSchemaMongodb = new Schema<RoomInterfaceIdMongodb>
    ({
        number: {
            type: String,
            required: true,
            unique: true
        },
        photos: {
            type: [String],
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
        isActive: {
            type: String,
            required: true,
            enum: Object.values(OptionYesNo)
        },
        isArchived: {
            type: String,
            required: true,
            enum: Object.values(OptionYesNo)
        },
        booking_id_list: {
            type: [String],
            required: true
        }
    })

export const RoomModelMongodb = model<RoomInterfaceIdMongodb>('Room', RoomSchemaMongodb)