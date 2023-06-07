import { getDb } from "../data/database.js"
import express from "express"

const router = express.Router()
const db = getDb()

//when testin in insomnia
router.get("/", async (req, res) => {
	await db.read()
	res.send(db.data.channel)
})

export default router
