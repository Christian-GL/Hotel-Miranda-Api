
import { Schema, model } from "mongoose"
import { ClientInterfaceIdMongodb } from "../../interfaces/mongodb/clientInterfaceMongodb"
import { OptionYesNo } from "../../enums/optionYesNo"


const ClientSchemaMongodb = new Schema<ClientInterfaceIdMongodb>
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

export const ClientModelMongodb = model<ClientInterfaceIdMongodb>('Client', ClientSchemaMongodb)