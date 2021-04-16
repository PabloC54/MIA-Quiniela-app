import { Link } from "wouter";
import "./Navbar.css";

const admin_links = [
	{
		path: "/admin/carga",
		name: "Carga masiva",
	},
	{
		path: "/admin/jornadas",
		name: "Jornadas",
	},
	{
		path: "/admin/temporadas",
		name: "Temporadas",
	},
	{
		path: "/admin/deportes",
		name: "Deportes",
	},
	{
		path: "/admin/recompensas",
		name: "Recompensas",
	},
	{
		path: "/admin/reportes",
		name: "Reportes",
	},
	{
		path: "/chat",
		name: "Chat",
	},
];

const unlogged_links = [
	{
		path: "/ranking",
		name: "Tabla de posiciones",
	},
];

const logged_links = [
	{
		path: "/membresia",
		name: "Membresía",
	},
	{
		path: "/predicciones",
		name: "Predicciones",
	},
	{
		path: "/resultados",
		name: "Resultados",
	},
	{
		path: "/ranking",
		name: "Tabla de posiciones",
	},
	{
		path: "/recompensas",
		name: "Recompensas",
	},
	{
		path: "/chat",
		name: "Chat",
	},
];

const Navbar = ({ user }) => {
	const handleLinks = (array) => {
		return array.map((link) => {
			return (
				<div className="col-md-1 col-sm-4">
					<Link to={link.path}>{link.name}</Link>
				</div>
			);
		});
	};

	return (
		<div className="row navbar">
			<div className="col-md-1 col-sm-4">
				<Link to={`/${user === "admin" ? "admin" : ""}`}>QUINIELA</Link>
			</div>
			{handleLinks(
				user ? (user === "admin" ? admin_links : logged_links) : unlogged_links
			)}
			{user ? (
				<div className="col-md-1 col-sm-4">
					<Link to="/perfil">{user}</Link>
				</div>
			) : (
				<>
					<div className="col-md-1 col-sm-4">
						<Link to="/login">Iniciar sesión</Link>
					</div>
					<div className="col-md-1 col-sm-4">
						<Link to="/registro">Registrarse</Link>
					</div>
				</>
			)}
		</div>
	);
};

export default Navbar;
