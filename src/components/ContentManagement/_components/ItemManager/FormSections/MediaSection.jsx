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
  const isProperty = itemType === 'properties'
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
            {isService || isPortfolio ? 'Thumbnail Image' : isNews ? 'Featured Image' : isProperty ? 'Property Image' : 'Image'}{' '}
            {itemType !== 'news' ? <span className="text-danger">*</span> : <span className="text-muted small">(optional)</span>}
          </Form.Label>
          <ImageUploader
            currentImage={isService || isPortfolio ? formData.thumbImage : isNews ? formData.featured_image : isProperty ? formData.productImg : formData.image}
            onUpload={(url) => onFormChange(isService || isPortfolio ? 'thumbImage' : isNews ? 'featured_image' : isProperty ? 'productImg' : 'image', url)}
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

      {(isService || isPortfolio) && (
        <>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                Detail Image 1 <span className="text-muted small">(optional)</span>
              </Form.Label>
              <ImageUploader
                currentImage={getCaptionImage('image1')}
                onUpload={(url) => {
                  if (isService) {
                    onFormChange('detail_image_1', url)
                  }
                  onFormChange('captions.image1', url)
                }}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                Detail Image 2 <span className="text-muted small">(optional)</span>
              </Form.Label>
              <ImageUploader
                currentImage={getCaptionImage('image2')}
                onUpload={(url) => {
                  if (isService) {
                    onFormChange('detail_image_2', url)
                  }
                  onFormChange('captions.image2', url)
                }}
              />
            </Form.Group>
          </Col>
        </>
      )}

      {isProperty && (
        <>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                Video URL <span className="text-muted small">(optional)</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.videoUrl || ''}
                onChange={(e) => onFormChange('videoUrl', e.target.value)}
                placeholder="e.g., https://www.youtube.com/watch?v=..."
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  padding: '0.75rem 1rem',
                }}
              />
              <small className="text-muted">YouTube or Vimeo video URL for property tour</small>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                Video Poster <span className="text-muted small">(optional)</span>
              </Form.Label>
              <ImageUploader
                currentImage={formData.videoPoster}
                onUpload={(url) => onFormChange('videoPoster', url)}
              />
              <small className="text-muted">Background image shown before video plays</small>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Label className="fw-semibold mb-2">
              Gallery Images <span className="text-muted small">(optional)</span>
            </Form.Label>
            <small className="text-muted d-block mb-3">Upload up to 3 images for the property gallery</small>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">Gallery Image 1</Form.Label>
              <ImageUploader
                currentImage={formData.galleryImage1 || ''}
                onUpload={(url) => onFormChange('galleryImage1', url)}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">Gallery Image 2</Form.Label>
              <ImageUploader
                currentImage={formData.galleryImage2 || ''}
                onUpload={(url) => onFormChange('galleryImage2', url)}
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">Gallery Image 3</Form.Label>
              <ImageUploader
                currentImage={formData.galleryImage3 || ''}
                onUpload={(url) => onFormChange('galleryImage3', url)}
              />
            </Form.Group>
          </Col>
        </>
      )}
    </Row>
  )
}

export default MediaSection
