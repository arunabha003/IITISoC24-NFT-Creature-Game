const asyncHandler = (functionRequested)=>{
    return (req,res,next)=>{
        Promise.resolve(functionRequested(req,res,next)).catch((err)=>next(err))
    }
}

export {asyncHandler}