
import { Document } from "mongoose"
import { JobPosition } from "../../enums/jobPosition"
import { Role } from "../../enums/role"


export interface UserInterfaceDTO {
    photo: string | null
    full_name: string
    email: string
    phone_number: string
    start_date: Date
    end_date: Date
    job_position: JobPosition
    role: Role
    password: string
}

export interface UserInterfaceMongodb extends UserInterfaceDTO, Document {
    _id: string
}