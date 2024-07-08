import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.models.js";

export const verifyTokens = asyncHandler(async(req,res,next)=>{
    const token = await req.cookies?.accessToken

    if(!token){
        throw new ApiError(400,"Access Token Not Found")
    }

    const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    if(!user){
        throw new ApiError(401,"Invalid Access Token")
    }

    // if (!connectedWallet) {
    //     throw new ApiError(400, "Missing walletAddress in request");
    // }

    // if(user.walletAddress!=connectedWallet){
    //     throw new ApiError(401,"Connect wallet associate with the profile")
    // }

    req.user = user
    next()
})