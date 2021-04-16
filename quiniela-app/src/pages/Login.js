const Login = ({ setUser }) => {
	const handleLogin = () => {
		setUser("admin");
	};

	return (
		<>
			<h1>LOGIN</h1>
			<button onClick={handleLogin}>login</button>
		</>
	);
};

export default Login;
