
import { Document } from "mongoose"
import { JobPosition } from "../../enums/jobPosition"


export interface UserInterfaceMongoDB extends Document {
    _id: string
    photo: string | null
    full_name: string
    email: string
    start_date: Date
    end_date: Date
    job_position: JobPosition
    phone_number: string
    password: string
}