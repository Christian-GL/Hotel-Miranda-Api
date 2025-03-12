
import { Document } from "mongoose"


export interface ContactInterfaceMongodb extends Document {
    publish_date: Date
    full_name: string
    email: string
    phone_number: string
    comment: string
    archived: boolean
}