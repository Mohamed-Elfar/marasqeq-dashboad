import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'

const CategorySection = ({ formData, itemType, categories, onFormChange }) => {
  return (
    <Row>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold mb-2">
            {itemType === 'social' ? 'Position' : 'Category'} <span className="text-danger">*</span>
          </Form.Label>
          {itemType === 'social' ? (
            <Form.Select
              value={formData.position || 'both'}
              onChange={(e) => onFormChange('position', e.target.value)}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}>
              <option value="both">Header & Footer</option>
              <option value="header">Header Only</option>
              <option value="footer">Footer Only</option>
            </Form.Select>
          ) : itemType === 'faq' ? (
            <Form.Select
              value={formData.category || 'general'}
              onChange={(e) => onFormChange('category', e.target.value)}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}>
              <option value="general">General</option>
              <option value="properties">Properties</option>
              <option value="investment">Investment</option>
              <option value="consultation">Consultation</option>
              <option value="legal">Legal</option>
              <option value="payment">Payment</option>
            </Form.Select>
          ) : (
            <Form.Select
              value={Array.isArray(formData.category) ? formData.category[0] : formData.category || ''}
              onChange={(e) => onFormChange('category', itemType === 'services' ? [e.target.value] : e.target.value)}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}>
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          )}
          {itemType === 'services' && <small className="text-muted">Select primary category for this service</small>}
          {itemType === 'social' && <small className="text-muted">Choose where this social media link will appear</small>}
        </Form.Group>
      </Col>

      {(itemType === 'faq' || itemType === 'social') && (
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold mb-2">Display Order</Form.Label>
            <Form.Control
              type="number"
              value={formData.order || 1}
              onChange={(e) => onFormChange('order', parseInt(e.target.value) || 1)}
              placeholder="1"
              min="1"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">
              {itemType === 'faq'
                ? 'Order in which this FAQ appears (lower numbers appear first)'
                : 'Order in which this social media link appears'}
            </small>
          </Form.Group>
        </Col>
      )}

      {itemType === 'services' && (
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold mb-2">
              Icon <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.icon || ''}
              onChange={(e) => onFormChange('icon', e.target.value)}
              placeholder="flaticon-house"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">Enter flaticon class name (e.g., flaticon-house)</small>
          </Form.Group>
        </Col>
      )}

      {itemType === 'portfolio' && (
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold mb-2">
              Filter Type <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.filter || ''}
              onChange={(e) => onFormChange('filter', e.target.value)}
              placeholder="Houses, Retail, etc."
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
          </Form.Group>
        </Col>
      )}

      {itemType === 'news' && (
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold mb-2">
              Type <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={formData.type || ''}
              onChange={(e) => onFormChange('type', e.target.value)}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}>
              <option value="">Select type</option>
              <option value="REAL ESTATE">Real Estate</option>
              <option value="BUSINESS">Business</option>
              <option value="NEWS">News</option>
              <option value="TRENDS">Trends</option>
              <option value="GUIDE">Guide</option>
            </Form.Select>
          </Form.Group>
        </Col>
      )}

      {itemType === 'properties' && (
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold mb-2">
              Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              value={formData.date || ''}
              onChange={(e) => onFormChange('date', e.target.value)}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
          </Form.Group>
        </Col>
      )}
    </Row>
  )
}

export default CategorySection
