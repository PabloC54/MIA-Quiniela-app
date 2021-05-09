import { useState, useEffect } from 'react'
import { getActiveInfo } from 'services/adminServices'

export default function Admin() {
  const [jornadaActual, setJornadaActual] = useState('')
  const [temporadaActual, setTemporadaActual] = useState('')
  const [capitalTemporada, setCapitalTemporada] = useState(0)
  const [bronzeMemberships, setBronzeMemberships] = useState(0)
  const [silverMemberships, setSilverMemberships] = useState(0)
  const [goldMemberships, setGoldMemberships] = useState(0)

  useEffect(function () {
    getActiveInfo().then((res) => {
      const { jornadaActual, temporadaActual, capitalTemporada, bronzeMemberships, silverMemberships, goldMemberships } = res
      setJornadaActual(jornadaActual)
      setTemporadaActual(temporadaActual)
      setCapitalTemporada(capitalTemporada)
      setBronzeMemberships(bronzeMemberships)
      setSilverMemberships(silverMemberships)
      setGoldMemberships(goldMemberships)
    })
  }, [])

  return (
    <>
      <h3>Panel del administrador</h3>
      <p>Jornada actual: {jornadaActual}</p>
      <p>Temporada actual: {temporadaActual}</p>
      <br />
      <h4>Capital total de la temporada: {capitalTemporada}</h4>
      <p>Membresías de bronce: {bronzeMemberships}</p>
      <p>Membresías de plata: {silverMemberships}</p>
      <p>Membresías de oro: {goldMemberships}</p>
    </>
  )
}
