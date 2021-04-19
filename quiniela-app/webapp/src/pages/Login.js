import { useState, useContext } from 'react'
import { useLocation } from 'wouter'
import { Link } from 'wouter'
import { Button, Form } from 'react-bootstrap'
import NotificationContext from '../context/NotificationContext'
import UserContext from '../context/UserContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setNotification } = useContext(NotificationContext)
  const { setUserLogged } = useContext(UserContext)
  const [location, setLocation] = useLocation()

  const handleUsername = (ev) => setUsername(ev.target.value)
  const handlePassword = (ev) => setPassword(ev.target.value)

  const handleLogin = (ev) => {
    ev.preventDefault()
    // login, validar en db
    setUserLogged(username)
    setNotification('titulo', 'mensaje', 'info')
    setLocation(username === 'admin' ? '/admin' : '/')
  }

  return (
    <>
      <h2>Inicia sesión</h2>
      <Form>
        <Form.Group controlId='username'>
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control type='text' placeholder='Ingrese su nombre de usuario' value={username} onChange={handleUsername} />
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type='password' placeholder='Ingrese su contraseña' value={password} onChange={handlePassword} />
        </Form.Group>
        <Button type='submit' variant='primary' onClick={handleLogin}>
          Iniciar sesión
        </Button>
      </Form>
      <Link to='/recuperacion'>¿Olvidaste tu contraseña?</Link>
    </>
  )
}

export default Login
