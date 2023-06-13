import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routes/user.js"
import channelRouter from "./routes/channel.js"
import messageRouter from "./routes/message.js"
import authRouter from "./routes/login.js"
import jwt from "jsonwebtoken"

dotenv.config()

const app = express()
const port = process.env.PORT || 1337
const secret = process.env.SECRET || "supersecret"

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`, req.body)
	next()
})

// Authentication middleware
// app.use((req, res, next) => {
// 	const token = req.headers.authorization

// 	if (!token) {
// 		res.sendStatus(401)
// 		return
// 	}

// 	jwt.verify(token, secret, (err, user) => {
// 		if (err) {
// 			res.sendStatus(403)
// 			return
// 		}

// 		req.user = user
// 		next()
// 	})
// })

// app.use((req, res, next) => {
// 	const token = req.headers.authorization
// 	if (!token) {
// 		res.sendStatus(401)
// 		return
// 	}

// 	jwt.verify(token, secret, (err, user) => {
// 		if (err) {
// 			res.sendStatus(403)
// 			return
// 		}

// 		req.user = user
// 		next()
// 	})
// })

// Routes
app.use("/api/users", userRouter)
app.use("/api/channels", channelRouter)
app.use("/api/messages", messageRouter)
app.use("/api/login", authRouter)

app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`)
})

export { secret }
