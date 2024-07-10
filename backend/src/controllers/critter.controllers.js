import {asyncHandler} from '../utils/asyncHandler.js'
import { Critter } from '../models/critter.models.js'
import {User} from '../models/user.models.js'
import ApiResponse from "../utils/apiResponse.js"
import ApiError from "../utils/apiError.js" 

const claimNFT = asyncHandler(async(req,res)=>{
    try {
        const master = req.user

        if(master.gotHisPartner==true){
            throw new ApiError(400,"Can't choose your partner again")
        }
        const {tokenId,address,nickname,name,critterImageUrl} = req.body

        console.log("tokenId address nickname : ",tokenId,nickname)
    
        if(!(tokenId && address)){
            throw new ApiError(400,"Token ID and address are required")
        }

        const critter = await Critter.create({
            name:name,
            tokenId:tokenId,
            tokenAddress:address,
            master: master._id,
            nickname: nickname || name,
            critterImageUrl:critterImageUrl
        })

        await User.findByIdAndUpdate(master._id,{
            $set:{
                gotHisPartner : true
            }
        },{new:true})

        
    
        await critter.save()
        res
        .status(200)
        .json(
             new ApiResponse(200,"Critter Created")
         )
    } catch (error) {
        throw new ApiError(500,"error in creating critter",error)
    }
    
})
export {
    claimNFT
}