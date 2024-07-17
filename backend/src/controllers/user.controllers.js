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
    httpOnly: true,
    secure:true,
}
const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId)
        if(!user){
            throw new ApiError(400,"cant find user how to generate cookies for him")
        }
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

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    //clearing any existing cookies 
    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);


    //Setting cookies in response
    res
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .status(200)
    .json(
        new ApiResponse(200,"User Created Successfully")
    )
})

const login = asyncHandler(async(req,res)=>{
    res.clearCookie('accessToken',options);
    res.clearCookie('refreshToken',options);
    
    const {password,walletAddress} = req.body

    const user = await User.findOne({walletAddress:walletAddress})

    if(!user){
        throw new ApiError(400,"User doesn't exist")
    }
    let isPassValid

    isPassValid = await bcrypt.compare(password,user.password)

    if(!isPassValid){
        throw new ApiError(400,"incorrect details")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    console.log("userloggedIn")

    //clearing any existing cookies 
    res.clearCookie('accessToken', options); //changes
    res.clearCookie('refreshToken', options); //changes
    
    res
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .status(200)
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
    
    console.log("logged out succesfully")

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

const userProfile = asyncHandler(async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(500,"couldn't find user")
        }
        res
        .status(200)
        .json(user)
    } catch (error) {
        throw new ApiError(500,"couldn't find user")
    }
})

const addEXP = asyncHandler(async(req,res)=>{

    const {EXP} = req.body

    if (!EXP || isNaN(EXP)) {
        throw new ApiError(400, 'Invalid EXP points');
    }

    console.log(EXP)

    const user = req.user._id

    const player = await User.findById(user)

    if (!player) {
        throw new ApiError(404, 'User not found');
    }

    player.EXP = player.EXP + EXP

    await player.save()

    console.log("new exp added : ",player.username,player.EXP)
    
    res
    .status(201)
    .json(
         new ApiResponse(201,"Added EXP points to player")
    )
})

export {
    registerUser,
    login,
    logout,
    getCrittersHeHave,
    userProfile,
    addEXP
}

