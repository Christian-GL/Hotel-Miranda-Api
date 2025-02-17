
import mongoose from "mongoose"


export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '')
        console.log('Connected to MongoDB')
    }
    catch (error) {
        console.error('Error trying to connect to MongoDB', error)
        process.exit(1)
    }
}