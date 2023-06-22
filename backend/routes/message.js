import { getDb } from "../data/database.js"
import express from "express"
import {
	isValidId,
	isValidMessage,
	findMaxIdMessage,
} from "../data/validate.js"
import { generateTimestamp } from "../utils/utils.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
const router = express.Router()
const db = getDb()
const secret = process.env.SECRET || "Supersecret"
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
	const messageId = Number(req.params.messageId)
	await db.read()
	const message = db.data.messages.find((m) => m.messageId === messageId)
	if (!message) {
		console.log("var god kontrollera id")
		res.status(404).send({
			message: "var god kontrollera id",
		})
		return
	}
	const channel = db.data.channel.find(
		(c) => c.channelId === message.channelId
	)
	if (channel.locked) {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			res.status(401).send({
				message:
					"Du måste vara autentiserad för att få åtkomst till denna låsta kanal.",
			})
			return
		}
		const token = authHeader.replace("Bearer ", "")
		try {
			const decoded = jwt.verify(token, secret)
			const userId = decoded.userId
			const user = db.data.user.find((u) => u.userId === userId)
			if (!user || !user.channels.includes(channel.name)) {
				res.status(401).send({
					message:
						"Du har inte behörighet att se detta meddelande i den låsta kanalen.",
				})
				return
			}
		} catch (error) {
			res.status(401).send({
				message: "Ogiltig autentiseringstoken.",
			})
			return
		}
	}
	res.send(message)
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
	const channel = db.data.channel.find((c) => c.channelId === channelId)
	if (!channel) {
		console.log("channel id finns inte var god kontrollera")
		res.status(404).send({
			message: "Inkorrekt channel id",
		})
		return
	}
	if (channel.locked) {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			res.status(401).send({
				message:
					"Du måste vara autentiserad för att få åtkomst till denna låsta kanal.",
			})
			return
		}
		const token = authHeader.replace("Bearer ", "")
		try {
			const decoded = jwt.verify(token, secret)
			const userId = decoded.userId
			const user = db.data.user.find((u) => u.userId === userId)
			if (!user || !user.channels.includes(channel.name)) {
				res.status(401).send({
					message: "Du har inte behörighet att se denna låsta kanal.",
				})
				return
			}
		} catch (error) {
			res.status(401).send({ message: "Ogiltig autentiseringstoken." })
			return
		}
	}
	const messages = db.data.messages.filter((m) => m.channelId === channelId)
	res.send({ messages })
})

// //POST /messages
// router.post("/", async (req, res) => {
// 	const maybeMessage = req.body

// 	if (!isValidMessage(maybeMessage)) {
// 		console.log("Body måste innehålla channelId, userId och content")
// 		res.status(400).send({
// 			message: "Body måste innehålla channelId, userId och content",
// 		})
// 		return
// 	}

// 	await db.read()
// 	const messageId = findMaxIdMessage(db.data.messages) + 1
// 	const timestamp = generateTimestamp()

// 	const newMessage = {
// 		messageId: messageId,
// 		channelId: maybeMessage.channelId,
// 		userId: maybeMessage.userId,
// 		content: maybeMessage.content,
// 		timestamp: timestamp,
// 	}

// 	db.data.messages.push(newMessage)
// 	await db.write()

// 	res.send({ message: newMessage })
// })

//POST /messages
router.post("/", async (req, res) => {
	console.log(req.body)
	const channelId = req.body.channelId
	if (!channelId) {
		res.status(400).send({ message: "channelId är obligatoriskt" })
		return
	}
	await db.read()
	const channel = db.data.channel.find((c) => c.channelId === channelId)
	if (channel.locked) {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			res.status(401).send({
				message:
					"Du måste vara autentiserad för att skicka meddelanden till denna låsta kanal.",
			})
			return
		}
		const token = authHeader.replace("Bearer ", "")
		try {
			const decoded = jwt.verify(token, secret)
			const userId = decoded.userId
			const user = db.data.user.find((u) => u.userId === userId)
			if (!user || !user.channels.includes(channel.name)) {
				res.status(401).send({
					message:
						"Du har inte behörighet att skicka meddelanden till denna låsta kanal.",
				})
				return
			}
		} catch (error) {
			res.status(401).send({ message: "Ogiltig autentiseringstoken." })
			return
		}
	}
	const maybeMessage = req.body
	if (!isValidMessage(maybeMessage)) {
		console.log("Body måste innehålla channelId, userId och content")
		res.status(400).send({
			message: "Body måste innehålla channelId, userId och content",
		})
		return
	}
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

// //PUT /messages/:messageId
// router.put("/:messageId", async (req, res) => {
// 	if (!isValidId(req.params.messageId)) {
// 		console.log("inkorrekt id")
// 		res.status(400).send({ message: "Felaktigt id" })
// 		return
// 	}
// 	let messageId = Number(req.params.messageId)
// 	if (!isValidMessage(req.body)) {
// 		console.log("Inkorrekt body")
// 		res.status(400).send({
// 			message: "Felaktig body, får endast innehålla siffror",
// 		})
// 		return
// 	}
// 	let newMessage = req.body
// 	await db.read()
// 	let oldMessageIndex = db.data.messages.findIndex(
// 		(message) => message.messageId === messageId
// 	)
// 	if (oldMessageIndex === -1) {
// 		console.log("Id finns inte var god kontrollera")
// 		res.status(404).send({ message: "Id finns inte" })
// 		return
// 	}
// 	newMessage.messageId = messageId
// 	newMessage.timestamp = generateTimestamp()
// 	db.data.messages[oldMessageIndex] = newMessage
// 	await db.write()
// 	res.sendStatus(200)
// })

//PUT /messages/:messageId
router.put("/:messageId", async (req, res) => {
	const messageId = req.params.messageId
	if (!isValidId(messageId)) {
		console.log("inkorrekt id")
		res.status(400).send({ message: "Felaktigt id" })
		return
	}
	if (!isValidMessage(req.body)) {
		console.log("Inkorrekt body")
		res.status(400).send({
			message: "Felaktig body, får endast innehålla siffror",
		})
		return
	}
	await db.read()
	const message = db.data.messages.find((m) => m.messageId === messageId)
	const channel = db.data.channel.find(
		(c) => c.channelId === message.channelId
	)
	if (channel.locked) {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			res.status(401).send({
				message:
					"Du måste vara autentiserad för att redigera meddelanden i denna låsta kanal.",
			})
			return
		}
		const token = authHeader.replace("Bearer ", "")
		try {
			const decoded = jwt.verify(token, secret)
			const userId = decoded.userId
			const user = db.data.user.find((u) => u.userId === userId)
			if (!user || !user.channels.includes(channel.name)) {
				res.status(401).send({
					message:
						"Du har inte behörighet att redigera meddelanden i denna låsta kanal.",
				})
				return
			}
		} catch (error) {
			res.status(401).send({ message: "Ogiltig autentiseringstoken." })
			return
		}
	}
	let newMessage = req.body
	newMessage.messageId = messageId
	newMessage.timestamp = generateTimestamp()
	db.data.messages[oldMessageIndex] = newMessage
	await db.write()
	res.sendStatus(200)
})

export default router
