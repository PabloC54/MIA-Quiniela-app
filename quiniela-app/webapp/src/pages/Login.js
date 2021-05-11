import { useState, useContext } from 'react'
import { useLocation } from 'wouter'
import { Link } from 'wouter'
import { Button, Form } from 'react-bootstrap'
import NotificationContext from 'context/NotificationContext'
import UserContext from 'context/UserContext'

import { loginUser } from 'services/userServices'

export default function Login() {
  const [username, setUsername] = useState('')
  const [contraseña, setContraseña] = useState('')
  const { setNotification } = useContext(NotificationContext)
  const { doLogin } = useContext(UserContext)
  const [, setLocation] = useLocation()

  const handleUsername = (ev) => setUsername(ev.target.value)
  const handlePassword = (ev) => setContraseña(ev.target.value)

  const handleLogin = (ev) => {
    ev.preventDefault()

    if (!username || !contraseña) return setNotification('Error en el login', 'Rellena todo el formulario', 'danger')

    loginUser({ username, contraseña }).then((res) => {
      const { logged, message } = res

      if (!logged) {
        setContraseña('')
        return setNotification('Error en el login', message, 'danger')
      }

      doLogin(username)
      setNotification('Bienvenido', '', 'success')
      setLocation(username === 'admin' ? '/admin' : '/')
    })
  }

  return (
    <>
      <h2>Inicia sesión</h2>
      <Form>
        <Form.Group controlId='username'>
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control type='text' placeholder='Ingrese su nombre de usuario' value={username} onChange={handleUsername} />
        </Form.Group>
        <Form.Group controlId='contraseña'>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type='password' placeholder='Ingrese su contraseña' value={contraseña} onChange={handlePassword} />
        </Form.Group>
        <Button type='submit' variant='primary' onClick={handleLogin}>
          Iniciar sesión
        </Button>
      </Form>
      <Link to='/recuperacion'>¿Olvidaste tu contraseña?</Link>
    </>
  )
}
