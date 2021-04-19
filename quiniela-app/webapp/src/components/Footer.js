import { Link } from "wouter";
import "./Navbar.css";

const unlogged_links = [
	{
		path: "/login",
		name: "Iniciar Sesión",
	},
	{
		path: "/register",
		name: "Registrarse",
	},
	{
		path: "new",
		name: "link1",
	},
];

const logged_links = [
	{
		path: "/login",
		name: "Iniciar Sesión",
	},
	{
		path: "/register",
		name: "Registrarse",
	},
	{
		path: "new",
		name: "link1",
	},
];

const Navbar = ({ logged }) => {
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
				<Link to="/">Q_A</Link>
			</div>
			{handleLinks(logged ? logged_links : unlogged_links)}
			<div className="col-md-1 col-sm-4">
				<Link to="user">{logged}</Link>
			</div>
		</div>
	);
};

export default Navbar;
