
import mongoose from "mongoose"
import * as dotenv from 'dotenv'

dotenv.config()


export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || '')
        console.log('Connected to MongoDB')
    }
    catch (error) {
        console.error('Error trying to connect to MongoDB', error)
        process.exit(1)
    }
}