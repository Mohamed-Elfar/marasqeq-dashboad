import React from 'react'
import { Form, Row, Col, Spinner } from 'react-bootstrap'
import { translateText } from '@/utils/translate'
import { HiOutlineTranslate } from 'react-icons/hi'

const CategorySection = ({ formData, itemType, categories, onFormChange }) => {
  const [translating, setTranslating] = React.useState({})

  const handleTranslate = async (sourceField, targetField) => {
    const text = formData[sourceField]
    if (!text) return

    setTranslating(prev => ({ ...prev, [targetField]: true }))
    try {
      const translated = await translateText(text)
      if (translated) {
        onFormChange(targetField, translated)
      }
    } finally {
      setTranslating(prev => ({ ...prev, [targetField]: false }))
    }
  }

  return (
    <Row>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold mb-2">
            {itemType === 'social' ? 'Position' : itemType === 'properties' ? 'Property Type' : 'Category'} <span className="text-danger">*</span>
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
          ) : itemType === 'portfolio' ? (
            <Form.Select
              value={Array.isArray(formData.category) ? formData.category[0] : formData.category || ''}
              onChange={(e) => onFormChange('category', [e.target.value])}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}>
              <option value="">Select a category</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Industrial">Industrial</option>
              <option value="Mixed-Use">Mixed-Use</option>
            </Form.Select>
          ) : (
            <Form.Select
              value={Array.isArray(formData.category) ? formData.category[0] : formData.category || ''}
              onChange={(e) => {
                // For properties and services, save as array
                if (itemType === 'properties' || itemType === 'services') {
                  onFormChange('category', [e.target.value]);
                } else {
                  onFormChange('category', e.target.value);
                }
              }}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}>
              <option value="">Select property type</option>
              {categories
                .filter(cat => cat.type === 'properties')
                .map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          )}
          {itemType === 'properties' && <small className="text-muted">Select the property type for this listing</small>}
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
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
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
            </div>
            <button
              type="button"
              className="btn btn-outline-primary d-flex align-items-center justify-content-center"
              style={{ borderRadius: '8px', height: '54px', width: '54px' }}
              onClick={() => handleTranslate('filter', 'filter_ar')}
              disabled={translating['filter_ar']}
              title="Translate"
            >
              {translating['filter_ar'] ? <Spinner animation="border" size="sm" /> : <HiOutlineTranslate size={20} />}
            </button>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold mb-2">Filter Type (Arabic)</Form.Label>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Form.Control
                type="text"
                dir="rtl"
                value={formData.filter_ar || ''}
                onChange={(e) => onFormChange('filter_ar', e.target.value)}
                placeholder="نوع الفلتر بالعربية..."
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </div>
            <button
              type="button"
              className="btn btn-outline-primary d-flex align-items-center justify-content-center"
              style={{ borderRadius: '8px', height: '54px', width: '54px' }}
              onClick={() => handleTranslate('filter_ar', 'filter')}
              disabled={translating['filter']}
              title="Translate"
            >
              {translating['filter'] ? <Spinner animation="border" size="sm" /> : <HiOutlineTranslate size={20} />}
            </button>
          </div>
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
