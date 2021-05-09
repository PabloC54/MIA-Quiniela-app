import { useState, useContext, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import NotificationContext from 'context/NotificationContext'
import UserContext from 'context/UserContext'

import { getUser, updateUser } from 'services/userServices'

var urlCreator = window.URL || window.webkitURL

const Profile = () => {
  const [editing, setEditing] = useState(false)
  const [edit_password, setEditPassword] = useState(false)
  const { setNotification } = useContext(NotificationContext)
  const { user } = useContext(UserContext)
  const [correo, setCorreo] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [fecha_nacimiento, setFechaNacimiento] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [confirmar_contraseña, setConfirmarContraseña] = useState('')
  const [foto, setFoto] = useState('')

  const handleNombre = (ev) => setNombre(ev.target.value)
  const handleApellido = (ev) => setApellido(ev.target.value)
  const handleContraseña = (ev) => setContraseña(ev.target.value)
  const handleConfirmarContraseña = (ev) => setConfirmarContraseña(ev.target.value)
  const handleFoto = (ev) => setFoto(urlCreator.createObjectURL(ev.target.value))

  useEffect(function () {
    getUser(user).then((res) => {
      const { correo, nombre, apellido, fecha_nacimiento, foto } = res
      setCorreo(correo)
      setNombre(nombre)
      setApellido(apellido)
      setFechaNacimiento(fecha_nacimiento)
      setFoto(urlCreator.createObjectURL(foto))
    })
  }, [])

  const handleEdit = () => {
    setEditing(!editing)
    handleEditPassword(false)
  }

  const handleEditPassword = () => setEditPassword(!edit_password)

  const handleUpdate = () => {
    updateUser({ user, nombre, apellido, contraseña: edit_password ? contraseña : '', foto }).then((res) => {
      const { message, updated } = res

      if (!edit_password && contraseña === confirmar_contraseña) {
        setContraseña('')
        setConfirmarContraseña('')
        return setNotification('Error al actualizar', 'Las contraseñas no coinciden', 'danger')
      }

      if (!updated) {
        setContraseña('')
        setConfirmarContraseña('')
        return setNotification('Error al actualizar', message, 'danger')
      }

      setNotification('Actualización exitosa', '¡Se han actualizado sus datos con éxito!', 'success')
    })
  }

  return (
    <>
      <h2>Perfil personal</h2>
      {user !== 'admin' ? (
        <Button variant={editing ? 'secondary' : 'warning'} onClick={handleEdit}>
          {editing ? 'Cancelar' : 'Editar'}
        </Button>
      ) : (
        <></>
      )}
      <Form>
        <img src={foto} alt='Foto del perfil'></img>
        {editing ? (
          <Form.Group controlId='photo'>
            <Form.Label>Foto de perfil</Form.Label>
            <Form.Control type='file' placeholder='Suba una foto para su perfil (Opcional)' value={''} onChange={() => {}} />
          </Form.Group>
        ) : (
          <></>
        )}
        <Form.Group controlId='username'>
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control type='text' placeholder='Ingrese su nombre de usuario' value={user} readOnly />
        </Form.Group>
        <Form.Group controlId='name'>
          <Form.Label>Nombre</Form.Label>
          <Form.Control type='text' placeholder='Ingrese su nombre' value={nombre} onChange={handleNombre} readOnly={!editing} />
        </Form.Group>
        <Form.Group controlId='surname'>
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ingrese su apellido'
            value={apellido}
            onChange={handleApellido}
            readOnly={!editing}
          />
        </Form.Group>
        <Form.Group controlId='birthdate'>
          <Form.Label>Fecha de nacimiento</Form.Label>
          <Form.Control type='date' placeholder='Ingrese su fecha de nacimiento' value={fecha_nacimiento} readOnly />
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type='email' placeholder='Ingrese su correo electrónico' value={correo} readOnly />
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type='password'
            placeholder='Ingrese su contraseña'
            value={contraseña}
            onChange={handleContraseña}
            readOnly={!editing || edit_password}
          />
        </Form.Group>
        {editing ? (
          <>
            <Form.Check
              type='checkbox'
              label='Cambiar su contraseña'
              value={edit_password}
              onChange={handleEditPassword}
              readOnly={!editing}
            />
            <Form.Group>
              <Form.Label>Confirme su contraseña</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirme su contraseña'
                value={confirmar_contraseña}
                onChange={handleConfirmarContraseña}
              />
            </Form.Group>
            <Button type='submit' variant='primary' onClick={handleUpdate}>
              Registrarse
            </Button>
          </>
        ) : (
          <></>
        )}
      </Form>
    </>
  )
}

export default Profile
