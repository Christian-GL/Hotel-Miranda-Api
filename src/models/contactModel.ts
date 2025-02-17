
import mongoose from "mongoose"
import { ContactInterface } from "../interfaces/contactInterface"


const ContactSchema = new mongoose.Schema<ContactInterface>
    ({
        publish_date: {
            type: String,
            required: true
        },
        publish_time: {
            type: String,
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
        contact: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    })

export const ContactModel = mongoose.model<ContactInterface>('Contact', ContactSchema)