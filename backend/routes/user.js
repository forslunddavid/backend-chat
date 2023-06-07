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
		res.sendStatus(400)
		return
	}
	let userId = Number(req.params.userId)
	await db.read()
	let maybeUser = db.data.user.find((user) => user.userId === userId)
	if (!maybeUser) {
		res.sendStatus(404)
		return
	}
	res.send(maybeUser)
})

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
		res.sendStatus(400)
	}
})

// DELETE /users/:userId
router.delete("/:userId", async (req, res) => {
	if (!isValidId(req.params.userId)) {
		res.sendStatus(400)
		return
	}
	let userId = Number(req.params.userId)
	await db.read()
	let maybeUser = db.data.user.find((user) => user.userId === userId)
	if (!maybeUser) {
		res.sendStatus(404)
		return
	}
	db.data.user = db.data.user.filter((user) => user.userId !== userId)
	await db.write()
	res.sendStatus(200)
})

//PUT /users/:userId
router.put("/:userId", async (req, res) => {
	if (!isValidId(req.params.userId)) {
		res.sendStatus(400)
		return
	}
	let userId = Number(req.params.userId)
	if (!isValidUser(req.body)) {
		res.sendStatus(400)
		return
	}
	let newUser = req.body
	await db.read()
	let oldUserIndex = db.data.user.findIndex((user) => user.userId === userId)
	if (oldUserIndex === -1) {
		res.sendStatus(404)
		return
	}
	newUser.userId = userId
	db.data.user[oldUserIndex] = newUser
	await db.write()
	res.sendStatus(200)
})

export default router
