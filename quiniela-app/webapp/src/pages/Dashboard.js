import { useState, useEffect } from 'react'
import { Link } from 'wouter'

//import Prediction from 'components/Prediction'
import { getUserPredictions } from 'services/eventServices'

export default function Dashboard() {
  const [predictionsList, setPredictionsList] = useState([])

  useEffect(function () {
    getUserPredictions().then((res) => {
      const { predictionsList } = res
      setPredictionsList(predictionsList)
    })
  }, [])

  return (
    <>
      <h1>Página principal</h1>
      <p>
        <Link to='/predicciones'>Realiza predicciones</Link> sobre los eventos deportivos del momento y gana dinero acertando en
        tus predicciones
      </p>
      <p>Tus predicciones: </p>
      {predictionsList.map(
        ({ equipoLocal, equipoVisitante, puntosLocal, puntosVisitante, resultadoLocal, resultadoVisitante }) => (
          //<Prediction />
          <p>Prediccion</p>
        )
      )}
    </>
  )
}
