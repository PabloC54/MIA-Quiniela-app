import { useState, useContext } from 'react'
import { useLocation } from 'wouter'
import { Button, Form } from 'react-bootstrap'
import NotificationContext from '../context/NotificationContext'

const Register = () => {
  const { setNotification } = useContext(NotificationContext)
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm_password, setConfirmPassword] = useState('')
  const [location, setLocation] = useLocation()

  const handleUsername = (ev) => setUsername(ev.target.value)
  const handleName = (ev) => setName(ev.target.value)
  const handleSurname = (ev) => setSurname(ev.target.value)
  const handleBirthdate = (ev) => setBirthdate(ev.target.value)
  const handleEmail = (ev) => setEmail(ev.target.value)
  const handlePassword = (ev) => setPassword(ev.target.value)
  const handleConfirmPassword = (ev) => setConfirmPassword(ev.target.value)

  const handleRegister = (ev) => {
    ev.preventDefault()
    // registro, ingresar db
    setNotification('Registro exitoso', '¡Te has registrado exitosamente!\nAhora inicia sesión con tu cuenta', 'success')
    setLocation('/')
  }

  return (
    <>
      <h2>¡Registrate en Quiniela APP!</h2>
      <Form>
        <Form.Group controlId='username'>
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control type='text' placeholder='Ingrese su nombre de usuario' value={username} onChange={handleUsername} />
        </Form.Group>
        <Form.Group controlId='name'>
          <Form.Label>Nombre</Form.Label>
          <Form.Control type='text' placeholder='Ingrese su nombre' value={name} onChange={handleName} />
        </Form.Group>
        <Form.Group controlId='surname'>
          <Form.Label>Apellido</Form.Label>
          <Form.Control type='text' placeholder='Ingrese su apellido' value={surname} onChange={handleSurname} />
        </Form.Group>
        <Form.Group controlId='birthdate'>
          <Form.Label>Fecha de nacimiento</Form.Label>
          <Form.Control type='date' placeholder='Ingrese su fecha de nacimiento' value={birthdate} onChange={handleBirthdate} />
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type='email' placeholder='Ingrese su correo electrónico' value={email} onChange={handleEmail} />
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type='password' placeholder='Ingrese su contraseña' value={password} onChange={handlePassword} />
          <Form.Label>Confirme su contraseña</Form.Label>
          <Form.Control
            type='password'
            placeholder='Ingrese su contraseña nuevamente'
            value={confirm_password}
            onChange={handleConfirmPassword}
          />
        </Form.Group>
        <Form.Group controlId='photo'>
          <Form.Label>Foto de perfil</Form.Label>
          <Form.Control type='file' placeholder='Suba una foto para su perfil (Opcional)' value={''} onChange={() => {}} />
        </Form.Group>
        <Button type='submit' variant='primary' onClick={handleRegister}>
          Registrarse
        </Button>
      </Form>
    </>
  )
}

export default Register
