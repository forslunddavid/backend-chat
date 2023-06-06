import { createBrowserRouter } from "react-router-dom"
import Root from "../src/components/Root.jsx"
import Template1 from "./components/Template1.jsx"
import Template2 from "./components/Template2.jsx"

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "template1",
				element: <Template1 />,
			},
			{
				path: "template2",
				element: <Template2 />,
			},
		],
	},
])
