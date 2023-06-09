import { useState } from "react"
import "../App.css"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { Outlet } from "react-router-dom"

const Root = () => {
	const [loggedIn, setLoggedIn] = useState(false)

	return (
		<>
			<Header />
			<div className="sidebar">
				<Sidebar />
			</div>
			<div>
				<Outlet />
			</div>
		</>
	)
}

export default Root
