import { Router } from "express";
import { registerUser,login,logout,getCrittersHeHave,userProfile,addEXP,leaderboard } from "../controllers/user.controllers.js";
import {upload} from '../middlewares/file-upload-multer.middlewares.js'
import { verifyTokens } from "../middlewares/auth.middlewares.js";

const userRouter = Router()

// Testing
// userRouter.route("/hii").get(hiiUser)

//Registration
userRouter.route("/register").post(upload.single('avatar'),registerUser)
userRouter.route("/login").post(upload.none(),login)
userRouter.route("/logout").get(verifyTokens,logout)
userRouter.route("/crittersHave").get(verifyTokens,getCrittersHeHave)
userRouter.route("/profile").get(verifyTokens,userProfile)
userRouter.route("/addEXP").post(verifyTokens,addEXP)
userRouter.route("/leaderboard").get(leaderboard)


export default userRouter