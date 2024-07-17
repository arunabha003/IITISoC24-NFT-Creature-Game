import { Router } from "express";
import { verifyTokens } from "../middlewares/auth.middlewares.js";
import { fetchBattleRecordsLoss,fetchBattleRecordsWins,addbattleRecord } from "../controllers/battleRecord.controllers.js";


const battleRecordRouter = Router()

// userRouter.route("/register").post(upload.single('avatar'),registerUser)

battleRecordRouter.route("/battleRecords/wins").get(verifyTokens,fetchBattleRecordsWins)
battleRecordRouter.route("/battleRecords/loss").get(verifyTokens,fetchBattleRecordsLoss)
battleRecordRouter.route("/addBattleRecord").post(verifyTokens,addbattleRecord)


export default battleRecordRouter