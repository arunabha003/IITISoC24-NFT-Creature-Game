import mongoose, { mongo } from 'mongoose'

async function connectDB(){
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/CryptoCrittersDB`)
        console.log(`/n Database Connected!!`)
    } catch (error) {
        console.log(" /n MongoDB connection error" , error)
    }
}

export {connectDB}
