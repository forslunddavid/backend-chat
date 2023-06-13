import express from "express"
import jwt from "jsonwebtoken"
import { getDb } from "../data/database.js"

const router = express.Router()
const db = getDb()
const secret = process.env.SECRET || "Supersecret"

router.post("/", async (req, res) => {
	await db.read()
	if (!req.body || !req.body.username || !req.body.password) {
		console.log(req.body, "req body")
		res.status(400).send({
			message: "400 Bad Request",
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
	const payload = { userId: found.id }
	let token = jwt.sign(payload, secret, { expiresIn: 2 * hour })
	console.log("Signed JWT: ", token)
	let tokenPackage = { token: token }
	res.send(tokenPackage)
})

export default router
