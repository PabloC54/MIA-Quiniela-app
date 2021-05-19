import { Col, Row } from 'react-bootstrap'

export default function Footer() {
  return (
    <>
      <div className='push' />
      <Row className='footer'>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} className='credits'>
          ⚛ Pablo Cabrera · USAC
        </Col>
      </Row>
    </>
  )
}
