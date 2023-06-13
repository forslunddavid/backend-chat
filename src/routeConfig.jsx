import { createBrowserRouter } from "react-router-dom"
import Root from "../src/components/Root.jsx"
import Chat from "./components/Chat.jsx"
import Login from "./components/Login.jsx"

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "",
				element: <Login />,
			},
			{
				path: "template2",
				element: <Chat />,
			},
		],
	},
])
