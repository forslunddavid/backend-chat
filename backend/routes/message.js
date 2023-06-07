import { getDb } from "../data/database.js"
import express from "express"

const router = express.Router()
const db = getDb()

// when testing in insomna
router.get("/", async (req, res) => {
	await db.read()
	res.send(db.data.channel.messages)
})

export default router
