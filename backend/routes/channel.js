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
		res.sendStatus(400)
		return
	}
	let channelId = Number(req.params.channelId)
	await db.read()
	let maybeChannel = db.data.channel.find(
		(channel) => channel.channelId === channelId
	)
	if (!maybeChannel) {
		res.sendStatus(404)
		return
	}
	res.send(maybeChannel)
})

//POST /channels
router.post("/", async (req, res) => {
	const maybeChannel = req.body

	if (!isValidChannel(maybeChannel)) {
		res.sendStatus(400)
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
		res.sendStatus(400)
		return
	}
	let channelId = Number(req.params.channelId)
	await db.read()
	let maybeChannel = db.data.channel.find(
		(channel) => channel.channelId === channelId
	)
	if (!maybeChannel) {
		res.sendStatus(404)
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
		res.sendStatus(400)
		return
	}

	const channelId = Number(req.params.channelId)
	const maybeChannel = req.body

	if (!isValidChannel(maybeChannel)) {
		res.sendStatus(400)
		return
	}

	await db.read()
	const oldChannelIndex = db.data.channel.findIndex(
		(channel) => channel.channelId === channelId
	)

	if (oldChannelIndex === -1) {
		res.sendStatus(404)
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
