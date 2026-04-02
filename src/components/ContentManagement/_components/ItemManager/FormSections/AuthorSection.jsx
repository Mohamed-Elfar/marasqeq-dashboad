import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import ImageUploader from '../../../ImageUploader'

const AuthorSection = ({ formData, itemType, onFormChange }) => {
  if (itemType !== 'news') return null

  return (
    <Row>
      <Col md={12}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">
            Author Name <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={formData.author?.name || ''}
            onChange={(e) => onFormChange('author.name', e.target.value)}
            placeholder="Enter author name"
            style={{
              borderRadius: '8px',
              border: '2px solid #e9ecef',
              padding: '0.75rem 1rem',
            }}
          />
        </Form.Group>
      </Col>

      <Col md={12}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">Author Image</Form.Label>
          <ImageUploader currentImage={formData.author?.img} onUpload={(url) => onFormChange('author.img', url)} />
        </Form.Group>
      </Col>

      <Col md={12}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold mb-2">Author Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.author?.description || ''}
            onChange={(e) => onFormChange('author.description', e.target.value)}
            placeholder="Brief author biography..."
            style={{
              borderRadius: '8px',
              border: '2px solid #e9ecef',
              padding: '0.75rem 1rem',
            }}
          />
        </Form.Group>
      </Col>
    </Row>
  )
}

export default AuthorSection
