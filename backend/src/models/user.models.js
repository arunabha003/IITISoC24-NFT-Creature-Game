import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:[true,"Username Required"],
        },
        password:{
            type:String,
            required:[true,"Password Required"],
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
        refreshToken:{
            type:String,
            default: null
        },
        gotHisPartner:{
            type:Boolean,
            default:false
        },
        EXP:{
            type:Number,
            default:0
        }
    },
    {timestamps:true}
);

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next(); 
    this.password=bcrypt.hash(this.password,10) //10 rounds of encryption
})

userSchema.methods.generateAccessToken = function(){
    try {
        const accessToken = jwt.sign(
            {
                _id:this._id,
                username:this.username,
                walletAddress:this.walletAddress,
                
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:process.env.ACCESS_TOKEN_EXPIRY
            }
        )
        return accessToken
        
    } catch (error) {
        console.log("error generating : ", error.message)
    }
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id, 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
        
    )
}

export const User = mongoose.model('User',userSchema)
