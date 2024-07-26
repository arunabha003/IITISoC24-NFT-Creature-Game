import mongoose from "mongoose";

const critterSchema  = new mongoose.Schema(
    {
        name : {
            type:String,
            required:true,
        },
        tokenId : {
            required:true,
            type:String
        },
        nickname:{
            type:String,
        },
        master:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        tokenAddress:{
            type:String,
            required:true
        },
        critterImageUrl:{
            type:String,
            required:true
        },
        forSale : {
            type: Boolean,
            default:false
        }
    }
)

export const Critter = mongoose.model('Critter',critterSchema)