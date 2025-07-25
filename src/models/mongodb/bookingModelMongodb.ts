
import { Schema, model } from "mongoose"
import { BookingInterfaceMongodb } from "../../interfaces/mongodb/bookingInterfaceMongodb"
import { OptionYesNo } from "../../enums/optionYesNo"


const BookingSchemaMongodb = new Schema<BookingInterfaceMongodb>
    ({
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
        special_request: {
            type: String,
            required: true
        },
        isArchived: {
            type: String,
            required: true,
            enum: Object.values(OptionYesNo)
        },
        room_id: {
            type: String,
            required: true
        },
        client_id: {
            type: String,
            required: true
        }
    })

export const BookingModelMongodb = model<BookingInterfaceMongodb>('Booking', BookingSchemaMongodb)