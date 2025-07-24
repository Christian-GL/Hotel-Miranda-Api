
import { Document } from "mongoose"
import { BookingInterfaceMongoDB } from "./bookingInterfaceMongodb"
import { ContactArchived } from "../../enums/contactArchived"


export interface ClientInterfaceMongoDB extends Document {
    _id: string
    full_name: string
    email: string
    phone_number: string
    review_date: Date
    review_comment: string
    room_data: BookingInterfaceMongoDB
    archived: ContactArchived
}