import { Col, Row, Form, Button } from 'react-bootstrap'
import { useState, useContext, useEffect } from 'react'
import NotificationContext from 'context/NotificationContext'
import { Link } from 'wouter'

import { getPrediction, sendPrediction } from 'services/eventServices'

const small = 12,
  medium = 6,
  large = 4

export default function Event({ id, user, equipo_local, equipo_visitante, deporte, predictionSent = true, suscribed }) {
  const [enabled, setEnabled] = useState(false)
  const [sent, setSent] = useState(predictionSent)
  const [puntosLocal, setPuntosLocal] = useState(0)
  const [puntosVisitante, setPuntosVisitante] = useState(0)
  const { setNotification } = useContext(NotificationContext)

  useEffect(function () {
    getPrediction(id, user).then((res) => {
      const { sent, local, visitante } = res

      setSent(sent)
      if (sent) {
        setPuntosLocal(local)
        setPuntosVisitante(visitante)
      }
    })
  }, [])

  const handlePredict = () => setEnabled(!enabled)

  const handleSendPrediction = (ev) => {
    ev.preventDefault()

    sendPrediction({ id, puntosLocal, puntosVisitante }).then((res) => {
      const { sent, message } = res

      if (!sent) return setNotification('No se pudo realizar la prediccion', message, 'danger')

      setSent(true)
    })
  }

  return (
    <>
      <Col className={`event m-${deporte}`} xs={small} sm={small} md={medium} lg={large} xl={large}>
        <Row>
          <Col className='body' xs={12} sm={12} md={12} lg={12} xl={12}>
            <h4 className='e-name'>{`${equipo_local}${(<sub>local</sub>)} VS. ${equipo_visitante}${(<sub>visitante</sub>)}`}</h4>
            <p className='e-sport'>{deporte}</p>
          </Col>
        </Row>
      </Col>
      {suscribed ? (
        <div className='prediction'>
          {enabled ? (
            <Form>
              <p>Predice este evento</p>
              <Form.Group controlId='puntosLocal'>
                <Form.Label>Puntos de {equipo_local}</Form.Label>
                <Form.Control type='number' placeholder='0' value={puntosLocal} onChange={setPuntosLocal} />
              </Form.Group>
              <Form.Group controlId='puntosLocal'>
                <Form.Label>Puntos de {equipo_local}</Form.Label>
                <Form.Control type='number' placeholder='0' value={puntosVisitante} onChange={setPuntosVisitante} />
              </Form.Group>
              <Button type='submit' variant='primary' onClick={handleSendPrediction}>
                Enviar predicción
              </Button>
            </Form>
          ) : sent ? (
            <h3>
              Predicción realizada: {equipo_local} {puntosLocal} - {puntosVisitante} {equipo_visitante}
            </h3>
          ) : (
            <Button onClick={handlePredict}>Click aquí para realizar una predicción de este evento</Button>
          )}
        </div>
      ) : (
        <>
          <h3>No se pueden realizar predicciones</h3>
          <p>
            Adquiere una <Link to='/membresia'>membresía</Link>
          </p>
        </>
      )}
    </>
  )
}
