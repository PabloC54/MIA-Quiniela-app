import { useState, useContext, useRef } from 'react'
import { useLocation } from 'wouter'
import { Button, Form } from 'react-bootstrap'
import NotificationContext from 'context/NotificationContext'

import { registerUser } from 'services/userServices'

const Register = () => {
  const { setNotification } = useContext(NotificationContext)
  const [username, setUsername] = useState('')
  const [correo, setCorreo] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [fecha_nacimiento, setFechaNacimiento] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [confirmar_contraseña, setConfirmarContraseña] = useState('')
  const [foto, setFoto] = useState('')
  const [, setLocation] = useLocation()

  const inputFile = useRef(null)

  const handleUsername = (ev) => setUsername(ev.target.value)
  const handleName = (ev) => setNombre(ev.target.value)
  const handleSurname = (ev) => setApellido(ev.target.value)
  const handleBirthdate = (ev) => setFechaNacimiento(ev.target.value)
  const handleEmail = (ev) => setCorreo(ev.target.value)
  const handlePassword = (ev) => setContraseña(ev.target.value)
  const handleConfirmPassword = (ev) => setConfirmarContraseña(ev.target.value)

  const handleRegister = (ev) => {
    ev.preventDefault()

    if (!username || !correo || !nombre || !apellido || !fecha_nacimiento || !contraseña)
      return setNotification('Error en el registro', 'Rellena todo el formulario', 'danger')

    if (contraseña !== confirmar_contraseña) {
      setContraseña('')
      setConfirmarContraseña('')
      return setNotification('Error en el registro', 'Las contraseñas no coinciden', 'danger')
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/.test(contraseña)) {
      setContraseña('')
      setConfirmarContraseña('')
      return setNotification('Error en el registro', 'La contraseña debe tener 8 caracterees, una letra minúscula, una mayúscula y un número', 'danger')
    }

    registerUser({
      username,
      correo,
      nombre,
      apellido,
      fecha_nacimiento: fecha_nacimiento.replaceAll('-', '/'),
      contraseña,
      foto
    }).then((res) => {
      const { registered, message } = res

      if (!registered) {
        setContraseña('')
        setConfirmarContraseña('')
        return setNotification('Error en el registro', message, 'danger')
      }

      setNotification('Registro exitoso', '¡Te has registrado exitosamente!\nAhora inicia sesión con tu cuenta', 'success')
      setLocation('/')
    })
  }

  let fileReader
  const handleLoadPhoto = (file) => {
    if (file === undefined) return
    fileReader = new FileReader()
    fileReader.name = file.name
    fileReader.onloadend = () => {
      const { result } = fileReader
      setFoto(result)
    }
    fileReader.readAsText(file)
  }

  return (
    <>
      <h2>¡Regístrate en Quiniela APP!</h2>
      <Form>
        <Form.Group controlId='username'>
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ingrese su nombre de usuario'
            value={username}
            onChange={handleUsername}
            required
          />
        </Form.Group>
        <Form.Group controlId='name'>
          <Form.Label>Nombre</Form.Label>
          <Form.Control type='text' placeholder='Ingrese su nombre' value={nombre} onChange={handleName} required />
        </Form.Group>
        <Form.Group controlId='surname'>
          <Form.Label>Apellido</Form.Label>
          <Form.Control type='text' placeholder='Ingrese su apellido' value={apellido} onChange={handleSurname} required />
        </Form.Group>
        <Form.Group controlId='birthdate'>
          <Form.Label>Fecha de nacimiento</Form.Label>
          <Form.Control
            type='date'
            placeholder='Ingrese su fecha de nacimiento'
            value={fecha_nacimiento}
            onChange={handleBirthdate}
            required
            pattern='[0-9]{2}/[0-9]{2}/[0-9]{4}'
          />
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type='email' placeholder='Ingrese su correo electrónico' value={correo} onChange={handleEmail} required />
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type='password'
            placeholder='Ingrese su contraseña'
            value={contraseña}
            onChange={handlePassword}
            required
          />
        </Form.Group>
        <Form.Group controlId='confirm_password'>
          <Form.Label>Confirme su contraseña</Form.Label>
          <Form.Control
            type='password'
            placeholder='Ingrese su contraseña nuevamente'
            value={confirmar_contraseña}
            onChange={handleConfirmPassword}
            required
          />
        </Form.Group>
        <Form.Group controlId='photo'>
          <Form.Label>Foto de perfil (Opcional)</Form.Label>
          <Form.Control
            type='file'
            accept='image/*'
            ref={inputFile}
            onChange={(e) => handleLoadPhoto(e.target.files[0])}
            onClick={(e) => {
              e.target.value = null
            }}
          />
        </Form.Group>
        <Button type='submit' variant='primary' onClick={handleRegister}>
          Registrarse
        </Button>
      </Form>
    </>
  )
}

export default Register
