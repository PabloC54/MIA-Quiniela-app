import Sport from 'components/Sport'
import { useState, useEffect, useContext } from 'react'
import { Form, Button } from 'react-bootstrap'
import confirmAlert from 'react-confirm-alert'

import NotificationContext from 'context/NotificationContext'
import { getSports, newSport, deleteSport, updateSport } from 'services/sportServices'
import { copyObject } from 'services/util'

export default function Sports() {
  const [sportsList, setSportsList] = useState([])
  const [newSportName, setNewSportName] = useState('')
  const [newSportColor, setNewSportColor] = useState('')
  const [newSportImg, setNewSportImg] = useState('')

  const { setNotification } = useContext(NotificationContext)

  const handleNewSportName = (ev) => setNewSportName(ev.target.value)
  const handleNewSportColor = (ev) => setNewSportColor(ev.target.value)
  const handleNewSportImg = (ev) => setNewSportImg(ev.target.value)

  useEffect(function () {
    getSports().then((res) => {
      const { deportes } = res
      console.log(res)
      setSportsList(deportes)
    })
  }, [])

  const handleNewSport = () => {
    newSport({ nombre: newSportName, color: newSportImg, imagen: newSportImg }).then((res) => {
      const { inserted, message } = res

      if (!inserted) return setNotification('No se pudo crear el deporte', message, 'danger')

      setSportsList([...sportsList, { nombre: newSportName, color: newSportImg, imagen: newSportImg }])
      setNotification('Deporte creado exitosamente', 'Se creó el deporte en la base de datos', 'success')
    })
  }

  const handleDeleteSport = (id) => {
    confirmAlert({
      title: 'Eliminar deporte',
      message: 'Esta acción no se puede deshacer. ¿Continuar?',
      overlayClassName: 'custom-prompt',
      buttons: [
        {
          label: 'Sí',
          onClick: () => {
            deleteSport(id).then((res) => {
              const { deleted, message } = res

              if (!deleted) return setNotification('No se pudo eliminar el deporte', message, 'danger')

              let tmp_list = copyObject(sportsList)
              for (let d of tmp_list) if (d.nombre === id) tmp_list.splice(tmp_list.indexOf(d), 1)
              setSportsList(tmp_list)

              setNotification('Deporte eliminado exitosamente', 'Se eliminó el deporte en la base de datos', 'success')
            })
          }
        },
        {
          label: 'No'
        }
      ]
    })
  }

  const handleUpdateSport = ({ id, nombre, color, imagen }) => {
    updateSport(id, { nombre, color, imagen }).then((res) => {
      const { updated, message } = res

      if (!updated) return setNotification('No se pudo actualizar el deporte', message, 'danger')

      let tmp_list = copyObject(sportsList)
      for (let d of tmp_list) if (d.nombre === nombre) tmp_list[tmp_list.indexOf(d)] = { nombre, color, imagen }
      setSportsList(tmp_list)

      setNotification('Deporte actualizado exitosamente', 'Se actualizó el deporte en la base de datos', 'success')
    })
  }

  return (
    <>
      <h3>Panel de deportes</h3>
      <p>Crea, modifica o elimina deportes de la plataforma</p>
      <Form>
        <p>Inserta un nuevo deporte:</p>
        <Form.Group controlId='name'>
          <Form.Label>Nombre del deporte</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ingrese el nombre del deporte'
            value={newSportName}
            onChange={handleNewSportName}
          />
        </Form.Group>
        <Form.Group controlId='color'>
          <Form.Label>Color del deporte</Form.Label>
          <Form.Control type='color' value={newSportColor} onChange={handleNewSportColor} />
        </Form.Group>
        <Form.Group controlId='img'>
          <Form.Label>Color del deporte</Form.Label>
          <Form.Control type='file' value={newSportImg} onChange={handleNewSportImg} />
        </Form.Group>
        <Button type='submit' variant='primary' onClick={handleNewSport}>
          Iniciar sesión
        </Button>
      </Form>
      <p>Deportes en la plataforma:</p>
      {sportsList.map(({ id, nombre, color, imagen }) => (
        <Sport
          name={nombre}
          clr={color}
          img={imagen}
          handleUpdate={() => {
            handleUpdateSport(id, { nombre, color, imagen })
          }}
          handleDelete={() => handleDeleteSport(id)}></Sport>
      ))}
    </>
  )
}
