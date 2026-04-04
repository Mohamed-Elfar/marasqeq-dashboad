import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import ImageUploader from '../../../ImageUploader'

const MediaSection = ({ formData, itemType, onFormChange }) => {
  // Don't show media section for social media and FAQ
  if (itemType === 'social' || itemType === 'faq') {
    return null
  }

  const isService = itemType === 'services'
  const isPortfolio = itemType === 'portfolio'
  const isNews = itemType === 'news'
  const getCaptionImage = (key) => {
    if (isService && key === 'image1') {
      return formData.detail_image_1 || formData.captions?.image1 || ''
    }

    if (isService && key === 'image2') {
      return formData.detail_image_2 || formData.captions?.image2 || ''
    }

    return formData.captions?.[key] || ''
  }

  return (
    <Row>
      <Col md={6}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">
            {isService || isPortfolio ? 'Thumbnail Image' : isNews ? 'Featured Image' : 'Image'}{' '}
            {itemType !== 'news' ? <span className="text-danger">*</span> : <span className="text-muted small">(optional)</span>}
          </Form.Label>
          <ImageUploader
            currentImage={isService || isPortfolio ? formData.thumbImage : isNews ? formData.featured_image : formData.image}
            onUpload={(url) => onFormChange(isService || isPortfolio ? 'thumbImage' : isNews ? 'featured_image' : 'image', url)}
          />
        </Form.Group>
      </Col>

      {(isService || isPortfolio) && (
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              {isService ? 'Banner' : 'Main Image'} <span className="text-danger">*</span>
            </Form.Label>
            <ImageUploader currentImage={formData.img} onUpload={(url) => onFormChange('img', url)} />
          </Form.Group>
        </Col>
      )}

      {isService && (
        <>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                Detail Image 1 <span className="text-danger">*</span>
              </Form.Label>
              <ImageUploader
                currentImage={getCaptionImage('image1')}
                onUpload={(url) => {
                  onFormChange('detail_image_1', url)
                  onFormChange('captions.image1', url)
                }}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                Detail Image 2 <span className="text-danger">*</span>
              </Form.Label>
              <ImageUploader
                currentImage={getCaptionImage('image2')}
                onUpload={(url) => {
                  onFormChange('detail_image_2', url)
                  onFormChange('captions.image2', url)
                }}
              />
            </Form.Group>
          </Col>

        </>
      )}
    </Row>
  )
}

export default MediaSection
