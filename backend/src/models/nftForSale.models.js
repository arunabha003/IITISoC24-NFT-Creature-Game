import mongoose, {Schema} from "mongoose";

const nftForSaleSchema = new Schema(
    {
     critter:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Critter"
     },
     seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
     price:{
        type:Number,
        required:true
     }
    },

    {timestamps:true}
)

export const nftforSale = mongoose.model('NftforSale',nftForSaleSchema)