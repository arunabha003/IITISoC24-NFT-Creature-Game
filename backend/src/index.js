import dotenv from 'dotenv' 
import express from 'express'
import { connectDB } from './database/index.js'
import { app } from './app.js'


dotenv.config({
    path: "../.env"
})

connectDB()
.then(()=>{
    app.listen((`App listening on PORT : ${process.env.PORT}`))
})
.catch((err)=>{
    console.log("Port Connection Failed")
})


