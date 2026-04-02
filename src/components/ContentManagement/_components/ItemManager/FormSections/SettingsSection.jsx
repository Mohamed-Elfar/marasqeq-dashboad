import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'

const SettingsSection = ({ formData, itemType, onFormChange }) => {
  return (
    <Row>
      {itemType === 'social' ? (
        <Col md={12}>
          <div className="d-flex gap-4">
            <Form.Group className="mb-0">
              <Form.Check
                type="switch"
                id="active-switch"
                label={
                  <span className="fw-semibold">
                    <i className="bi bi-eye-fill text-success me-2"></i>
                    Active
                  </span>
                }
                checked={formData.active !== false}
                onChange={(e) => onFormChange('active', e.target.checked)}
                className="fs-6"
              />
            </Form.Group>
          </div>
        </Col>
      ) : itemType === 'faq' ? (
        <Col md={12}>
          <div className="d-flex gap-4">
            <Form.Group className="mb-0">
              <Form.Check
                type="switch"
                id="active-switch"
                label={
                  <span className="fw-semibold">
                    <i className="bi bi-eye-fill text-success me-2"></i>
                    Active
                  </span>
                }
                checked={formData.active !== false}
                onChange={(e) => onFormChange('active', e.target.checked)}
                className="fs-6"
              />
            </Form.Group>
          </div>
        </Col>
      ) : itemType === 'services' ? (
        <Col md={12}>
          <div className="d-flex gap-4">
            <Form.Group className="mb-0">
              <Form.Check
                type="switch"
                id="featured-switch"
                label={
                  <span className="fw-semibold">
                    <i className="bi bi-star-fill text-warning me-2"></i>
                    Mark as Featured
                  </span>
                }
                checked={formData.featured || false}
                onChange={(e) => onFormChange('featured', e.target.checked)}
                className="fs-6"
              />
            </Form.Group>

            <Form.Group className="mb-0">
              <Form.Check
                type="switch"
                id="core-feature-switch"
                label={
                  <span className="fw-semibold">
                    <i className="bi bi-gem text-primary me-2"></i>
                    Core Feature
                  </span>
                }
                checked={formData.coreFeature || false}
                onChange={(e) => onFormChange('coreFeature', e.target.checked)}
                className="fs-6"
              />
            </Form.Group>
          </div>
        </Col>
      ) : itemType === 'portfolio' ? (
        <Col md={12}>
          <div className="d-flex gap-4">
            <Form.Group className="mb-0">
              <Form.Check
                type="switch"
                id="featured-switch"
                label={
                  <span className="fw-semibold">
                    <i className="bi bi-star-fill text-warning me-2"></i>
                    Mark as Featured
                  </span>
                }
                checked={formData.featured || false}
                onChange={(e) => onFormChange('featured', e.target.checked)}
                className="fs-6"
              />
            </Form.Group>

            <Form.Group className="mb-0">
              <Form.Check
                type="switch"
                id="carousel-switch"
                label={
                  <span className="fw-semibold">
                    <i className="bi bi-images text-info me-2"></i>
                    Show in Carousel
                  </span>
                }
                checked={formData.carousel || false}
                onChange={(e) => onFormChange('carousel', e.target.checked)}
                className="fs-6"
              />
            </Form.Group>
          </div>
        </Col>
      ) : (
        <>
          <Col md={12}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">Status</Form.Label>
              <Form.Select
                value={formData.status || 'published'}
                onChange={(e) => onFormChange('status', e.target.value)}
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  padding: '0.75rem 1rem',
                }}>
                <option value="published">✓ Published</option>
                <option value="draft">📝 Draft</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={12}>
            <div className="d-flex gap-4">
              <Form.Group className="mb-0">
                <Form.Check
                  type="switch"
                  id="featured-switch"
                  label={
                    <span className="fw-semibold">
                      <i className="bi bi-star-fill text-warning me-2"></i>
                      Mark as Featured
                    </span>
                  }
                  checked={formData.featured || false}
                  onChange={(e) => onFormChange('featured', e.target.checked)}
                  className="fs-6"
                />
              </Form.Group>

              {itemType === 'news' && (
                <Form.Group className="mb-0">
                  <Form.Check
                    type="switch"
                    id="visible-switch"
                    label={
                      <span className="fw-semibold">
                        <i className="bi bi-eye-fill text-primary me-2"></i>
                        Visible on Website
                      </span>
                    }
                    checked={formData.visible !== false}
                    onChange={(e) => onFormChange('visible', e.target.checked)}
                    className="fs-6"
                  />
                </Form.Group>
              )}
            </div>
          </Col>
        </>
      )}
    </Row>
  )
}

export default SettingsSection
