import { useState, useContext, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'

import { getActualPeriod } from 'services/seasonServices'
import { newEvent } from 'services/eventServices'
import NotificationContext from 'context/NotificationContext'

export default function Season() {
  const [season, setSeason] = useState('')
  const [clients, setClients] = useState(0)
  const [periodState, setPeriodState] = useState('')

  const [localTeam, setLocalTeam] = useState('')
  const [visitorTeam, setVisitorTeam] = useState('')
  const [eventTime, setEventTime] = useState('')

  const { setNotification } = useContext(NotificationContext)

  const handleLocalTeam = (ev) => setLocalTeam(ev.target.value)
  const handleVisitorTeam = (ev) => setVisitorTeam(ev.target.value)
  const handleEventTime = (ev) => setEventTime(ev.target.value)

  useEffect(function () {
    getActualPeriod().then((res) => {
      const { season, clients, periodState } = res
      setSeason(season)
      setClients(clients)
      setPeriodState(periodState)
    })
  }, [])

  const handleNewEvent = () => {
    newEvent({ equipo_local: localTeam, equipo_visitante: visitorTeam, fecha: eventTime }).then((res) => {
      const { created, message } = res

      if (!created) setNotification('Error al crear el evento', message, 'danger')

      setNotification('Evento creado', 'Se creó el evento exitosamente', 'success')
    })
  }

  return (
    <>
      <h3>Datos de la temporada</h3>
      <p>Temporada actual: {season}</p>
      <p>Clientes participando: {clients}</p>
      <p>eventos</p>
      <p>edicion de fecha de la jornada</p>
      <h4>Creación de eventos</h4>
      <Form>
        <Form.Group>
          <Form.Control type='text' placeholder='Equipo local' value={localTeam} onChange={handleLocalTeam} />
        </Form.Group>
        <Form.Group>
          <Form.Control type='text' placeholder='Equipo visitante' value={visitorTeam} onChange={handleVisitorTeam} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Fecha y hora del evento</Form.Label>
          <Form.Control type='datetime' value={eventTime} onChange={handleEventTime} />
        </Form.Group>
        <Button type='submit' variant='primary' onClick={handleNewEvent}>
          Crear evento
        </Button>
      </Form>
      <h4>Asignación de resultados</h4>
      {periodState === 'finalizado' ? <></> : <p>Espera a que la jornada finalice para ingresar resultados de los eventos</p>}
    </>
  )
}
