import Membership from 'components/Membership'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useState, useContext, useEffect } from 'react'
import NotificationContext from 'context/NotificationContext'
import UserContext from 'context/UserContext'

import { getMembership, setMembership } from 'services/paymentServices'

const memberships = [
  {
    name: 'Suscripción bronze',
    desc: 'Obtienes pocas recompensas en las predicciones',
    price: 'Q150',
    type: 'bronze'
  },
  {
    name: 'Suscripción silver',
    desc: 'Obtienes medias recompensas en las predicciones',
    price: 'Q450',
    type: 'silver'
  },
  {
    name: 'Suscripción gold',
    desc: 'Obtienes muchas recompensas en las predicciones',
    price: 'Q900',
    type: 'gold'
  }
]

export default function Payment() {
  const [active_membership, setActiveMembership] = useState('Ninguna')
  const { setNotification } = useContext(NotificationContext)
  const { user } = useContext(UserContext)

  useEffect(function () {
    getMembership(user).then((res) => {
      const { membresia } = res
      setActiveMembership(membresia)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleContractMembership = (type) => {
    setMembership(user, type).then((res) => {
      const { changed, message } = res

      if (!changed) {
        return setNotification(`Error al contratar la membresía`, 'No se pudo contratar la membresía\n' + message, 'error')
      }

      setActiveMembership(`Suscripción ${type} (pendiente)`)
      setNotification(
        `Suscripción ${active_membership === 'Ninguna' ? 'comprada' : 'actualizada'}`,
        'Suscripción adquirida con éxito\nLos cambios se verán reflejados en la próxima temporada',
        'success'
      )
    })
  }

  const handleCancelMembership = () => {
    confirmAlert({
      title: 'Cancelar membresía',
      message: 'Puedes volver a contratar en cualquier momento. ¿Continuar?',
      overlayClassName: 'custom-prompt',
      buttons: [
        {
          label: 'Sí',
          onClick: () => {
            setMembership(user, 'null').then((res) => {
              const { changed, message } = res

              if (!changed) return setNotification('Error al cancelar', message, 'danger')

              setActiveMembership('Ninguna')
              setNotification(
                'Suscripción cancelada',
                'Suscripción cancelada con éxito\nLos cambios se verán reflejados en la próxima temporada',
                'info'
              )
            })
          }
        },
        {
          label: 'No'
        }
      ]
    })
  }

  return (
    <>
      <h3>
        Pago de membresía de Quiniela <sup>APP</sup>
      </h3>
      <p>
        Para participar en los eventos debes tener una suscripción activa. La membresía se renueva automáticamente cada temporada,
        procura cancelarla si no deseas la renovación.
      </p>
      <p>
        Suscripción activa: {active_membership}
        {active_membership !== 'Ninguna' && <button onClick={handleCancelMembership}>Cancelar membresía</button>}
      </p>
      <p>Opciones disponibles:</p>
      <div className='row'>
        {memberships.map(({ name, desc, price, type }) => (
          <Membership
            name={name}
            desc={desc}
            price={price}
            type={type}
            active={name === active_membership}
            onClick={() => {
              handleContractMembership(type)
            }}
          />
        ))}
      </div>
    </>
  )
}
