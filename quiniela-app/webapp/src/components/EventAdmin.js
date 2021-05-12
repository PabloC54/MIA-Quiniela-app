import { Col, Row, Form, Button } from 'react-bootstrap'
import { useState, useContext } from 'react'
import NotificationContext from 'context/NotificationContext'
import { updateEvent } from 'services/eventServices'
import { pastDate, toDateTime } from 'services/util'

const small = 12,
  medium = 6,
  large = 4

export default function Event({ event, period_ended }) {
  const { id, equipo_local, equipo_visitante, puntuacion_local, puntuacion_visitante, deporte, estado, fecha } = event
  const [puntajeLocal, setPuntajeLocal] = useState(puntuacion_local)
  const [puntajeVisitante, setPuntajeVisitante] = useState(puntuacion_visitante)
  const [estadoEvento, setEstadoEvento] = useState(estado)
  const [fechaEvento, setFechaEvento] = useState(fecha)

  const handlePuntajeLocal = (ev) => setPuntajeLocal(ev.target.value)
  const handlePuntajeVisitante = (ev) => setPuntajeVisitante(ev.target.value)
  const handleNewDate = (ev) => setFechaEvento(ev.target.value)

  const { setNotification } = useContext(NotificationContext)

  const handleSendResult = () => {
    updateEvent({ puntaje_local: puntuacion_local, puntaje_visitante: puntuacion_visitante }, id).then((res) => {
      const { updated, message } = res

      if (!updated) return setNotification('Error al ingresar resultado', message, 'danger')

      setPuntajeLocal(puntuacion_local)
      setPuntajeVisitante(puntuacion_visitante)
      setEstadoEvento('finalizado')

      setNotification('Resultado ingresado', 'Se ingresó el resultado del evento exitósamente', 'success')
    })
  }

  const handleUpdateDate = () => {
    updateEvent({ fecha }, id).then((res) => {
      const { updated, message } = res

      if (!updated) return setNotification('Error al actualizar la fecha', message, 'danger')

      setNotification('Fecha actualizada', 'Se ingresó el resultado del evento exitósamente', 'success')
    })
  }

  return (
    <Col class='event' xs={small} sm={small} md={medium} lg={large} xl={large}>
      <h4 className='e-name'>{`${equipo_local} (local) VS. ${equipo_visitante} (visitante)`}</h4>
      <p className='e-sport'>Deporte: {deporte}</p>
      <p className='e-sport'>Fecha del evento: {toDateTime(fechaEvento)}</p>
      <h6>Estado: {estado}</h6>
      {period_ended ? (
        <Col className={`event m-${deporte}`}>
          {estadoEvento === 'finalizado' || estadoEvento === 'actualizado' ? (
            <>
              <p>
                Resultado: {equipo_local} {puntajeLocal} - {puntajeVisitante} {equipo_visitante}
              </p>
            </>
          ) : (
            <>
              <p>Ingresar resultado</p>
              <Form>
                <Form.Group controlId='local'>
                  <Form.Control type='number' placeholder={equipo_local} value={puntajeLocal} onChange={handlePuntajeLocal} />
                </Form.Group>
                <Form.Group controlId='visitante'>
                  <Form.Control
                    type='number'
                    placeholder={equipo_visitante}
                    value={puntajeVisitante}
                    onChange={handlePuntajeVisitante}
                  />
                </Form.Group>
                <Button type='submit' variant='primary' onClick={handleSendResult}>
                  Ingresar resultado
                </Button>
              </Form>
            </>
          )}
        </Col>
      ) : (
        !pastDate(fecha) && (
          <>
            <h5>Actualizar fecha del evento</h5>
            <Form>
              <Form.Group controlId='fecha'>
                <Form.Control type='datetime-local' value={fechaEvento} onChange={handleNewDate} />
              </Form.Group>
              <Button type='submit' variant='primary' onClick={handleUpdateDate}>
                Actualizar fecha
              </Button>
            </Form>
          </>
        )
      )}
    </Col>
  )
}
