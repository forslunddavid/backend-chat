function isValidUser(user) {
	if (typeof user !== "object") {
		return false
	} else if (user === null) {
		return false
	}

	let nameIsValid = typeof user.name === "string"
	nameIsValid = nameIsValid && user.name !== ""

	let passwordIsValid = typeof user.password === "string"
	passwordIsValid = passwordIsValid && user.password !== ""

	if (!nameIsValid || !passwordIsValid) {
		return false
	}
	return true
}

// function isValidChannel(channel) {
// 	if (!channel.name || channel.name.length === 0) return false
// 	if (channel.name.length > 50) return false
// 	if (typeof channel.locked !== "boolean") return false
// 	if (!Array.isArray(channel.messages)) return false
// 	for (let message of channel.messages) {
// 		if (
// 			!message.messageId ||
// 			!message.channelId ||
// 			!message.userId ||
// 			!message.content ||
// 			!message.timestamp
// 		) {
// 			return false
// 		}
// 	}
// 	return true
// }

function isValidChannel(channel) {
	if (!channel.name || typeof channel.name !== "string") return false
	if (channel.name.length > 50) return false
	if (typeof channel.locked !== "boolean") return false

	return true
}

function isValidMessage(message) {
	return (
		typeof message.channelId === "number" &&
		typeof message.userId === "number" &&
		typeof message.content === "string"
	)
}

function isValidId(x) {
	let maybeId = Number(x)
	if (isNaN(maybeId)) {
		return false
	}
	return maybeId >= 0
}

function hasId(object) {
	let idIsValid = typeof object.id === "number"
	idIsValid = idIsValid && object.id >= 0
	return idIsValid
}

function findMaxIdUser(list) {
	let maxId = 0
	for (const item of list) {
		if (item.userId && item.userId > maxId) {
			maxId = item.userId
		}
	}
	return maxId
}

function findMaxIdChannel(list) {
	let maxId = 0
	for (const item of list) {
		if (item.channelId && item.channelId > maxId) {
			maxId = item.channelId
		}
	}
	return maxId
}

function findMaxIdMessage(list) {
	try {
		let maxId = 0
		for (const item of list) {
			if (item.messageId && item.messageId > maxId) {
				maxId = item.messageId
				console.log("New maxId:", maxId)
			}
		}
		console.log("Final maxId:", maxId)
		return maxId
	} catch (err) {
		console.log(err)
		return false
	}
}

export {
	isValidId,
	findMaxIdUser,
	findMaxIdChannel,
	findMaxIdMessage,
	hasId,
	isValidUser,
	isValidChannel,
	isValidMessage,
}
