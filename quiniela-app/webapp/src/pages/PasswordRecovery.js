import { useState, useContext } from 'react'
import { useLocation } from 'wouter'
import { Form, Button } from 'react-bootstrap'

import NotificationContext from '../context/NotificationContext'

const PasswordRecovery = () => {
  const [email, setEmail] = useState('')
  const [location, setLocation] = useLocation()
  const { setNotification } = useContext(NotificationContext)

  const handleEmail = (ev) => setEmail(ev.target.value)

  const handleRecovery = (ev) => {
    ev.preventDefault()
    setNotification('Recuperacion', 'Si el correo está registrado encontrarás la contraseña en tu buzón del correo', 'info')
    setLocation('/')
  }

  return (
    <>
      <h2>Recupera tu contraseña perdida</h2>
      <Form>
        <Form.Group controlId='email'>
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type='email' placeholder='Ingrese su correo electrónico' value={email} onChange={handleEmail} />
        </Form.Group>
      </Form>
      <Button type='submit' variant='primary' onClick={handleRecovery}>
        Mandar recuperación
      </Button>
    </>
  )
}

export default PasswordRecovery
