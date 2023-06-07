function isValidUser(u) {
	if (typeof u !== "object") {
		return false
	} else if (u === null) {
		return false
	}

	let nameIsValid = typeof u.name === "string"
	nameIsValid = nameIsValid && u.name !== ""

	let passwordIsValid = typeof u.password === "string"
	passwordIsValid = passwordIsValid && u.password !== ""

	if (!nameIsValid || !passwordIsValid) {
		return false
	}
	return true
}

function isValidMessage(p) {}

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

export { isValidId, findMaxIdUser, hasId, isValidUser }
