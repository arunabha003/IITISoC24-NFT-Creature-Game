import {asyncHandler} from '../utils/asyncHandler.js'

//testing
// const  hiiUser = asyncHandler(async(req,res)=>{
//     res.send("hii")
// })

//RegisterUser

const registerUser = asyncHandler(async(req,res)=>{
    const {username,password,displayName,walletAddress,avatar} = req.body
    res.status(225).send(username)
})


export {
    registerUser
}

