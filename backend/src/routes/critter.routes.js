import { Router } from "express";
import { verifyTokens } from "../middlewares/auth.middlewares.js";
import { claimNFT , fetchCritters} from "../controllers/critter.controllers.js";


const critterRouter = Router()

// userRouter.route("/register").post(upload.single('avatar'),registerUser)

critterRouter.route("/claimFirstCritter").post(verifyTokens,claimNFT)
critterRouter.route("/fetchCritters").get(verifyTokens,fetchCritters)


export default critterRouter