import express from "express"
import jwt from "jsonwebtoken"
import { secret } from "../server.js"
import { getDb } from "../data/database.js"
import bcrypt from "bcrypt"

const router = express.Router()
const db = getDb()

const users = db.data.users

// // Simulated database
// const users = [
// 	{
// 		userId: 17,
// 		username: "EthanYoung",
// 		password: "password17",
// 		channels: ["channel1", "channel2", "channel3"],
// 	},
// ]

// router.post("/login", (req, res) => {
// 	console.log("Received login request")
// 	if (!req.body || !req.body.username || !req.body.password) {
// 		console.log("Invalid request body")
// 		res.sendStatus(400)
// 		return
// 	}
// 	const { username, password } = req.body

// 	console.log("Received username:", username)
// 	console.log("Received password:", password)

// 	let found = users.find((user) => user.username === username)
// 	console.log("Found user:", found)
// 	if (!found) {
// 		console.log("- felaktigt användarnamn")
// 		res.sendStatus(401)
// 		return
// 	}
// 	if (found.password !== password) {
// 		console.log("- felaktigt lösenord")
// 		console.log("Expected password:", found.password)
// 		console.log("Provided password:", password)
// 		res.sendStatus(401)
// 		return
// 	}

// 	// Lyckad inloggning! Skapa en JWT och skicka tillbaka
// 	// jwt.sign(payload, secretOrPrivateKey, [options, callback])
// 	const hour = 60 * 60
// 	const payload = { userId: found.userId }
// 	const options = { expiresIn: 2 * hour }
// 	let token = jwt.sign(payload, secret, options)
// 	console.log("Signed JWT:", token)
// 	let tokenPackage = { token: token }
// 	res.send(tokenPackage)
// })

router.post("/login", async (req, res) => {
	const { username, password } = req.body

	const user = users.find((u) => u.username === username)
	if (!user) {
		res.sendStatus(401)
		return
	}

	await bcrypt.compare(password, user.hashedPassword, (err, result) => {
		if (err || !result) {
			res.sendStatus(401)
			return
		}

		const token = jwt.sign({ userId: user.id }, secret)
		res.cookie("token", token, { httpOnly: true })
		res.send({ success: true })
	})
})

export default router
