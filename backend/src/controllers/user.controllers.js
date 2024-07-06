import {asyncHandler} from '../utils/asyncHandler.js'
import {User} from "../models/user.models.js"
import ApiResponse from "../utils/apiResponse.js"
import ApiError from "../utils/apiError.js" 
import {uploadOnCloudinary} from "../utils/cloudinary.js"

//testing
// const  hiiUser = asyncHandler(async(req,res)=>{
//     res.send("hii")
// })

//RegisterUser

const registerUser = asyncHandler(async(req,res)=>{
    const {username,password,displayName,walletAddress,avatar} = req.body

    if(!((username?.trim())||(password?.trim())||(walletAddress?.trim()))){
        throw new ApiError(400,"Fill the Required Details")
    }

    const existedUser = await User.findOne({
            $or:[
                {username},
                {walletAddress}
            ]
    })

    if(existedUser){
        throw new ApiError(404,"User Already Exist")
    }
    
    let avatarURL=''
    if(req.file){
    const avatarLocalPath = req.file.path
    const uploadResponse = await uploadOnCloudinary(avatarLocalPath)
    avatarURL = uploadResponse.secure_url
    }

    const user = await User.create(
        {
            username:username.toLowerCase(),
            password:password,
            displayName:displayName,
            avatar:avatarURL,
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
    .status(200)
    .json(
        new ApiResponse(200,"User Created Successfully")
    )
})

export {
    registerUser
}

