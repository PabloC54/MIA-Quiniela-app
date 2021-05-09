import { useState, useContext } from 'react'
import { useLocation } from 'wouter'
import { Form, Button } from 'react-bootstrap'

import NotificationContext from 'context/NotificationContext'

import { recoverUser } from 'services/userServices'

export default function PasswordRecovery() {
  const [correo, setCorreo] = useState('')
  const [, setLocation] = useLocation()
  const { setNotification } = useContext(NotificationContext)

  const handleEmail = (ev) => setCorreo(ev.target.value)

  const handleRecovery = (ev) => {
    ev.preventDefault()

    if (!correo)
      return setNotification('Error en la recuperación', 'Ingrese el correo electrónico con el que se registró', 'danger')

    recoverUser({ correo }).then((res) => {
      const { recovered, message } = res

      if (!recovered) return setNotification('Error en la recuperación', message, 'danger')

      setNotification('Recuperacion', `Tu contraseña es: ${message}`, 'info')
      setLocation('/')
    })
  }

  return (
    <>
      <h2>Recupera tu contraseña perdida</h2>
      <Form>
        <Form.Group controlId='correo'>
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type='correo' placeholder='Ingrese su correo electrónico' value={correo} onChange={handleEmail} />
        </Form.Group>
      </Form>
      <Button type='submit' variant='primary' onClick={handleRecovery}>
        Mandar recuperación
      </Button>
    </>
  )
}
