import mongoose, { mongo } from 'mongoose'

const DB_NAME = "cryptoCrittersDB"

async function connectDB(){
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`/n Database Connected!! : DB Host : ${connectionInstance.host}`)
    } catch (error) {
        console.log("MongoDB connection error" , error)
    }
}

export {connectDB}
