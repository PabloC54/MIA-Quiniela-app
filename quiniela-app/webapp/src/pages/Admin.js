import { useState, useEffect } from 'react'
import { getAdminInfo } from 'services/adminServices'

export default function Admin() {
  const [temporadaActual, setTemporadaActual] = useState('')
  const [finalTemporada, setFinalTemporada] = useState('')
  const [jornadaActual, setJornadaActual] = useState('')
  const [finalJornada, setFinalJornada] = useState('')
  const [capitalTemporada, setCapitalTemporada] = useState(0)

  const [noMemberships, setNoMemberships] = useState(0)
  const [bronzeMemberships, setBronzeMemberships] = useState(0)
  const [silverMemberships, setSilverMemberships] = useState(0)
  const [goldMemberships, setGoldMemberships] = useState(0)

  useEffect(function () {
    getAdminInfo().then((res) => {
      const { temporada, final_temporada, jornada, final_jornada, capital, sin_membresia, bronze, silver, gold } = res
      setTemporadaActual(temporada)
      setFinalTemporada(final_temporada)
      setJornadaActual(jornada)
      setFinalJornada(final_jornada)
      setCapitalTemporada(capital)

      setNoMemberships(sin_membresia)
      setBronzeMemberships(bronze)
      setSilverMemberships(silver)
      setGoldMemberships(gold)
    })
  }, [])

  return (
    <>
      <div className='block'>
        <h3>Panel del administrador</h3>
        <p>Temporada actual: {temporadaActual}</p>
        <p>Final de la temporada: {finalTemporada}</p>
        <p>Jornada actual: {jornadaActual}</p>
        <p>Final de la jornada: {finalJornada}</p>
      </div>

      <div className='block'>
        <h4>Capital total de la temporada: {capitalTemporada}</h4>
        <p>Sin membresía: {noMemberships}</p>
        <p>Membresías de bronce: {bronzeMemberships}</p>
        <p>Membresías de plata: {silverMemberships}</p>
        <p>Membresías de oro: {goldMemberships}</p>
      </div>
    </>
  )
}
