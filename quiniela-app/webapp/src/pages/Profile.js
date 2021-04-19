import { useState, useContext } from 'react'
import { useLocation } from 'wouter'
import { Form, Button } from 'react-bootstrap'
import NotificationContext from '../context/NotificationContext'
import UserContext from '../context/UserContext'

const Profile = () => {
  const [editing, setEditing] = useState(false)
  const [edit_password, setEditPassword] = useState(false)
  const { setNotification } = useContext(NotificationContext)
  const { user } = useContext(UserContext)
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

  //TODO: useEfect ~> setUser...

  const handleEdit = () => {
    setEditing(!editing)
    handleEditPassword(false)
  }

  const handleEditPassword = () => {
    setEditPassword(!edit_password)
  }

  const handleUpdate = () => {
    setNotification('Actualización exitosa', '¡Se han actualizado sus datos con éxito!', 'success')
    setLocation('/')
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
        <img alt='Foto del perfil'></img>
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
          <Form.Control
            type='text'
            placeholder='Ingrese su nombre de usuario'
            value={username}
            onChange={handleUsername}
            readOnly={!editing}
          />
        </Form.Group>
        <Form.Group controlId='name'>
          <Form.Label>Nombre</Form.Label>
          <Form.Control type='text' placeholder='Ingrese su nombre' value={name} onChange={handleName} readOnly={!editing} />
        </Form.Group>
        <Form.Group controlId='surname'>
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ingrese su apellido'
            value={surname}
            onChange={handleSurname}
            readOnly={!editing}
          />
        </Form.Group>
        <Form.Group controlId='birthdate'>
          <Form.Label>Fecha de nacimiento</Form.Label>
          <Form.Control
            type='date'
            placeholder='Ingrese su fecha de nacimiento'
            value={birthdate}
            onChange={handleBirthdate}
            readOnly={!editing}
          />
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type='email'
            placeholder='Ingrese su correo electrónico'
            value={email}
            onChange={handleEmail}
            readOnly={!editing}
          />
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type='password'
            placeholder='Ingrese su contraseña'
            value={password}
            onChange={handlePassword}
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
                value={confirm_password}
                onChange={handleConfirmPassword}
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
