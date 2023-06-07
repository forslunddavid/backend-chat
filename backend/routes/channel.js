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
	let maybeChannel = req.body
	if (isValidChannel(maybeChannel)) {
		await db.read()
		maybeChannel.channelId = findMaxIdChannel(db.data.channel) + 1
		db.data.channel.push(maybeChannel)
		await db.write()
		res.send({ channelId: maybeChannel.channelId })
	} else {
		res.sendStatus(400)
	}
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
	let channelId = Number(req.params.channelId)
	if (!isValidChannel(req.body)) {
		res.sendStatus(400)
		return
	}
	let newChannel = req.body
	await db.read()
	let oldChannelIndex = db.data.channel.findIndex(
		(channel) => channel.channelId === channelId
	)
	if (oldChannelIndex === -1) {
		res.sendStatus(404)
		return
	}
	newChannel.channelId = channelId
	db.data.channel[oldChannelIndex] = newChannel
	await db.write()
	res.sendStatus(200)
})

export default router
