import { Router } from "express";
import { registerUser,login } from "../controllers/user.controllers.js";
import {upload} from '../middlewares/file-upload-multer.middlewares.js'

const userRouter = Router()

// Testing
// userRouter.route("/hii").get(hiiUser)

//Registration
userRouter.route("/register").post(upload.single('avatar'),registerUser)
userRouter.route("/login").post(upload.none(),login)


export default userRouter