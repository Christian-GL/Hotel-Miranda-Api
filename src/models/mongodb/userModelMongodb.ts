
import { Schema, model } from "mongoose"
import { UserInterfaceIdMongodb } from "../../interfaces/mongodb/userInterfaceMongodb"
import { Role } from "../../enums/role"


const UserSchemaMongodb = new Schema<UserInterfaceIdMongodb>
    ({
        photo: {
            type: String,
            required: false,
            default: null
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
        start_date: {
            type: Date,
            required: true
        },
        end_date: {
            type: Date,
            required: true
        },
        job_position: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: Object.values(Role)
        },
        password: {
            type: String,
            required: true
        }
    })

export const UserModelMongodb = model<UserInterfaceIdMongodb>('User', UserSchemaMongodb)