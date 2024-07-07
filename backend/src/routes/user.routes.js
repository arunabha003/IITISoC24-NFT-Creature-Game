import { Router } from "express";
import { registerUser,login,logout,getCrittersHeHave } from "../controllers/user.controllers.js";
import {upload} from '../middlewares/file-upload-multer.middlewares.js'
import { verifyTokens } from "../middlewares/auth.middlewares.js";

const userRouter = Router()

// Testing
// userRouter.route("/hii").get(hiiUser)

//Registration
userRouter.route("/register").post(upload.single('avatar'),registerUser)
userRouter.route("/login").post(upload.none(),login)
userRouter.route("/logout").post(verifyTokens,logout)
userRouter.route("/crittersHave").get(verifyTokens,getCrittersHeHave)


export default userRouter