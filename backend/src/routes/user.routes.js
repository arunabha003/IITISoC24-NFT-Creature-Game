import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

const userRouter = Router()

// Testing
// userRouter.route("/hii").get(hiiUser)

//Registration
userRouter.route("/register").post(registerUser)


export default userRouter