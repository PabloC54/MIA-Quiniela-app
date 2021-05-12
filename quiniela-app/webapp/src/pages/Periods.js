import { useState, useContext, useEffect } from 'react'
import { Form, Button, Row } from 'react-bootstrap'

import { getActualPeriod } from 'services/periodServices'
import { getActiveEvents, newEvent } from 'services/eventServices'
import NotificationContext from 'context/NotificationContext'
import Event from 'components/EventAdmin'

export default function Periods() {
  const [temporada, setTemporada] = useState('')
  const [jornada, setJornada] = useState('')
  const [fecha_final, setFechaFinal] = useState('')
  const [lista_eventos, setListaEventos] = useState([])
  const [clientes, setClientes] = useState(0)
  const [deporte, setDeporte] = useState('')

  const [estado, setEstado] = useState('')

  const [equipo_local, setEquipoLocal] = useState('')
  const [equipo_visitante, setEquipoVisitante] = useState('')
  const [fecha, setFecha] = useState('')

  const { setNotification } = useContext(NotificationContext)

  const handleLocalTeam = (ev) => setEquipoLocal(ev.target.value)
  const handleVisitorTeam = (ev) => setEquipoVisitante(ev.target.value)
  const handleEventTime = (ev) => setFecha(ev.target.value)
  const handleSport = (ev) => setDeporte(ev.target.value)

  useEffect(function () {
    getActualPeriod().then((res) => {
      const { temporada, nombre, clientes, estado, fecha_final } = res
      setTemporada(temporada)
      setJornada(nombre)
      setFechaFinal(fecha_final)
      setClientes(clientes)
      setEstado(estado)
    })

    getActiveEvents().then((res) => {
      const { eventos } = res
      setListaEventos(eventos)
    })
  }, [])

  const handleNewEvent = (ev) => {
    ev.preventDefault()
    newEvent({ equipo_local, equipo_visitante, deporte, fecha }).then((res) => {
      const { created, message } = res

      if (!created) return setNotification('Error al crear el evento', message, 'danger')

      setListaEventos([
        ...lista_eventos,
        { id: message, equipo_local, equipo_visitante, puntaje_local: 0, puntaje_visitante: 0, deporte, fecha, estado: 'activo' }
      ])
      setNotification('Evento creado', 'Se creó el evento exitosamente', 'success')
    })
  }

  return (
    <>
      <h3>Datos de la jornada</h3>
      <p>Temporada actual: {temporada}</p>
      <p>Jornada actual: {jornada}</p>
      <p>Fin de la jornada: {fecha_final}</p>
      <p>Clientes participando: {clientes}</p>
      <h4>Eventos de la jornada</h4>
      {estado !== 'finalizado' && <p>Nota: la jornada debe finalizar para ingresar resultados</p>}
      {lista_eventos.length ? (
        <Row>
          {lista_eventos.map((e) => (
            <Event key={e.id} event={e} period_ended={estado === 'finalizado'} />
          ))}
        </Row>
      ) : (
        <p>No hay eventos</p>
      )}
      <h4>Creación de eventos</h4>
      <Form>
        <Form.Group>
          <Form.Control type='text' placeholder='Equipo local' value={equipo_local} onChange={handleLocalTeam} />
        </Form.Group>
        <Form.Group>
          <Form.Control type='text' placeholder='Equipo visitante' value={equipo_visitante} onChange={handleVisitorTeam} />
        </Form.Group>
        <Form.Group>
          <Form.Control type='text' placeholder='Deporte' value={deporte} onChange={handleSport} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Fecha y hora del evento</Form.Label>
          <Form.Control type='datetime-local' value={fecha} onChange={handleEventTime} />
        </Form.Group>
        <Button type='submit' variant='primary' onClick={handleNewEvent}>
          Crear evento
        </Button>
      </Form>
    </>
  )
}
