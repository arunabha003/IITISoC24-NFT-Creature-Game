import mongoose from "mongoose";

const critterSchema  = new mongoose.Schema(
    {
        name : {
            type:String,
            required:true,
        },
        tokenId : {
            required:true,
            type:Number
        },
        nickname:{
            type:String,
        }
    }
)

export const critter = mongoose.model('Critter',critterSchema)