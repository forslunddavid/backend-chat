import { getDb } from "../data/database.js"
import express from "express"
import {
	isValidId,
	isValidMessage,
	findMaxIdMessage,
} from "../data/validate.js"
import { generateTimestamp } from "../utils/utils.js"
import jwt from "jsonwebtoken"

const router = express.Router()
const db = getDb()

//GET /messages
router.get("/", async (req, res) => {
	await db.read()
	res.send({ messages: db.data.messages })
})

//GET /messages/:messageId
router.get("/:messageId", async (req, res) => {
	if (!isValidId(req.params.messageId)) {
		res.sendStatus(400)
		return
	}
	let messageId = Number(req.params.messageId)
	await db.read()
	let maybeMessage = db.data.messages.find(
		(message) => message.messageId === messageId
	)
	if (!maybeMessage) {
		res.sendStatus(404)
		return
	}
	res.send(maybeMessage)
})

//GET /channels/:channelId/messages
router.get("/:channelId/messages", async (req, res) => {
	if (!isValidId(req.params.channelId)) {
		res.sendStatus(400)
		return
	}
	let channelId = Number(req.params.channelId)
	await db.read()
	let messages = db.data.messages.filter(
		(message) => message.channelId === channelId
	)
	res.send({ messages })
})

//POST /messages
router.post("/", async (req, res) => {
	console.log("Request body:", req.body)
	let maybeMessage = req.body
	maybeMessage.messageId = findMaxIdMessage(db.data.messages) + 1
	maybeMessage.timestamp = generateTimestamp()

	if (isValidMessage(maybeMessage)) {
		try {
			await db.read()
			db.data.messages.push(maybeMessage)
			console.log("db data messages", db.data.messages)
			await db.write()
			res.send({ messageId: maybeMessage.messageId })
		} catch (err) {
			console.log(err)
			res.sendStatus(500)
		}
	} else {
		res.sendStatus(400)
	}
})

// DELETE /messages/:messageId
router.delete("/:messageId", async (req, res) => {
	if (!isValidId(req.params.messageId)) {
		res.sendStatus(400)
		return
	}
	let messageId = Number(req.params.messageId)
	await db.read()
	let maybeMessage = db.data.messages.find(
		(message) => message.messageId === messageId
	)
	if (!maybeMessage) {
		res.sendStatus(404)
		return
	}
	db.data.messages = db.data.messages.filter(
		(message) => message.messageId !== messageId
	)
	await db.write()
	res.sendStatus(200)
})

//PUT /messages/:messageId
router.put("/:messageId", async (req, res) => {
	if (!isValidId(req.params.messageId)) {
		console.log("invalid ID")
		res.sendStatus(400)
		return
	}
	let messageId = Number(req.params.messageId)
	if (!isValidMessage(req.body)) {
		console.log(isValidMessage(req.body))
		console.log("invalid message")
		res.sendStatus(400)
		return
	}
	let newMessage = req.body
	await db.read()
	let oldMessageIndex = db.data.messages.findIndex(
		(message) => message.messageId === messageId
	)
	if (oldMessageIndex === -1) {
		res.sendStatus(404)
		return
	}
	newMessage.messageId = messageId
	newMessage.timestamp = generateTimestamp()
	db.data.messages[oldMessageIndex] = newMessage
	await db.write()
	res.sendStatus(200)
})

export default router
