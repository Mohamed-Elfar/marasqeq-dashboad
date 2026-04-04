import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'

const SpecificDetailsSection = ({ formData, itemType, onFormChange }) => {
  if (itemType === 'properties') {
    return (
      <Row>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Price <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.price || ''}
              onChange={(e) => onFormChange('price', e.target.value)}
              placeholder="e.g., $250,000"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Location <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.location || ''}
              onChange={(e) => onFormChange('location', e.target.value)}
              placeholder="e.g., New York, NY"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Bedrooms <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={formData.bedrooms || ''}
              onChange={(e) => onFormChange('bedrooms', e.target.value)}
              placeholder="e.g., 3"
              min="0"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Bathrooms <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={formData.bathrooms || ''}
              onChange={(e) => onFormChange('bathrooms', e.target.value)}
              placeholder="e.g., 2"
              min="0"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Area (sq ft) <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.area || ''}
              onChange={(e) => onFormChange('area', e.target.value)}
              placeholder="e.g., 2,500"
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

  if (itemType === 'services') {
    return (
      <Row>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">Button Text</Form.Label>
            <Form.Control
              type="text"
              value={formData.buttonText || 'Explore Path'}
              onChange={(e) => onFormChange('buttonText', e.target.value)}
              placeholder="Explore Path"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">Status</Form.Label>
            <Form.Select
              value={formData.active ? 'active' : 'inactive'}
              onChange={(e) => onFormChange('active', e.target.value === 'active')}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    )
  }

  if (itemType === 'portfolio') {
    return (
      <Row>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">Portfolio ID</Form.Label>
            <Form.Control
              type="text"
              value={formData.id || ''}
              onChange={(e) => onFormChange('id', e.target.value)}
              placeholder="01, 02, 03..."
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">Status</Form.Label>
            <Form.Select
              value={formData.active ? 'active' : 'inactive'}
              onChange={(e) => onFormChange('active', e.target.value === 'active')}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">Caption Text</Form.Label>
            <Form.Control
              type="text"
              value={formData.captions?.caption || ''}
              onChange={(e) => onFormChange('captions.caption', e.target.value)}
              placeholder="Brief caption for detail images"
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
            <Form.Label className="fw-semibold mb-2">Caption Full Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.captions?.captionFullDescription || ''}
              onChange={(e) => onFormChange('captions.captionFullDescription', e.target.value)}
              placeholder="Detailed description for the caption"
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
            <Form.Label className="fw-semibold mb-2">Caption Short Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData.captions?.captionShortDescription || ''}
              onChange={(e) => onFormChange('captions.captionShortDescription', e.target.value)}
              placeholder="Short description for the caption"
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

  if (itemType === 'news') {
    return (
      <Row>
        <Col md={12}>
          <p className="text-muted">Additional news-specific details can be added here.</p>
        </Col>
      </Row>
    )
  }

  return null
}

export default SpecificDetailsSection
