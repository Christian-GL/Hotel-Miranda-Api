
import mongoose from "mongoose"
import * as dotenv from 'dotenv'

dotenv.config()


export const connectMongodbDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '')
        console.log('Connected to MongoDB')
    }
    catch (error) {
        console.error('Error trying to connect to MongoDB', error)
        process.exit(1)
    }
}