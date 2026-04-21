import React, { useState, useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import ImageUploader from '../../../ImageUploader'

const SpecificDetailsSection = ({ formData, itemType, onFormChange }) => {
  const [formOptions, setFormOptions] = useState({
    objectives: []
  })

  useEffect(() => {
    if (itemType === 'properties') {
      fetchFormOptions()
    }
  }, [itemType])

  const fetchFormOptions = async () => {
    try {
      const response = await fetch('/api/form-options?type=objectives')
      const data = await response.json()
      setFormOptions(data)
    } catch (err) {
      console.error('Failed to fetch form options:', err)
    }
  }
  if (itemType === 'properties') {
    return (
      <>
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

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Property Status <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={formData.status || 'for_sale'}
              onChange={(e) => onFormChange('status', e.target.value)}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            >
              <option value="for_sale">For Sale</option>
              <option value="for_rent">For Rent</option>
              <option value="for_lease">For Lease</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="pending">Pending</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Finish Status
            </Form.Label>
            <Form.Select
              value={formData.finishStatus || 'without_finish'}
              onChange={(e) => onFormChange('finishStatus', e.target.value)}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            >
              <option value="without_finish">Without Finish</option>
              <option value="semi_finished">Semi Finished</option>
              <option value="fully_finished">Fully Finished</option>
              <option value="super_lux">Super Lux</option>
              <option value="lux">Lux</option>
              <option value="deluxe_finish">Deluxe Finish</option>
              <option value="furnished">Furnished</option>
            </Form.Select>
            <small className="text-muted">Select the property finish condition</small>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Objective <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={formData.objective || ''}
              onChange={(e) => onFormChange('objective', e.target.value)}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            >
              <option value="">Select objective</option>
              {formOptions.objectives
                .filter(option => option.active)
                .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                .map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </Form.Select>
            <small className="text-muted">Select the primary objective for this property</small>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Property Type <span className="text-muted small">(optional)</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.propertyType || ''}
              onChange={(e) => onFormChange('propertyType', e.target.value)}
              placeholder="e.g., Villa, Apartment, House"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">Type of property (Villa, Apartment, Townhouse, etc.)</small>
          </Form.Group>
        </Col>

        <Col md={3}>
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

        <Col md={3}>
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

        <Col md={3}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Area <span className="text-danger">*</span>
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

        <Col md={3}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Unit Type
            </Form.Label>
            <Form.Select
              value={formData.unitType || 'sq_m'}
              onChange={(e) => onFormChange('unitType', e.target.value)}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            >
              <option value="sq_m">Square Meter (m²)</option>
              <option value="sq_ft">Square Foot (sq ft)</option>
              <option value="m">Meter (m)</option>
              <option value="feddan">Feddan</option>
              <option value="kirat">Kirat</option>
              <option value="sahm">Sahm</option>
              <option value="hectare">Hectare (ha)</option>
              <option value="acre">Acre</option>
            </Form.Select>
            <small className="text-muted">Select the unit of measurement</small>
          </Form.Group>
        </Col>
      </Row>

      {/* Area Breakdown Section */}
      <Row className="mb-4">
        <Col xs={12}>
          <h6 className="text-muted mb-3" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            Area Breakdown (Uses selected Unit Type)
          </h6>
        </Col>

        <Col md={3}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Total Area
            </Form.Label>
            <Form.Control
              type="number"
              value={formData.totalArea || ''}
              onChange={(e) => onFormChange('totalArea', e.target.value)}
              placeholder="e.g., 2800"
              min="0"
              step="0.01"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">Total property area</small>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Net Area
            </Form.Label>
            <Form.Control
              type="number"
              value={formData.netArea || ''}
              onChange={(e) => onFormChange('netArea', e.target.value)}
              placeholder="e.g., 2500"
              min="0"
              step="0.01"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">Net usable area</small>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Built-up Area
            </Form.Label>
            <Form.Control
              type="number"
              value={formData.builtUpArea || ''}
              onChange={(e) => onFormChange('builtUpArea', e.target.value)}
              placeholder="e.g., 2600"
              min="0"
              step="0.01"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">Built-up area</small>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Land Area
            </Form.Label>
            <Form.Control
              type="number"
              value={formData.landArea || ''}
              onChange={(e) => onFormChange('landArea', e.target.value)}
              placeholder="e.g., 3000"
              min="0"
              step="0.01"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">Land area</small>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Rooms <span className="text-muted small">(optional)</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={formData.rooms || ''}
              onChange={(e) => onFormChange('rooms', e.target.value)}
              placeholder="e.g., 7"
              min="0"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">Total number of rooms in the property</small>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Living Room <span className="text-muted small">(optional)</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={formData.livingRoom || ''}
              onChange={(e) => onFormChange('livingRoom', e.target.value)}
              placeholder="e.g., 1"
              min="0"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">Number of living rooms</small>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Nanny Room <span className="text-muted small">(optional)</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={formData.nannyRoom || ''}
              onChange={(e) => onFormChange('nannyRoom', e.target.value)}
              placeholder="e.g., 1"
              min="0"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">Number of nanny rooms</small>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Other distinctive addition <span className="text-muted small">(optional)</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={formData.otherDistinctiveAddition || ''}
              onChange={(e) => onFormChange('otherDistinctiveAddition', e.target.value)}
              placeholder="e.g., Private elevator, Rooftop garden"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">Describe any other distinctive additions</small>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Number of floors <span className="text-muted small">(optional)</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={formData.numberOfFloors || ''}
              onChange={(e) => onFormChange('numberOfFloors', e.target.value)}
              placeholder="e.g., 3"
              min="0"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">Total number of floors in the property</small>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Year Built <span className="text-muted small">(optional)</span>
            </Form.Label>
            <Form.Control
              type="number"
              value={formData.yearBuilt || ''}
              onChange={(e) => onFormChange('yearBuilt', e.target.value)}
              placeholder="e.g., 2020"
              min="1800"
              max={new Date().getFullYear() + 5}
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">Year the property was built</small>
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Google Maps Embed URL <span className="text-muted small">(for map)</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData.mapEmbedUrl || ''}
              onChange={(e) => onFormChange('mapEmbedUrl', e.target.value)}
              placeholder="Paste the Google Maps embed URL here (e.g., https://www.google.com/maps/embed?pb=...)"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
              }}
            />
            <small className="text-muted">
              Go to Google Maps → Find location → Share → Embed a map → Copy the URL from the iframe src
            </small>
          </Form.Group>
        </Col>
      </Row>
      </>
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
