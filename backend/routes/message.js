import { getDb } from "../data/database.js"
import express from "express"
import {
	isValidId,
	isValidMessage,
	findMaxIdMessage,
} from "../data/validate.js"
import { generateTimestamp } from "../utils/utils.js"

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
		console.log("Felaktigt id får endast innehålla siffror")
		res.status(400).send({
			message: "felaktigt id får endast innehålla siffror",
		})
		return
	}
	let messageId = Number(req.params.messageId)
	await db.read()
	let maybeMessage = db.data.messages.find(
		(message) => message.messageId === messageId
	)
	if (!maybeMessage) {
		console.log("var god kontrollera id")
		res.status(404).send({
			message: "var god kontrollera id",
		})
		return
	}
	res.send(maybeMessage)
})

//GET Messages from a specific channel
router.get("/channels/:channelId", async (req, res) => {
	const channelId = Number(req.params.channelId)

	if (isNaN(channelId) || channelId < 0) {
		console.log("id får endast innehålla siffror")
		res.status(400).send({
			message: "id får endast innehålla siffror",
		})
		return
	}
	await db.read()
	const messages = db.data.messages.filter(
		(message) => message.channelId === channelId
	)

	res.send({ messages })
})

//POST /messages
router.post("/", async (req, res) => {
	const maybeMessage = req.body

	if (!isValidMessage(maybeMessage)) {
		console.log("Body måste innehålla channelId, userId och content")
		res.status(400).send({
			message: "Body måste innehålla channelId, userId och content",
		})
		return
	}

	await db.read()
	const messageId = findMaxIdMessage(db.data.messages) + 1
	const timestamp = generateTimestamp()

	const newMessage = {
		messageId: messageId,
		channelId: maybeMessage.channelId,
		userId: maybeMessage.userId,
		content: maybeMessage.content,
		timestamp: timestamp,
	}

	db.data.messages.push(newMessage)
	await db.write()

	res.send({ message: newMessage })
})

// DELETE /messages/:messageId
router.delete("/:messageId", async (req, res) => {
	if (!isValidId(req.params.messageId)) {
		console.log("felaktigt id får endast innehålla siffror")
		res.status(400).send({ message: "Felaktigt id" })
		return
	}
	let messageId = Number(req.params.messageId)
	await db.read()
	let maybeMessage = db.data.messages.find(
		(message) => message.messageId === messageId
	)
	if (!maybeMessage) {
		console.log("inkorrekt id, var god kontrollera")
		res.status(404).send({ message: "inkorrekt id var god kontrollera" })
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
		console.log("inkorrekt id")
		res.status(400).send({ message: "Felaktigt id" })
		return
	}
	let messageId = Number(req.params.messageId)
	if (!isValidMessage(req.body)) {
		console.log("Inkorrekt body")
		res.status(400).send({
			message: "Felaktig body, får endast innehålla siffror",
		})
		return
	}
	let newMessage = req.body
	await db.read()
	let oldMessageIndex = db.data.messages.findIndex(
		(message) => message.messageId === messageId
	)
	if (oldMessageIndex === -1) {
		console.log("Id finns inte var god kontrollera")
		res.status(404).send({ message: "Id finns inte" })
		return
	}
	newMessage.messageId = messageId
	newMessage.timestamp = generateTimestamp()
	db.data.messages[oldMessageIndex] = newMessage
	await db.write()
	res.sendStatus(200)
})

export default router
