import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routes/user.js"
import channelRouter from "./routes/channel.js"
import messageRouter from "./routes/message.js"

import jwt from "jsonwebtoken"
// import { join, dirname } from "path"
// import { fileURLToPath } from "url"

//server config
const app = express()
dotenv.config()
const port = process.env.PORT || 1337
const secret = process.env.SECRET || "supersecret"

//middleware
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
	console.log(`${req.method}  ${req.url} `, req.body)
	next()
})

//routes
app.use("/api/users", userRouter)
app.use("/api/channels", channelRouter)
app.use("/api/messages", messageRouter)

//start server
app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`)
})
