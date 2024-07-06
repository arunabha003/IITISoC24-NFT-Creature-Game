import mongoose, {Schema} from "mongoose";

const battleRecordSchema = new Schema(
    {
     winner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
     loser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
     matchDate:{
        type: Date,
        default: Date.now
     }   
    },

    {timestamps:true}
)

export const BattleRecord = mongoose.model('BattleRecord',battleRecordSchema)