
import mongoose from "mongoose"


export interface UserInterface extends mongoose.Document {
    photo: string
    id: number
    full_name: string
    email: string
    start_date: string
    description: string
    phone_number: string
    status: string
    password: string
}