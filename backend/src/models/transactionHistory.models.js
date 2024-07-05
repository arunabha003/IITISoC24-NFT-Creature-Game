import mongoose, {Schema} from "mongoose";

const transactionHistorySchema = new Schema(
    {
     seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
     buyer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
     transactionDate:{
        type: Date,
        required:true
     },
     priceAtSold:{
        type: Number,
        required:true
     }    
    },

    {timestamps:true}
)

export const transactionHistory = mongoose.model('TransactionHistory',transactionHistorySchema)