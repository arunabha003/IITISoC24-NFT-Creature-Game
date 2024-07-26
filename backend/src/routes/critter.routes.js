import { Router } from "express";
import { verifyTokens } from "../middlewares/auth.middlewares.js";
import { claimNFT , fetchCritters,listItem,fetchCrittersForSale,unListItem} from "../controllers/critter.controllers.js";


const critterRouter = Router()

// userRouter.route("/register").post(upload.single('avatar'),registerUser)

critterRouter.route("/claimFirstCritter").post(verifyTokens,claimNFT)
critterRouter.route("/fetchCritters").get(verifyTokens,fetchCritters)
critterRouter.route("/fetchCrittersForSale").get(fetchCrittersForSale)
critterRouter.route("/listItem").post(verifyTokens,listItem)
critterRouter.route("/unListItem").post(verifyTokens,unListItem)

export default critterRouter