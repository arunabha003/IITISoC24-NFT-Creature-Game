import {asyncHandler} from '../utils/asyncHandler.js'
import {User} from "../models/user.models.js"
import { Critter } from '../models/critter.models.js'
import ApiResponse from "../utils/apiResponse.js"
import ApiError from "../utils/apiError.js" 
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import bcrypt from 'bcrypt'

//testing
// const  hiiUser = asyncHandler(async(req,res)=>{
//     res.send("hii")
// })

const options = {
    httpOnly:true,
    secure:true
}
const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    }catch(error){
        throw new ApiError(500,"error in generating access token")
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {username,password,displayName,walletAddress,avatar} = req.body
    console.log(username)

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

    const hashedPassword = await bcrypt.hash(password,10)

    const user = await User.create(
        {
            username:username.toLowerCase(),
            password:hashedPassword,
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

    if(createdUser){
        console.log("user created successfully")
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,"User Created Successfully")
    )
})

const login = asyncHandler(async(req,res)=>{
    const {username,password,walletAddress} = req.body

    const user = await User.findOne({
        $or:[{username},{walletAddress}]
    })

    if(!user){
        throw new ApiError(400,"User doesn't exist")
    }
    let isPassValid

    isPassValid = await bcrypt.compare(password,user.password)

    if(!isPassValid){
        throw new ApiError(400,"incorrect details")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,"User Logged In Successfully")
    )

})

const logout = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken : undefined
        }
    },{new:true})

    res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,"User logged Out Successfully")
    )

})

const getCrittersHeHave = asyncHandler(async (req,res)=>{
    const userId = req.body._id

    const crittersHaveByUserId = await Critter.aggregate([
    {
        $match: {
            master:userId //Match all field in Critter Database whose master is userId
        },
        
    },
    {
        $project:{
            name: 1,
            tokenId: 1,
            nickname: 1
        }
    }
    ])

    res
    .status(200)
    .json(
         new ApiResponse(200,crittersHaveByUserId,"Critters User Has Successfully Retrieved")
    )
}) 

export {
    registerUser,
    login,
    logout,
    getCrittersHeHave
}

