
import mongoose from "mongoose"


export interface ContactInterface extends mongoose.Document {
    id: number
    publish_date: string
    publish_time: string
    full_name: string
    email: string
    contact: string
    comment: string
}