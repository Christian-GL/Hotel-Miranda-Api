
import { Document } from "mongoose"
import { ContactArchived } from "../../enums/contactArchived"


export interface ContactInterfaceMongodb extends Document {
    publish_date: Date
    full_name: string
    email: string
    phone_number: string
    comment: string
    archived: ContactArchived
}