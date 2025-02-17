
import mongoose from "mongoose"
import { UserInterface } from "../interfaces/userInterface"
import { UserStatus } from "../enums/userStatus"


const UserSchema = new mongoose.Schema<UserInterface>
    ({
        photo: {
            type: String,
            required: true
        },
        full_name: {
            type: String,
            required: true
        },
        start_date: {
            type: String,
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
            enum: [UserStatus.active, UserStatus.inactive]
        },
        password: {
            type: String,
            required: true
        }
    })

export const UserModel = mongoose.model<UserInterface>('User', UserSchema)