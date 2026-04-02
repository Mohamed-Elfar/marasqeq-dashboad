import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import ImageUploader from '../../../ImageUploader'

const MediaSection = ({ formData, itemType, onFormChange }) => {
  // Don't show media section for social media and FAQ
  if (itemType === 'social' || itemType === 'faq') {
    return null
  }

  return (
    <Row>
      <Col md={6}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">
            {itemType === 'services' || itemType === 'portfolio' ? 'Thumbnail Image' : 'Image'}{' '}
            {itemType !== 'news' ? <span className="text-danger">*</span> : <span className="text-muted small">(optional)</span>}
          </Form.Label>
          <ImageUploader
            currentImage={itemType === 'services' || itemType === 'portfolio' ? formData.thumbImage : formData.image}
            onUpload={(url) => onFormChange(itemType === 'services' || itemType === 'portfolio' ? 'thumbImage' : 'image', url)}
          />
        </Form.Group>
      </Col>

      {(itemType === 'services' || itemType === 'portfolio') && (
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Main Image <span className="text-danger">*</span>
            </Form.Label>
            <ImageUploader currentImage={formData.img} onUpload={(url) => onFormChange('img', url)} />
          </Form.Group>
        </Col>
      )}
    </Row>
  )
}

export default MediaSection
