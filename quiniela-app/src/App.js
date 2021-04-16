import "./App.css";
import { useState } from "react";
import { Route, Router, useRouter, useLocation } from "wouter";
import Navbar from "./components/Navbar";
import Main from "./pages/Main";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordRecovery from "./pages/PasswordRecovery";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import Predictions from "./pages/Predictions";
import Results from "./pages/Results";
import Ranking from "./pages/Ranking";
import Prizes from "./pages/Prizes";
import Admin from "./pages/Admin";
import Charge from "./pages/Charge";
import Periods from "./pages/Periods";
import Seasons from "./pages/Seasons";
import Sports from "./pages/Sports";
import Reports from "./pages/Reports";
import Chat from "./pages/Chat";

function App() {
	const [user, setUser] = useState("");
	return (
		<>
			<Navbar user={user}></Navbar>
			{!user ? (
				<>
					{/* Unlogged */}
					<Route path="/" component={Main} />
					<Route path="/registro">
						<Register />
					</Route>
					<Route path="/login">
						<Login setUser={setUser} />
					</Route>
					<Route path="/recuperacion">
						<PasswordRecovery />
					</Route>
				</>
			) : (
				<>
					{/* Logged */}
					<Route path="/perfil">
						<Profile />
					</Route>
					<Route path="/chat">
						<Chat />
					</Route>
					{user !== "admin" ? (
						<>
							<Route path="/" component={Dashboard} />
							<Route path="/membresia">
								<Payment />
							</Route>
							<Route path="/predicciones">
								<Predictions />
							</Route>
							<Route path="/resultados">
								<Results />
							</Route>
							<Route path="/ranking">
								<Ranking />
							</Route>
							<Route path="/recompensas">
								<Prizes />
							</Route>
						</>
					) : (
						<>
							{/* Admin */}
							<NestedRoutes base="/admin">
								<Route path="/">
									<Admin />
								</Route>
								<Route path="/carga">
									<Charge />
								</Route>
								<Route path="/jornadas">
									<Periods />
								</Route>
								<Route path="/temporadas">
									<Seasons />
								</Route>
								<Route path="/deportes">
									<Sports />
								</Route>
								<Route path="/recompensas">
									<Prizes />
								</Route>
								<Route path="/reportes">
									<Reports />
								</Route>
							</NestedRoutes>
						</>
					)}
				</>
			)}
		</>
	);
}

const NestedRoutes = (props) => {
	const router = useRouter();
	const [parentLocation] = useLocation();
	const nestedBase = `${router.base}${props.base}`;

	if (!parentLocation.startsWith(nestedBase)) return null;

	return (
		<Router base={nestedBase} key={nestedBase}>
			{props.children}
		</Router>
	);
};

export default App;
