import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.models.js";


const options = {
    httpOnly: true,
    secure:true,
}

export const verifyTokens = asyncHandler(async(req,res,next)=>{
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
        throw new ApiError(401, "Access Token Not Found, Please Login");
    }

    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "User Not Found, Please Login");
        }

        req.user = user;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                throw new ApiError(401, "Refresh Token Not Found, Please Login Again");
            }

            try {
                const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const userFoundByRefreshToken = await User.findById(decodedRefreshToken._id).select("-password -refreshToken");

                if (!userFoundByRefreshToken) {
                    throw new ApiError(401, "User Not Found, Please Login Again");
                }

                res.clearCookie('accessToken'); // Clear old access token
                const newAccessToken = await userFoundByRefreshToken.generateAccessToken(); // Generate new access token
                res.cookie('accessToken', newAccessToken, options); // Set new access token

                req.user = userFoundByRefreshToken;
                next(); // Continue with the next middleware
            } catch (error) {
                throw new ApiError(401, "Refresh Token Expired or Invalid, Please Login Again");
            }
        } else {
            throw new ApiError(401, "Access Token Invalid, Please Login Again");
        }
    }
})