import express from "express"
import { getDb } from "../data/database.js"
import { isValidId, isValidUser, findMaxIdUser } from "../data/validate.js"

const router = express.Router()
const db = getDb()

//GET /users
router.get("/", async (req, res) => {
	await db.read()
	res.send(db.data.user)
})

//GET /users/:userId
router.get("/:userId", async (req, res) => {
	if (!isValidId(req.params.userId)) {
		console.log("user id måste innehålla siffror")
		res.status(400).send({
			message: "User id måste innehålla siffror.",
		})
		return
	}
	let userId = Number(req.params.userId)
	await db.read()
	let maybeUser = db.data.user.find((user) => user.userId === userId)
	if (!maybeUser) {
		console.log("Felaktigt user Id")
		res.status(404).send({
			message: "Felaktigt user Id",
		})
		return
	}
	res.send(maybeUser)
})

//lägga till koll för att man inte ska kunna ha samma användarnamn?

//POST /users
router.post("/", async (req, res) => {
	let maybeUser = req.body
	if (isValidUser(maybeUser)) {
		await db.read()
		maybeUser.userId = findMaxIdUser(db.data.user) + 1
		db.data.user.push(maybeUser)
		await db.write()
		res.send({ userId: maybeUser.userId })
	} else {
		console.log("inkorrekt body")
		res.status(400).send({
			message:
				"Kontrollera att du fyllt i body korrekt, name, channels och password.",
		})
	}
})

// DELETE /users/:userId
router.delete("/:userId", async (req, res) => {
	if (!isValidId(req.params.userId)) {
		console.log("felaktigt format")
		res.status(400).send({
			message: "Bad Request, user id får endast innehålla siffror",
		})
		return
	}
	let userId = Number(req.params.userId)
	await db.read()
	let maybeUser = db.data.user.find((user) => user.userId === userId)
	if (!maybeUser) {
		console.log("felaktigt id")
		res.status(404).send({
			message: "Felaktigt user Id",
		})
		return
	}
	db.data.user = db.data.user.filter((user) => user.userId !== userId)
	await db.write()
	res.sendStatus(200)
})

//PUT /users/:userId
router.put("/:userId", async (req, res) => {
	if (!isValidId(req.params.userId)) {
		console.log("user id måste innehålla siffror")
		res.status(400).send({
			message: "Inkorrekt user Id, id måste vara siffror",
		})
		return
	}
	let userId = Number(req.params.userId)
	if (!isValidUser(req.body)) {
		console.log("inkorrekt body")
		res.status(400).send({
			message:
				"Inkorrekt användare, kontrollera body, ska innehålla name, password och channels.",
		})
		return
	}
	let newUser = req.body
	await db.read()
	let oldUserIndex = db.data.user.findIndex((user) => user.userId === userId)
	if (oldUserIndex === -1) {
		console.log("felaktigt user id")
		res.status(404).send({
			message: "Inkorrekt user Id",
		})
		return
	}
	newUser.userId = userId
	db.data.user[oldUserIndex] = newUser
	await db.write()
	res.sendStatus(200)
})

export default router
