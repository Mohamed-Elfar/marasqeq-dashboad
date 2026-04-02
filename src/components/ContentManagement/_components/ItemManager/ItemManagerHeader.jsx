import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'

const ItemManagerHeader = ({ title, itemLabel, onAddNew }) => {
  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h3>{title}</h3>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={onAddNew}>
            Add New {itemLabel}
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default ItemManagerHeader
