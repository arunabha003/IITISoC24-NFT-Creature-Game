import mongoose, { mongo } from 'mongoose'

const DB_NAME = "cluster"

async function connectDB(){
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/databaseNameShit`)
        console.log(`/n Database Connected!! : DB Host : ${connectionInstance}`)
    } catch (error) {
        console.log("MongoDB connection error" , error)
    }
}

export {connectDB}
