import { useContext } from 'react'
import { Link, useLocation } from 'wouter'
import { Navbar, Nav, Button } from 'react-bootstrap'
import UserContext from '../context/UserContext'

const admin_links = [
  {
    path: '/admin/carga',
    name: 'Carga masiva'
  },
  {
    path: '/admin/jornadas',
    name: 'Jornadas'
  },
  {
    path: '/admin/temporadas',
    name: 'Temporadas'
  },
  {
    path: '/admin/deportes',
    name: 'Deportes'
  },
  {
    path: '/admin/recompensas',
    name: 'Recompensas'
  },
  {
    path: '/admin/reportes',
    name: 'Reportes'
  },
  {
    path: '/chat',
    name: 'Chat'
  }
]

const unlogged_links = [
  {
    path: '/ranking',
    name: 'Tabla de posiciones'
  }
]

const logged_links = [
  {
    path: '/membresia',
    name: 'Membresía'
  },
  {
    path: '/predicciones',
    name: 'Predicciones'
  },
  {
    path: '/resultados',
    name: 'Resultados'
  },
  {
    path: '/ranking',
    name: 'Tabla de posiciones'
  },
  {
    path: '/recompensas',
    name: 'Recompensas'
  },
  {
    path: '/chat',
    name: 'Chat'
  }
]

const Header = () => {
  const { logged, user, setUserLogged } = useContext(UserContext)
  const [location, setLocation] = useLocation()

  const handleLinks = (array) =>
    array.map((link) => {
      return (
        <Link to={link.path} key={link.name}>
          <Nav.Link>{link.name}</Nav.Link>
        </Link>
      )
    })

  const handleLogout = () => {
    setUserLogged('')
    setLocation('/')
  }

  return (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Navbar.Brand as={Link} to={user === 'admin' ? '/admin' : '/'}>
        Quiniela <sup>APP</sup>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='mr-auto'>
          {handleLinks(logged ? (user === 'admin' ? admin_links : logged_links) : unlogged_links)}
          {logged ? (
            <>
              <Link to='/perfil'>
                <Nav.Link>{user}</Nav.Link>
              </Link>
              <Button variant='danger' onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link to='/login'>
                <Nav.Link>Iniciar sesión</Nav.Link>
              </Link>
              <Link to='/registro'>
                <Nav.Link>Registro</Nav.Link>
              </Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
