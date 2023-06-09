function Sidebar() {
	return (
		<aside>
			<button onClick={() => setLoggedIn(false)}>Log Out</button>
			<ul>
				<li>Channel 1</li>
				<li>Channel 2</li>
				<li>Channel 3</li>
			</ul>
		</aside>
	)
}
export default Sidebar
