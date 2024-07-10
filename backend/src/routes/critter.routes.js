import { Router } from "express";
import { verifyTokens } from "../middlewares/auth.middlewares.js";
import { claimNFT } from "../controllers/critter.controllers.js";


const critterRouter = Router()

// userRouter.route("/register").post(upload.single('avatar'),registerUser)

critterRouter.route("/claimFirstCritter").post(verifyTokens,claimNFT)


export default critterRouter