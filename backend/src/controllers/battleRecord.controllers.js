import ApiResponse from "../utils/apiResponse.js"
import ApiError from "../utils/apiError.js" 
import {BattleRecord} from "../models/battleRecord.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {User} from '../models/user.models.js'

const fetchBattleRecordsWins = asyncHandler(async (req,res)=>{
    const user = req.user

    const username = user.username

    if(!user){
        new ApiError(400,"User doesn't exist")
    }

    const wins = await BattleRecord.find({winner : username}).exec()

    res
    .status(200)
    .json(wins)


})
const fetchBattleRecordsLoss = asyncHandler(async (req,res)=>{
    const user = req.user

    const username = user.username

    if(!user){
        new ApiError(400,"User doesn't exist")
    }

    const loss = await BattleRecord.find({winner : username}).exec()

    res
    .status(200)
    .json(loss)

})
const addbattleRecord = asyncHandler(async (req,res)=>{
    const {winnerUsername,loserUsername} = req.body

    const winnerID = await User.findOne({
        username : winnerUsername
    })
    const loserID = await User.findOne({
        username : loserUsername
    })

    const battleRecordAdded = await BattleRecord.create({
        winner:winnerID,
        loser:loserID,
        matchDate: new Date()
    })

    await battleRecordAdded.save()
    console.log("battle record added")
    res
        .status(201)
        .json(
             new ApiResponse(201,"BattleRecord Added")
         )
})

export{
    fetchBattleRecordsLoss,
    fetchBattleRecordsWins,
    addbattleRecord
}