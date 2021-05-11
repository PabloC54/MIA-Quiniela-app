import { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'

import { getSeasonPositions } from 'services/seasonServices'

export default function Season() {
  const [positions, setPositions] = useState([])

  useEffect(function () {
    getSeasonPositions().then((res) => {
      const { positions } = res
      setPositions(positions)
    })
  }, [])

  return (
    <>
      <h3>Posiciones de la temporada actual</h3>
      <Table striped bordered hover size='sm'>
        <thead>
          <th>Posición</th>
          <th>Jugador</th>
          <th>P10</th>
          <th>P5</th>
          <th>P3</th>
          <th>P0</th>
          <th>Total</th>
        </thead>
        <tbody>
          {positions.map((p) => (
            <element list={p}></element>
          ))}
        </tbody>
      </Table>
    </>
  )
}

const element = (list = []) => {
  return (
    <ty>
      {list.map((el) => (
        <td>el</td>
      ))}
    </ty>
  )
}
