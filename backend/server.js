import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
// import jwt from "jsonwebtoken"
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

//start server
app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`)
})
