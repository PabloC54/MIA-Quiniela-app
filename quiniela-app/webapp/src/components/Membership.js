import { Col, Row, Button } from 'react-bootstrap'

export default function Membership({ name, desc, price = 'GRATIS', type = 'bronze', active = false, onClick } = {}) {
  const small = 12,
    large = 8

  return (
    <Col className={`membership m-${type}`} xs={small} sm={small} md={small} lg={large} xl={large}>
      <Row>
        <Col className='body' xs={9} sm={9} md={9} lg={9} xl={9}>
          <h4 className='m-name'>{name}</h4>
          <p className='m-description'>{desc}</p>
        </Col>
        <Col className='pricing' xs={3} sm={3} md={3} lg={3} xl={3}>
          <p className='m-price'>{price}</p>
          <Button onClick={onClick} disabled={active}>
            {active ? 'Contratado' : 'Contratar'}
          </Button>
        </Col>
      </Row>
    </Col>
  )
}
