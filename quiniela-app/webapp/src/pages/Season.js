import { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'

import { getSeasonPositions } from 'services/seasonServices'

export default function Season() {
  const [positions, setPositions] = useState([])

  useEffect(function () {
    getSeasonPositions().then((res) => {
      const { posiciones } = res
      setPositions(posiciones)
    })
  }, [])

  return (
    <>
      <h3>Posiciones de la temporada actual</h3>
      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>Posición</th>
            <th>Username</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Tier</th>
            <th>Puntaje total</th>
            <th>P10</th>
            <th>P5</th>
            <th>P3</th>
            <th>P0</th>
            <th>Incremento</th>
          </tr>
        </thead>
        <tbody>
          {positions.map(({ username, p10, p5, p3, p0, incremento, total }, i) => (
            <tr>
              <td>{i + 1}</td>
              <td>{username}</td>
              <td>nombre</td>
              <td>apellido</td>
              <td>tier</td>
              <td>{total}</td>
              <td>{p10}</td>
              <td>{p5}</td>
              <td>{p3}</td>
              <td>{p0}</td>
              <td>{incremento}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}
