import { useState, useContext, useEffect } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import Select from 'react-select'

import { getActualPeriod } from 'services/periodServices'
import { getActiveEvents } from 'services/eventServices'
import { getPrediction, sendPrediction } from 'services/predictionServices'
import { pastDate, toOptions } from 'services/util'
import NotificationContext from 'context/NotificationContext'
import UserContext from 'context/UserContext'

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
import { format, startOfMonth } from 'date-fns'
import { getMembership } from 'services/paymentServices'

export default function Predictions() {
  const [mesActual, setMesActual] = useState(startOfMonth(new Date()))
  const [monthly, setMonthly] = useState(true)

  const [listaEventos, setListaEventos] = useState([])

  const [jornadaActual, setJornadaActual] = useState('')
  const [finalJornada, setFinalJornada] = useState('')

  const [selectedEventId, setSelectedEventId] = useState('')
  const [selectedEventDate, setSelectedEventDate] = useState('')
  const [selectedEventLocal, setSelectedEventLocal] = useState('')
  const [selectedEventVisitor, setSelectedEventVisitor] = useState('')
  const [selectedEventLocalPrediction, setSelectedEventLocalPrediction] = useState('')
  const [selectedEventVisitorPrediction, setSelectedEventVisitorPrediction] = useState('')
  const [predictionSent, setPredictionSent] = useState(false)

  const [puntajeLocal, setPuntajeLocal] = useState(0)
  const [puntajeVisitante, setPuntajeVisitante] = useState(0)

  const [membresia, setMembresia] = useState('')

  const { setNotification } = useContext(NotificationContext)
  const { user } = useContext(UserContext)

  const handlePuntajeLocal = (ev) => setPuntajeLocal(ev.target.value)
  const handlePuntajeVisitante = (ev) => setPuntajeVisitante(ev.target.value)

  const handleMonthly = () => setMonthly(true)
  const handleWeekly = () => setMonthly(false)

  const handleCalendarMonth = (date) => setMesActual(date)

  useEffect(function () {
    getActualPeriod().then((res) => {
      const { nombre, fecha_final } = res
      setJornadaActual(nombre)
      setFinalJornada(fecha_final)
    })

    getActiveEvents().then((res) => {
      const { eventos } = res
      setListaEventos(eventos)
    })

    getMembership(user).then((res) => {
      const { membresia } = res
      console.log(membresia)
      setMembresia(membresia)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSendPrediction = (ev) => {
    ev.preventDefault()
    if (!selectedEventId) return setNotification('Error al ingresar predicción', 'No se seleccionó ningún evento', 'danger')

    sendPrediction({
      username: user,
      id_evento: selectedEventId,
      puntuacion_local: puntajeLocal,
      puntuacion_visitante: puntajeVisitante
    }).then((res) => {
      const { sent, message } = res

      if (!sent) return setNotification('Error al ingresar predicción', message, 'danger')

      setListaEventos(
        listaEventos.map(
          (e) => (e.id = selectedEventId ? { ...e, puntuacion_local: puntajeLocal, puntuacion_visitante: puntajeVisitante } : e)
        )
      )

      setPuntajeLocal(0)
      setPuntajeVisitante(0)
      setSelectedEventId('')
      setNotification('Predicción ingresado', 'Se envió la predicción del evento exitósamente', 'success')
    })
  }

  const handleSelectEvent = (ev) => {
    setSelectedEventId(ev.value)
    listaEventos.forEach((e) => {
      if (e.id === ev.value) {
        setSelectedEventDate(e.fecha)
        setSelectedEventLocal(e.equipo_local)
        setSelectedEventVisitor(e.equipo_visitante)
      }
    })

    getPrediction({ username: user, id_evento: ev.value }).then((res) => {
      const { sent, puntuacion_local, puntuacion_visitante } = res
      console.log(res)
      setPredictionSent(sent)
      if (!sent) return
      setSelectedEventLocalPrediction(puntuacion_local)
      setSelectedEventVisitorPrediction(puntuacion_visitante)
    })
  }

  return (
    <>
      <div className='block'>
        <p>Jornada actual: {jornadaActual}</p>
        <p>Fin de la jornada: {finalJornada}</p>
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

      {selectedEventId && membresia === 'Sin membresía ' ? (
        <p>No cuentas con membresía para ingresar predicciones</p>
      ) : !pastDate(selectedEventDate) ? (
        <div className='block'>
          <h3>Ingresar prediccion</h3>
          {!predictionSent ? (
            <Form>
              <Form.Group controlId='local'>
                <Form.Label>Equipo local</Form.Label>
                <Form.Control type='number' placeholder={selectedEventLocal} value={puntajeLocal} onChange={handlePuntajeLocal} />
              </Form.Group>
              <Form.Group controlId='visitante'>
                <Form.Label>Equipo visitante</Form.Label>
                <Form.Control
                  type='number'
                  placeholder={selectedEventVisitor}
                  value={puntajeVisitante}
                  onChange={handlePuntajeVisitante}
                />
              </Form.Group>
              <Button type='submit' variant='primary' onClick={handleSendPrediction}>
                Ingresar predicción
              </Button>
            </Form>
          ) : (
            <p>
              Ya ingresaste tu predicción{' '}
              {`(${selectedEventLocalPrediction} (local) - ${selectedEventVisitorPrediction} (visitante))`}
            </p>
          )}
        </div>
      ) : (
        <p>El evento ya terminó</p>
      )}
    </>
  )
}
