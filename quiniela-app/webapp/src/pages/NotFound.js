import { Row, Col } from 'react-bootstrap'
import { Link } from 'wouter'

export default function Main() {
  return (
    <>
      <Row className='not-found'>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <h1>404</h1>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <span>Página no encontrada...</span>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <Link to='/'>Ir a la página principal</Link>
        </Col>
      </Row>
    </>
  )
}
