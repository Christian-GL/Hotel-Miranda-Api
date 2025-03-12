
import { Document } from "mongoose"


export interface UserInterfaceMongodb extends Document {
    _id: string
    photo: string
    full_name: string
    email: string
    start_date: Date
    description: string
    phone_number: string
    status: string
    password: string
}