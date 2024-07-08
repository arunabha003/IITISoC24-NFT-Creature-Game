import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()


app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    credentials: true,
})); 

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

//Routes import
import userRouter from './routes/user.routes.js'


//Routes Declaration
app.use("/api/v1/user",userRouter)

export {app}