import { useState } from 'react'
import { Col, Row, Form, Button } from 'react-bootstrap'

const small = 12,
  medium = 6,
  large = 4

export default function Sport({ name, clr, img, handleDelete, handleUpdate }) {
  const [updating, setUpdating] = useState(false)
  const [nombre, setNombre] = useState(name)
  const [color, setColor] = useState(clr)
  const [imagen, setImagen] = useState(img)

  const handleNombre = (ev) => setNombre(ev.target.value)
  const handleColor = (ev) => setColor(ev.target.value)
  const handleImagen = (ev) => setImagen(ev.target.value)

  const handleChangeUpdating = () => setUpdating(!updating)

  return (
    <Row>
      <Col className={`sport s-${nombre}`} xs={small} sm={small} md={medium} lg={large} xl={large}>
        <Row>
          <Col className='body' xs={12} sm={12} md={12} lg={12} xl={12}>
            Nombre: {name}
          </Col>
          <Col className='body' xs={12} sm={12} md={12} lg={12} xl={12}>
            Color: {clr}
          </Col>
          <Col className='body' xs={12} sm={12} md={12} lg={12} xl={12}>
            Imagen: {img}
          </Col>
        </Row>
      </Col>
      {updating ? (
        <div className='prediction'>
          <p>Nuevos datos:</p>

          <Form>
            <Form.Group controlId='nombre'>
              <Form.Control type='text' placeholder='Nuevo nombre' value={nombre} onChange={handleNombre} />
            </Form.Group>
            <Form.Group controlId='color'>
              <Form.Control type='color' placeholder='Nuevo color' value={color} onChange={handleColor} />
            </Form.Group>
            <Form.Group controlId='imagen'>
              <Form.Control type='text' placeholder='Nueva imagen' value={imagen} onChange={handleImagen} />
            </Form.Group>
            <Button type='submit' variant='primary' onClick={handleUpdate}>
              Enviar predicción
            </Button>
          </Form>
        </div>
      ) : (
        <>
          <Button variant='info' onClick={handleChangeUpdating}>
            Editar
          </Button>
          <Button variant='info' onClick={handleDelete}>
            Eliminar
          </Button>
        </>
      )}
    </Row>
  )
}
