import React from 'react'
import { Form, Row, Col, Spinner } from 'react-bootstrap'
import { translateText } from '@/utils/translate'
import { HiOutlineTranslate } from 'react-icons/hi'
import ImageUploader from '../../../ImageUploader'
import VideoUploader from '../../../VideoUploader'

const MediaSection = ({ formData, itemType, onFormChange }) => {
  const [translating, setTranslating] = React.useState({})

  const handleTranslateFloorPlan = async (index, sourceField, targetField) => {
    const text = formData.floorPlans[index][sourceField]
    if (!text) return

    const key = `floorPlan-${index}-${targetField}`
    setTranslating(prev => ({ ...prev, [key]: true }))
    try {
      const translated = await translateText(text)
      if (translated) {
        const updated = [...(formData.floorPlans || [])]
        updated[index] = { ...updated[index], [targetField]: translated }
        onFormChange('floorPlans', updated)
      }
    } finally {
      setTranslating(prev => ({ ...prev, [key]: false }))
    }
  }

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
            onRemove={() => onFormChange(isService || isPortfolio ? 'thumbImage' : isNews ? 'featured_image' : isProperty ? 'productImg' : 'image', '')}
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
                onRemove={() => {
                  if (isService) {
                    onFormChange('detail_image_1', '')
                  }
                  onFormChange('captions.image1', '')
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
                onRemove={() => {
                  if (isService) {
                    onFormChange('detail_image_2', '')
                  }
                  onFormChange('captions.image2', '')
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
                Upload Video <span className="text-muted small">(optional)</span>
              </Form.Label>
              <VideoUploader
                currentVideo={formData.videoUrl}
                onUpload={(url) => onFormChange('videoUrl', url)}
                onRemove={() => onFormChange('videoUrl', '')}
              />
              <small className="text-muted">Upload a video file for property tour (MP4, WebM, OGG, MOV, AVI)</small>
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
                onRemove={() => onFormChange('videoPoster', '')}
              />
              <small className="text-muted">Background image shown before video plays</small>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Label className="fw-semibold mb-2">
              Gallery Images <span className="text-muted small">(optional)</span>
            </Form.Label>
            <small className="text-muted d-block mb-3">Add as many images as needed for the property gallery</small>
          </Col>

          {(formData.galleryImages || []).map((image, index) => (
            <Col md={4} key={index}>
              <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="fw-semibold mb-0">Gallery Image {index + 1}</Form.Label>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      const newImages = [...(formData.galleryImages || [])];
                      newImages.splice(index, 1);
                      onFormChange('galleryImages', newImages);
                    }}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  >
                    Remove
                  </button>
                </div>
                <ImageUploader
                  currentImage={image || ''}
                  onUpload={(url) => {
                    const newImages = [...(formData.galleryImages || [])];
                    newImages[index] = url;
                    onFormChange('galleryImages', newImages);
                  }}
                />
              </Form.Group>
            </Col>
          ))}

          <Col md={12} className="mb-4">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                const newImages = [...(formData.galleryImages || []), ''];
                onFormChange('galleryImages', newImages);
              }}
              style={{
                borderRadius: '8px',
                padding: '0.5rem 1.5rem',
                border: '2px dashed #6c757d',
                background: 'transparent',
                color: '#6c757d',
                fontWeight: 500,
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#0d6efd';
                e.target.style.color = '#0d6efd';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#6c757d';
                e.target.style.color = '#6c757d';
              }}
            >
              + Add Gallery Image
            </button>
          </Col>

          {/* Floor Plans */}
          <Col md={12}>
            <hr />
            <Form.Label className="fw-semibold mb-2">
              Floor Plans <span className="text-muted small">(optional)</span>
            </Form.Label>
            <small className="text-muted d-block mb-3">Each floor plan needs a label and at least an image or description to appear on the website</small>
          </Col>

          {(formData.floorPlans || []).map((plan, index) => (
            <Col md={12} key={index} className="mb-4 p-3" style={{ background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong>Floor Plan {index + 1}</strong>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    const updated = [...(formData.floorPlans || [])];
                    updated.splice(index, 1);
                    onFormChange('floorPlans', updated);
                  }}
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                >
                  Remove
                </button>
              </div>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold mb-1" style={{ fontSize: '13px' }}>Label (e.g. First Floor)</Form.Label>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Form.Control
                        type="text"
                        size="sm"
                        placeholder="e.g. First Floor"
                        value={plan.label || ''}
                        onChange={(e) => {
                          const updated = [...(formData.floorPlans || [])];
                          updated[index] = { ...updated[index], label: e.target.value };
                          onFormChange('floorPlans', updated);
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                        style={{ height: '31px', width: '31px' }}
                        onClick={() => handleTranslateFloorPlan(index, 'label', 'label_ar')}
                        disabled={translating[`floorPlan-${index}-label_ar`]}
                        title="Translate"
                      >
                        {translating[`floorPlan-${index}-label_ar`] ? <Spinner animation="border" size="sm" /> : <HiOutlineTranslate size={14} />}
                      </button>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        type="text"
                        size="sm"
                        dir="rtl"
                        placeholder="الملصق بالعربية..."
                        value={plan.label_ar || ''}
                        onChange={(e) => {
                          const updated = [...(formData.floorPlans || [])];
                          updated[index] = { ...updated[index], label_ar: e.target.value };
                          onFormChange('floorPlans', updated);
                        }}
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                        style={{ height: '31px', width: '31px' }}
                        onClick={() => handleTranslateFloorPlan(index, 'label_ar', 'label')}
                        disabled={translating[`floorPlan-${index}-label`]}
                        title="Translate"
                      >
                        {translating[`floorPlan-${index}-label`] ? <Spinner animation="border" size="sm" /> : <HiOutlineTranslate size={14} />}
                      </button>
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold mb-1" style={{ fontSize: '13px' }}>Description</Form.Label>
                    <div className="position-relative mb-2">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        size="sm"
                        placeholder="Describe this floor..."
                        value={plan.description || ''}
                        onChange={(e) => {
                          const updated = [...(formData.floorPlans || [])];
                          updated[index] = { ...updated[index], description: e.target.value };
                          onFormChange('floorPlans', updated);
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center position-absolute"
                        style={{ bottom: '5px', right: '5px', height: '28px', width: '28px' }}
                        onClick={() => handleTranslateFloorPlan(index, 'description', 'description_ar')}
                        disabled={translating[`floorPlan-${index}-description_ar`]}
                        title="Translate"
                      >
                        {translating[`floorPlan-${index}-description_ar`] ? <Spinner animation="border" size="sm" /> : <HiOutlineTranslate size={14} />}
                      </button>
                    </div>
                    <div className="position-relative">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        size="sm"
                        dir="rtl"
                        placeholder="الوصف بالعربية..."
                        value={plan.description_ar || ''}
                        onChange={(e) => {
                          const updated = [...(formData.floorPlans || [])];
                          updated[index] = { ...updated[index], description_ar: e.target.value };
                          onFormChange('floorPlans', updated);
                        }}
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center position-absolute"
                        style={{ bottom: '5px', left: '5px', height: '28px', width: '28px' }}
                        onClick={() => handleTranslateFloorPlan(index, 'description_ar', 'description')}
                        disabled={translating[`floorPlan-${index}-description`]}
                        title="Translate"
                      >
                        {translating[`floorPlan-${index}-description`] ? <Spinner animation="border" size="sm" /> : <HiOutlineTranslate size={14} />}
                      </button>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Label className="fw-semibold mb-1" style={{ fontSize: '13px' }}>Floor Plan Image</Form.Label>
                  <ImageUploader
                    currentImage={plan.image || ''}
                    onUpload={(url) => {
                      const updated = [...(formData.floorPlans || [])];
                      updated[index] = { ...updated[index], image: url };
                      onFormChange('floorPlans', updated);
                    }}
                  />
                </Col>
              </Row>
            </Col>
          ))}

          <Col md={12} className="mb-4">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => {
                const updated = [...(formData.floorPlans || []), { label: '', image: '', description: '' }];
                onFormChange('floorPlans', updated);
              }}
              style={{
                borderRadius: '8px',
                padding: '0.5rem 1.5rem',
                border: '2px dashed #198754',
                background: 'transparent',
                color: '#198754',
                fontWeight: 500,
                width: '100%',
              }}
            >
              + Add Floor Plan
            </button>
          </Col>
        </>
      )}
    </Row>
  )
}

export default MediaSection
