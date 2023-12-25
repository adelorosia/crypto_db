import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import dbConnect from "./config/db.js"
import userRouter from "./routes/userRouter.js"
import { errorHandler, notFound } from "./middlewares/error/errorHandler.js"

dotenv.config()

dbConnect()

const app=express()



const port=process.env.PORT || 5001

app.use(express.json())
app.use(cors({Credential:true,origin:"http://localhost:3000"}))
app.use(cookieParser())


app.use(userRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(port,()=>console.log(`server is running on Port: ${port}`))

