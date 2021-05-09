import { useState, useContext, useEffect } from 'react'
import Event from 'components/Event'
import NotificationContext from 'context/NotificationContext'
import UserContext from 'context/UserContext'

import { getMembership } from 'services/paymentServices'
import { getActiveEvents } from 'services/eventServices'

const Predictions = () => {
  const [suscribed, setSuscribed] = useState(false)
  const [eventList, setEventList] = useState([])
  const [jornadaActiva, setJornadaActiva] = useState('')
  const [temporadaActiva, setTemporadaActiva] = useState('')

  const { setNotification } = useContext(NotificationContext)
  const { user } = useContext(UserContext)

  useEffect(function () {
    getMembership(user).then((res) => {
      const { suscribed } = res

      if (!suscribed)
        return setNotification(
          'No cuentas con membresía',
          'Se necesita una membresía activa para realizar predicciones',
          'danger'
        )

      setSuscribed(true)
    })

    getActiveEvents().then((res) => {
      const { jornadaActiva, temporadaActiva, eventList } = res
      setJornadaActiva(jornadaActiva)
      setTemporadaActiva(temporadaActiva)
      setEventList(eventList)
    })
  }, [])

  return (
    <>
      <h3>Realiza predicciones sobre los eventos actuales</h3>
      <p>Jornada: {jornadaActiva}</p>
      <p>Temporada: {temporadaActiva}</p>
      {eventList.map(({ id, user, equipoLocal, equipoVisitante, deporte }) => (
        <Event
          key={id}
          id={id}
          user={user}
          equipoLocal={equipoLocal}
          equipoVisitante={equipoVisitante}
          deporte={deporte}
          suscribed={suscribed}></Event>
      ))}
    </>
  )
}

export default Predictions
