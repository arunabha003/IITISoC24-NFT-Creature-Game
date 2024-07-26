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

const fetchCritters = asyncHandler(async(req,res)=>{

        const masterId = req.user._id

        if(!masterId){
            throw new ApiError(400,"User doesn't exist")
        }
    
        const creatures = await Critter.find({ master: masterId }).exec();
    
        res
        .status(200)
        .json(creatures)

    
})

const listItem = asyncHandler(async(req,res)=>{
    const {id} = req.body
    
    if (!id) {
        throw new ApiError(400,"Can't find critter id")
    }

    const updatedCritter = await Critter.findByIdAndUpdate(id,
        {forSale:true}
    )

    if (!updatedCritter) {
        return res.status(404).json({ message: 'Critter not found' });
    }

    res
    .status(200)
    .json(new ApiResponse(200,"Critter updated for sale"))
})

const unListItem = asyncHandler(async(req,res)=>{
    const {id} = req.body
    const masterId = req.user._id
    
    if (!id) {
        throw new ApiError(400,"Can't find critter id")
    }

    const updatedCritter = await Critter.findByIdAndUpdate(id,
        {
            forSale:false,
            master:masterId
        }
    )

    if (!updatedCritter) {
        return res.status(404).json({ message: 'Critter not found' });
    }

    res
    .status(200)
    .json(new ApiResponse(200,"Critter unlisted from sale"))
})

const fetchCrittersForSale = asyncHandler(async(req,res)=>{
    const creatures = await Critter.find({ forSale: true }).exec();
    res
    .status(200)
    .json(creatures)
})

export {
    claimNFT,
    fetchCritters,
    listItem,
    fetchCrittersForSale,
    unListItem
}