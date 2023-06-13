import { getDb } from "../data/database.js"
import express from "express"
import {
	isValidId,
	isValidChannel,
	findMaxIdChannel,
} from "../data/validate.js"

const router = express.Router()
const db = getDb()

//GET /channels
router.get("/", async (req, res) => {
	await db.read()
	res.send(db.data.channel)
})

//GET /channels/:channelId
router.get("/:channelId", async (req, res) => {
	if (!isValidId(req.params.channelId)) {
		console.log("id måste vara siffror")
		res.status(400).send({
			message: "Inkorrekt channel id, måste vara siffror",
		})
		return
	}
	let channelId = Number(req.params.channelId)
	await db.read()
	let maybeChannel = db.data.channel.find(
		(channel) => channel.channelId === channelId
	)
	if (!maybeChannel) {
		console.log("channel id finns inte var god kontrollera")
		res.status(404).send({
			message: "Inkorrekt channel id",
		})
		return
	}
	res.send(maybeChannel)
})

//POST /channels
router.post("/", async (req, res) => {
	const maybeChannel = req.body

	if (!isValidChannel(maybeChannel)) {
		console.log("Felaktig body")
		res.status(400).send({
			message: "felaktig body måste innehålla name och locked",
		})
		return
	}

	await db.read()
	const newChannelId = findMaxIdChannel(db.data.channel) + 1
	const newChannel = {
		channelId: newChannelId,
		name: maybeChannel.name,
		locked: maybeChannel.locked,
	}

	db.data.channel.push(newChannel)
	await db.write()

	res.send({ channelId: newChannelId })
})

// DELETE /channels/:channelId
router.delete("/:channelId", async (req, res) => {
	if (!isValidId(req.params.channelId)) {
		console.log("inkorrekt id, får endast innehålla siffror")
		res.status(400).send({
			message: "inkorrekt id, får endast innehålla siffror",
		})
		return
	}
	let channelId = Number(req.params.channelId)
	await db.read()
	let maybeChannel = db.data.channel.find(
		(channel) => channel.channelId === channelId
	)
	if (!maybeChannel) {
		console.log("var god kontrollera id")
		res.status(404).send({
			message: "var god kontrollera id",
		})
		return
	}
	db.data.channel = db.data.channel.filter(
		(channel) => channel.channelId !== channelId
	)
	await db.write()
	res.sendStatus(200)
})

//PUT /channels/:channelId
router.put("/:channelId", async (req, res) => {
	if (!isValidId(req.params.channelId)) {
		console.log("kontrollera id")
		res.status(400).send({
			message: "kontrollera id, måste innehålla siffror",
		})
		return
	}

	const channelId = Number(req.params.channelId)
	const maybeChannel = req.body

	if (!isValidChannel(maybeChannel)) {
		console.log("kontrollera body")
		res.status(400).send({
			message: "kontrollera body, måste innehålla name och locked",
		})
		return
	}

	await db.read()
	const oldChannelIndex = db.data.channel.findIndex(
		(channel) => channel.channelId === channelId
	)

	if (oldChannelIndex === -1) {
		console.log("inkorrekt id")
		res.status(404).send({
			message: "inkorrekt id, var god kontrollera",
		})
		return
	}

	const updatedChannel = {
		channelId,
		name: maybeChannel.name,
		locked: maybeChannel.locked,
	}

	db.data.channel[oldChannelIndex] = updatedChannel
	await db.write()

	res.sendStatus(200)
})

export default router
