
import mongoose from "mongoose"
import { ContactInterface } from "../interfaces/contactInterface"


const ContactSchema = new mongoose.Schema<ContactInterface>
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
        }
    })

export const ContactModel = mongoose.model<ContactInterface>('Contact', ContactSchema)