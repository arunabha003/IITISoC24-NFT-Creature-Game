import {asyncHandler} from '../utils/asyncHandler.js'
import {User} from "../models/user.models.js"
import ApiResponse from "../utils/apiResponse.js"
import ApiError from "../utils/apiError.js" 

//testing
// const  hiiUser = asyncHandler(async(req,res)=>{
//     res.send("hii")
// })

//RegisterUser

const registerUser = asyncHandler(async(req,res)=>{
    const {username,password,displayName,walletAddress,avatar} = req.body
    if(!((username?.trim())|(password?.trim())|(walletAddress?.trim()))){
        throw new ApiError(400,"Fill the Required Details")
    }

    const usernameToLowerCase = username.toLowerCase()

    console.log(usernameToLowerCase)


    const existedUser = await User.findOne({
            $or:[
                {usernameToLowerCase},
                {walletAddress}
            ]
    })

    if(existedUser){
        throw new ApiError(404,"User Already Exist")
    }
    const user = await User.create(
        {
            username:username.toLowerCase(),
            password:password,
            displayName:displayName,
            avatar:avatar,
            walletAddress:walletAddress

        }
    )
    
    const createdUser = await User.findOne(
        {
            _id:user._id
        }
    ).select('-password -refreshToken')

    if(!createdUser){
        throw new ApiError(500,"Some issue in creating user from Server Side")
    }
    res
    .res.sendStatus(200)
    .json(
        new ApiResponse(200,"User Created Successfully")
    )
})

export {
    registerUser
}

