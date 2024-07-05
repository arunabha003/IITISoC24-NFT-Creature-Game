import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:[true,"Username Required"],
            unique:[true,"Username already registered"],
        },
        password:{
            type:String,
            required:[true,"Password Required"],
            unique:true,
        },
        displayName:{
            type:String
        },
        walletAddress:{
            type:String,
            required:[true,"Connect your Wallet"],
        },
        avatar:{
            type:String,
        },
        crittersHave:[
            {
                types: mongoose.Schema.Types.ObjectId,
                ref:"Critter"
            }
        ]
    },
    {timestamps:true}
)

export const user = mongoose.model('User',userSchema)