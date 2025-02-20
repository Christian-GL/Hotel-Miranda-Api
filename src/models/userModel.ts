
import { Schema, model } from "mongoose"
import { UserInterface } from "../interfaces/userInterface"
import { UserStatus } from "../enums/userStatus"


const UserSchema = new Schema<UserInterface>
    ({
        photo: {
            type: String,
            required: true
        },
        full_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        start_date: {
            type: Date,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        phone_number: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(UserStatus)
        },
        password: {
            type: String,
            required: true
        }
    })

export const UserModel = model<UserInterface>('User', UserSchema)