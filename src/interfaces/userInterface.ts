
import { Document } from "mongoose"


export interface UserInterface extends Document {
    photo: string
    full_name: string
    email: string
    start_date: Date
    description: string
    phone_number: string
    status: string
    password: string
}