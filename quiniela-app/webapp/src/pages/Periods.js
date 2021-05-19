import { useState, useContext, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Select from 'react-select'

import { getActualPeriod } from 'services/periodServices'
import { getActiveEvents, newEvent, deleteEvent, updateEvent } from 'services/eventServices'
import NotificationContext from 'context/NotificationContext'
import { getTeams } from 'services/teamServices'
import { pastDate, toDateTime, toOptions } from 'services/util'

import {
  MonthlyBody,
  MonthlyCalendar,
  MonthlyNav,
  DefaultMonthlyEventItem,
  MonthlyDay,
  WeeklyContainer,
  WeeklyCalendar,
  WeeklyDays,
  WeeklyBody,
  DefaultWeeklyEventItem
} from '@zach.codes/react-calendar'
import '@zach.codes/react-calendar/dist/calendar-tailwind.css'
import { addDays, format, startOfMonth } from 'date-fns'
import { getSports } from 'services/sportServices'

export default function Periods() {
  const [mesActual, setMesActual] = useState(startOfMonth(new Date()))
  const [monthly, setMonthly] = useState(true)

  const [listaEventos, setListaEventos] = useState([])
  const [listaDeportes, setListaDeportes] = useState([])
  const [listaEquipos, setListaEquipos] = useState([])

  const [temporadaActual, setTemporadaActual] = useState('')
  const [jornadaActual, setJornadaActual] = useState('')
  const [finalJornada, setFinalJornada] = useState('')
  const [numeroClientes, setNumeroClientes] = useState(0)
  const [deporteEvento, setDeporteEvento] = useState('')

  const [estadoJornada, setEstadoJornada] = useState('')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [selectedEventDate, setSelectedEventDate] = useState('')

  // creacion de eventos
  const [equipoLocal, setEquipoLocal] = useState('')
  const [equipoVisitante, setEquipoVisitante] = useState('')
  const [fechaEvento, setFechaEvento] = useState(toDateTime(addDays(new Date(), 1)))

  // ingreso de resultado
  const [puntajeLocal, setPuntajeLocal] = useState(0)
  const [puntajeVisitante, setPuntajeVisitante] = useState(0)

  // actualizcion de fecha
  const [nuevaFechaEvento, setNuevaFechaEvento] = useState(fechaEvento)

  const handlePuntajeLocal = (ev) => setPuntajeLocal(ev.target.value)
  const handlePuntajeVisitante = (ev) => setPuntajeVisitante(ev.target.value)
  const handleNewDate = (ev) => setNuevaFechaEvento(ev.target.value)

  const { setNotification } = useContext(NotificationContext)

  const handleMonthly = () => setMonthly(true)
  const handleWeekly = () => setMonthly(false)

  const handleLocalTeam = (ev) => setEquipoLocal(ev.value)
  const handleVisitorTeam = (ev) => setEquipoVisitante(ev.value)
  const handleEventTime = (ev) => setFechaEvento(ev.target.value)
  const handleSport = (ev) => setDeporteEvento(ev.value)
  const handleCalendarMonth = (date) => setMesActual(date)

  useEffect(function () {
    getActualPeriod().then((res) => {
      const { temporada, nombre, clientes, estado, fecha_final } = res
      setTemporadaActual(temporada)
      setJornadaActual(nombre)
      setFinalJornada(fecha_final)
      setNumeroClientes(clientes)
      setEstadoJornada(estado)
    })

    getActiveEvents().then((res) => {
      const { eventos } = res
      console.log(res)
      setListaEventos(eventos || [])
    })

    getSports().then((res) => {
      const { deportes } = res
      console.log(res)
      setListaDeportes(deportes || [])
    })

    getTeams().then((res) => {
      const { equipos } = res
      console.log(res)
      setListaEquipos(equipos || [])
    })
  }, [])

  const handleNewEvent = (ev) => {
    ev.preventDefault()
    if (equipoLocal === equipoVisitante)
      return setNotification('Error al crear el evento', 'Los equipos deben ser distintos', 'danger')
    if (!equipoLocal || !equipoVisitante || !deporteEvento || !fechaEvento)
      return setNotification('Error al crear el evento', 'Rellena los datos del evento', 'danger')

    newEvent({ equipo_local: equipoLocal, equipo_visitante: equipoVisitante, deporte: deporteEvento, fecha: fechaEvento }).then(
      (res) => {
        const { created, message } = res

        if (!created) return setNotification('Error al crear el evento', message, 'danger')

        setListaEventos([
          ...listaEventos,
          {
            id: message,
            equipo_local: equipoLocal,
            equipo_visitante: equipoVisitante,
            puntaje_local: 0,
            puntaje_visitante: 0,
            deporte: deporteEvento,
            fecha: fechaEvento,
            estado: 'activo'
          }
        ])

        setEquipoLocal('')
        setEquipoVisitante('')
        setDeporteEvento('')
        setFechaEvento(toDateTime())
        setNotification('Evento creado', 'Se creó el evento exitosamente', 'success')
      }
    )
  }

  const handleUpdateDate = (ev) => {
    ev.preventDefault()
    if (!selectedEventId) return setNotification('Error al actualizar la fecha', 'No se seleccionó ningún evento', 'danger')
    if (!nuevaFechaEvento) return setNotification('Error al actualizar la fecha', 'No se ingresó una nueva fecha', 'danger')

    updateEvent({ fecha: nuevaFechaEvento }, selectedEventId).then((res) => {
      const { updated, message } = res

      if (!updated) return setNotification('Error al actualizar la fecha', message, 'danger')

      setListaEventos(listaEventos.map((e) => (e.id = selectedEventId ? { ...e, fecha: nuevaFechaEvento } : e)))

      setNuevaFechaEvento(0)
      setSelectedEventId('')
      setNotification('Fecha actualizada', 'Se actualizó la fecha del evento exitósamente', 'success')
    })
  }

  const handleSendResult = (ev) => {
    ev.preventDefault()
    if (!selectedEventId) return setNotification('Error al ingresar resultados', 'No se seleccionó ningún evento', 'danger')

    updateEvent({ puntuacion_local: puntajeLocal, puntuacion_visitante: puntajeVisitante }, selectedEventId).then((res) => {
      const { updated, message } = res

      if (!updated) return setNotification('Error al ingresar resultados', message, 'danger')

      setListaEventos(
        listaEventos.map(
          (e) => (e.id = selectedEventId ? { ...e, puntuacion_local: puntajeLocal, puntuacion_visitante: puntajeVisitante } : e)
        )
      )

      setPuntajeLocal(0)
      setPuntajeVisitante(0)
      setSelectedEventId('')
      setNotification('Resultado ingresado', 'Se ingresó el resultado del evento exitósamente', 'success')
    })
  }

  const handleDeleteEvent = (ev, id) => {
    ev.preventDefault()
    if (!selectedEventId) return setNotification('Error al ingresar resultados', 'No se seleccionó ningún evento', 'danger')

    deleteEvent(id).then((res) => {
      const { deleted, message } = res

      if (!deleted) return setNotification('Error al eliminar evento', message, 'danger')

      setListaEventos(listaEventos.filter((e) => e.id !== id))
      setNotification('Evento eliminado', 'Se eliminó el evento con éxito', 'success')
    })
  }

  const handleSelectEvent = (ev) => {
    setSelectedEventId(ev.value)
    listaEventos.forEach((e) => {
      if (e.id === ev.value) setSelectedEventDate(e.fecha)
    })
  }

  return (
    <>
      <div className='block'>
        <h3>Datos de la jornada</h3>
        <p>Temporada actual: {temporadaActual}</p>
        <p>Jornada actual: {jornadaActual}</p>
        <p>Fin de la jornada: {finalJornada}</p>
        <p>Clientes participando: {numeroClientes}</p>
      </div>

      <div className='block'>
        <h3>Creación de eventos</h3>
        <Form>
          <Form.Group>
            <Form.Label>Equipo local</Form.Label>
            <Select
              options={toOptions(listaEquipos.map((d) => ({ id: d.nombre, nombre: d.nombre })))}
              onChange={handleLocalTeam}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Equipo visitante</Form.Label>
            <Select
              options={toOptions(listaEquipos.map((d) => ({ id: d.nombre, nombre: d.nombre })))}
              onChange={handleVisitorTeam}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Deporte</Form.Label>
            <Select options={toOptions(listaDeportes.map((d) => ({ id: d.nombre, nombre: d.nombre })))} onChange={handleSport} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Fecha y hora del evento</Form.Label>
            <Form.Control type='datetime-local' value={fechaEvento} onChange={handleEventTime} />
          </Form.Group>
          <Button type='submit' variant='primary' onClick={handleNewEvent}>
            Crear evento
          </Button>
        </Form>
      </div>

      <div className='block'>
        <h4>Eventos de la jornada</h4>
        <Row>
          <Col xs={4} sm={4} md={4} lg={4} xl={4}>
            <Form.Label>Mensual</Form.Label>
            <Form.Control type='radio' name='ct' value={monthly} onClick={handleMonthly} />
          </Col>
          <Col xs={4} sm={4} md={4} lg={4} xl={4}>
            <Form.Label>Semanal</Form.Label>
            <Form.Control type='radio' name='ct' value={!monthly} onClick={handleWeekly} />
          </Col>
        </Row>
        {monthly ? (
          <MonthlyCalendar currentMonth={mesActual} onCurrentMonthChange={handleCalendarMonth}>
            <MonthlyNav />
            <MonthlyBody
              events={listaEventos.map((e) => ({
                title: `${e.equipo_local} vs ${e.equipo_visitante}${
                  e.estado === 'finalizado' && ` (${e.puntuacion_local}-${e.puntuacion_visitante})`
                }`,
                date: new Date(e.fecha),
                id: e.id
              }))}>
              <MonthlyDay
                renderDay={(data) =>
                  data.map((item, index) => (
                    <DefaultMonthlyEventItem key={index} title={item.title} date={format(item.date, 'k:mm')} />
                  ))
                }
              />
            </MonthlyBody>
          </MonthlyCalendar>
        ) : (
          <WeeklyCalendar week={new Date()}>
            <WeeklyContainer>
              <WeeklyDays />
              <WeeklyBody
                events={listaEventos.map((e) => ({
                  title: `${e.equipo_local} vs ${e.equipo_visitante}`,
                  date: new Date(e.fecha),
                  id: e.id
                }))}
                renderItem={({ item, showingFullWeek }) => (
                  <DefaultWeeklyEventItem
                    key={item.date.toISOString()}
                    title={item.title}
                    date={format(item.date, showingFullWeek ? 'MMM do k:mm' : 'k:mm')}
                    onClick={() => setSelectedEventId(item.id)}
                  />
                )}
              />
            </WeeklyContainer>
          </WeeklyCalendar>
        )}
      </div>

      <h3>Evento</h3>
      <Select
        options={toOptions(
          listaEventos.map((e) => ({
            nombre: `${e.equipo_local} (local) - ${e.equipo_visitante} (visitante)     ${e.fecha}`,
            id: e.id
          }))
        )}
        onChange={handleSelectEvent}
      />

      {selectedEventId &&
        (pastDate(selectedEventDate) ? (
          <div className='block'>
            <h3>Ingresar resultado</h3>
            {estadoJornada === 'finalizado' ? (
              <Form>
                <Form.Group controlId='local'>
                  <Form.Label>Equipo local</Form.Label>
                  <Form.Control type='number' placeholder={equipoLocal} value={puntajeLocal} onChange={handlePuntajeLocal} />
                </Form.Group>
                <Form.Group controlId='visitante'>
                  <Form.Label>Equipo visitante</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder={equipoVisitante}
                    value={puntajeVisitante}
                    onChange={handlePuntajeVisitante}
                  />
                </Form.Group>
                <Button type='submit' variant='primary' onClick={handleSendResult}>
                  Ingresar resultado
                </Button>
              </Form>
            ) : (
              <p>La jornada debe finalizar para ingresar resultados</p>
            )}
          </div>
        ) : (
          <>
            <div className='block'>
              <h3>Modificar fecha de evento</h3>
              <p>Evento seleccionado: {selectedEventId}</p>
              <Form>
                <Form.Group controlId='fecha'>
                  <Form.Label>Nueva fecha del evento</Form.Label>
                  <Form.Control type='datetime-local' value={nuevaFechaEvento} onChange={handleNewDate} />
                </Form.Group>
                <Button type='submit' variant='primary' onClick={handleUpdateDate}>
                  Actualizar fecha
                </Button>
              </Form>
            </div>

            <div className='block'>
              <h3>Eliminar evento</h3>
              <Form>
                <Button type='submit' variant='danger' onClick={handleDeleteEvent}>
                  Eliminar evento
                </Button>
              </Form>
            </div>
          </>
        ))}
    </>
  )
}
