import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const onSameWalletAsProfile = asyncHandler(async (req,res)=>{
    const user = req.user
    const {connectedAddress} = req.body
    console.log("user address : ",user.walletAddress)
    if(!(connectedAddress==user.walletAddress)){
        throw new ApiError(400,"connect wallet address connected to this user profile")
    }

    res.json({
        isValid:true
    })
})

