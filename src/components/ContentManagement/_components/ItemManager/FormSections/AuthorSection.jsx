import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'

const AuthorSection = ({ itemType }) => {
  if (itemType !== 'news') return null

  return (
    <Row>
      <Col md={12}>
        <div className="alert alert-info mb-4">
          <h6 className="alert-heading">📝 Default Author Information</h6>
          <p className="mb-2">
            All news articles are published by default as <strong>&quot;Maraseq Team&quot;</strong> with the company logo.
          </p>
          <p className="mb-0">
            The author information is automatically applied and will appear in the news details page.
          </p>
        </div>
      </Col>

      <Col md={12}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">Current Author Preview</Form.Label>
          <div className="d-flex align-items-center p-3 border rounded bg-light">
            <img 
              src="/logo.svg" 
              alt="Maraseq Team" 
              style={{ 
                width: '50px', 
                height: '50px', 
                objectFit: 'contain',
                marginRight: '15px',
                borderRadius: '4px'
              }} 
            />
            <div>
              <h6 className="mb-1">Maraseq Team</h6>
              <small className="text-muted">Real estate experts providing insights and updates</small>
            </div>
          </div>
        </Form.Group>
      </Col>

      <Col md={12}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold mb-2">
            <span className="text-muted">Note:</span> Author information is managed centrally and cannot be edited for individual articles.
          </Form.Label>
        </Form.Group>
      </Col>
    </Row>
  )
}

export default AuthorSection
