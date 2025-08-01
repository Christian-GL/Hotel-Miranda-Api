
import { Schema, model } from "mongoose"
import { ClientInterfaceBaseMongodb } from "../../interfaces/mongodb/clientInterfaceMongodb"
import { OptionYesNo } from "../../enums/optionYesNo"


const ClientSchemaMongodb = new Schema<ClientInterfaceBaseMongodb>
    ({
        full_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone_number: {
            type: String,
            required: true
        },
        review_date: {
            type: Date,
            required: true
        },
        review_comment: {
            type: String,
            required: true
        },
        isArchived: {
            type: String,
            required: true,
            enum: Object.values(OptionYesNo)
        },
        booking_id_list: {
            type: [String],
            required: true
        },
    })

export const ClientModelMongodb = model<ClientInterfaceBaseMongodb>('Contact', ClientSchemaMongodb)