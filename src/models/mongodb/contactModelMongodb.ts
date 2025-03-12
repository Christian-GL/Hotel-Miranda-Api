
import { Schema, model } from "mongoose"
import { ContactInterfaceMongodb } from "../../interfaces/mongodb/contactInterfaceMongodb"


const ContactSchemaMongodb = new Schema<ContactInterfaceMongodb>
    ({
        publish_date: {
            type: Date,
            required: true
        },
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
        comment: {
            type: String,
            required: true
        },
        archived: {
            type: Boolean,
            required: true
        }
    })

export const ContactModelMongodb = model<ContactInterfaceMongodb>('Contact', ContactSchemaMongodb)