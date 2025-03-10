
import mongoose from "mongoose"
import * as dotenv from 'dotenv'

dotenv.config()


export const connectMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || '')
        // await mongoose.connect(process.env.MONGODB_URI || '')
        console.log('Connected to MongoDB')
    }
    catch (error) {
        console.error('Error trying to connect to MongoDB', error)
        process.exit(1)
    }
}