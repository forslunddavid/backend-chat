import express from "express"
import jwt from "jsonwebtoken"
import { getDb } from "../data/database.js"
import dotenv from "dotenv"

dotenv.config()
const router = express.Router()
const db = getDb()
const secret = process.env.SECRET || "Supersecret"

router.post("/", async (req, res) => {
	await db.read()
	if (!req.body || !req.body.username || !req.body.password) {
		console.log("felaktigt format 400")
		res.status(400).send({
			message:
				"Inkorrekt body, måste innehålla username och password i JSON format",
		})
		return
	}
	const { username, password } = req.body

	let found = db.data.user.find((user) => user.username === username)
	if (!found) {
		console.log("- felaktigt användarnamn")
		res.status(401).send({
			message: "Felaktigt användarnamn eller lösenord",
		})
		return
	}
	if (found.password !== password) {
		console.log("- felaktigt lösenord")
		res.status(401).send({
			message: "Felaktigt användarnamn eller lösenord",
		})
		return
	}

	const hour = 60 * 60
	const payload = { userId: found.userId }
	let token = jwt.sign(payload, secret, { expiresIn: 2 * hour })
	console.log("Signed JWT: ", token)
	let tokenPackage = { token: token }
	res.send(tokenPackage)
})

export default router
