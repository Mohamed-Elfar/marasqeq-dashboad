import React from 'react'
import { Form, Row, Col, Spinner } from 'react-bootstrap'
import ImageUploader from '../../../ImageUploader'
import { translateText } from '@/utils/translate'
import { HiOutlineTranslate } from 'react-icons/hi'

const BasicInfoSection = ({ formData, itemType, onFormChange }) => {
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
      <Col md={12}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">
            {itemType === 'social' ? 'Social Media Name' : itemType === 'faq' ? 'Question' : 'Title'} <span className="text-danger">*</span>
          </Form.Label>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Form.Control
                type="text"
                value={itemType === 'social' ? formData.name : itemType === 'faq' ? formData.question : formData.title || ''}
                onChange={(e) => onFormChange(itemType === 'social' ? 'name' : itemType === 'faq' ? 'question' : 'title', e.target.value)}
                placeholder={
                  itemType === 'social' ? 'e.g., Facebook, Twitter, Instagram' : itemType === 'faq' ? 'Enter your question' : 'Enter title'
                }
                className="form-control-lg"
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
              onClick={() => {
                const source = itemType === 'social' ? 'name' : itemType === 'faq' ? 'question' : 'title'
                const target = itemType === 'social' ? 'name_ar' : itemType === 'faq' ? 'question_ar' : 'title_ar'
                handleTranslate(source, target)
              }}
              disabled={translating['title_ar'] || translating['name_ar'] || translating['question_ar']}
              title="Translate to Arabic"
            >
              {translating['title_ar'] || translating['name_ar'] || translating['question_ar'] ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <HiOutlineTranslate size={20} />
              )}
            </button>
          </div>
        </Form.Group>
      </Col>

      <Col md={12}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">
            {itemType === 'social' ? 'Name (Arabic)' : itemType === 'faq' ? 'Question (Arabic)' : 'Title (Arabic)'}
          </Form.Label>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Form.Control
                type="text"
                dir="rtl"
                value={itemType === 'social' ? formData.name_ar : itemType === 'faq' ? formData.question_ar : formData.title_ar || ''}
                onChange={(e) => onFormChange(itemType === 'social' ? 'name_ar' : itemType === 'faq' ? 'question_ar' : 'title_ar', e.target.value)}
                placeholder={
                  itemType === 'social' ? 'الاسم بالعربية...' : itemType === 'faq' ? 'السؤال بالعربية...' : 'العنوان بالعربية...'
                }
                className="form-control-lg"
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
              onClick={() => {
                const source = itemType === 'social' ? 'name_ar' : itemType === 'faq' ? 'question_ar' : 'title_ar'
                const target = itemType === 'social' ? 'name' : itemType === 'faq' ? 'question' : 'title'
                handleTranslate(source, target)
              }}
              disabled={translating['title'] || translating['name'] || translating['question']}
              title="Translate to English"
            >
              {translating['title'] || translating['name'] || translating['question'] ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <HiOutlineTranslate size={20} />
              )}
            </button>
          </div>
        </Form.Group>
      </Col>

      {itemType === 'social' && (
        <>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                Icon <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                value={formData.icon || 'FaFacebookF'}
                onChange={(e) => onFormChange('icon', e.target.value)}
                style={{
                  borderRadius: '8px',
                  border: '2px solid #e9ecef',
                  padding: '0.75rem 1rem',
                }}>
                <option value="FaFacebookF">Facebook</option>
                <option value="FaTwitter">Twitter</option>
                <option value="FaInstagram">Instagram</option>
                <option value="FaLinkedin">LinkedIn</option>
                <option value="FaYoutube">YouTube</option>
                <option value="FaPinterest">Pinterest</option>
                <option value="FaTiktok">TikTok</option>
                <option value="FaSnapchat">Snapchat</option>
                <option value="FaWhatsapp">WhatsApp</option>
                <option value="FaTelegram">Telegram</option>
                <option value="FaGithub">GitHub</option>
                <option value="FaDiscord">Discord</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                URL <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="url"
                value={formData.url || ''}
                onChange={(e) => onFormChange('url', e.target.value)}
                placeholder="https://www.example.com/profile"
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
              <Form.Label className="fw-semibold mb-2">
                Position <span className="text-danger">*</span>
              </Form.Label>
              <div className="d-flex gap-4 flex-wrap">
                <Form.Check
                  type="checkbox"
                  id="position-header"
                  label="Header"
                  checked={Array.isArray(formData.position) ? formData.position.includes('header') : false}
                  onChange={(e) => {
                    const currentPositions = Array.isArray(formData.position) ? formData.position : [];
                    const newPositions = e.target.checked 
                      ? [...currentPositions, 'header']
                      : currentPositions.filter(pos => pos !== 'header');
                    onFormChange('position', newPositions);
                  }}
                />
                <Form.Check
                  type="checkbox"
                  id="position-footer"
                  label="Footer"
                  checked={Array.isArray(formData.position) ? formData.position.includes('footer') : false}
                  onChange={(e) => {
                    const currentPositions = Array.isArray(formData.position) ? formData.position : [];
                    const newPositions = e.target.checked 
                      ? [...currentPositions, 'footer']
                      : currentPositions.filter(pos => pos !== 'footer');
                    onFormChange('position', newPositions);
                  }}
                />
                <Form.Check
                  type="checkbox"
                  id="position-news"
                  label="News"
                  checked={Array.isArray(formData.position) ? formData.position.includes('news') : false}
                  onChange={(e) => {
                    const currentPositions = Array.isArray(formData.position) ? formData.position : [];
                    const newPositions = e.target.checked 
                      ? [...currentPositions, 'news']
                      : currentPositions.filter(pos => pos !== 'news');
                    onFormChange('position', newPositions);
                  }}
                />
              </div>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold mb-2">
                QR Code Image <span className="text-muted small">(optional)</span>
              </Form.Label>
              <ImageUploader
                currentImage={formData.qrImage || ''}
                onUpload={(url) => onFormChange('qrImage', url)}
              />
            </Form.Group>
          </Col>
        </>
      )}

      {itemType === 'faq' && (
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Answer <span className="text-danger">*</span>
            </Form.Label>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.answer || ''}
                onChange={(e) => onFormChange('answer', e.target.value)}
                placeholder="Provide a detailed answer to the question..."
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
              style={{ borderRadius: '8px', height: '100px', width: '54px' }}
              onClick={() => handleTranslate('answer', 'answer_ar')}
              disabled={translating['answer_ar']}
              title="Translate"
            >
              {translating['answer_ar'] ? <Spinner animation="border" size="sm" /> : <HiOutlineTranslate size={20} />}
            </button>
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">Answer (Arabic)</Form.Label>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Form.Control
                as="textarea"
                rows={4}
                dir="rtl"
                value={formData.answer_ar || ''}
                onChange={(e) => onFormChange('answer_ar', e.target.value)}
                placeholder="الإجابة بالعربية..."
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
              style={{ borderRadius: '8px', height: '100px', width: '54px' }}
              onClick={() => handleTranslate('answer_ar', 'answer')}
              disabled={translating['answer']}
              title="Translate"
            >
              {translating['answer'] ? <Spinner animation="border" size="sm" /> : <HiOutlineTranslate size={20} />}
            </button>
          </div>
        </Form.Group>
      </Col>
      )}

      {itemType === 'portfolio' && (
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Designation <span className="text-danger">*</span>
            </Form.Label>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Form.Control
                type="text"
                value={formData.designation || ''}
                onChange={(e) => onFormChange('designation', e.target.value)}
                placeholder="Web Design & Development, Branding"
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
              onClick={() => handleTranslate('designation', 'designation_ar')}
              disabled={translating['designation_ar']}
              title="Translate"
            >
              {translating['designation_ar'] ? <Spinner animation="border" size="sm" /> : <HiOutlineTranslate size={20} />}
            </button>
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">Designation (Arabic)</Form.Label>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Form.Control
                type="text"
                dir="rtl"
                value={formData.designation_ar || ''}
                onChange={(e) => onFormChange('designation_ar', e.target.value)}
                placeholder="التخصص بالعربية..."
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
              onClick={() => handleTranslate('designation_ar', 'designation')}
              disabled={translating['designation']}
              title="Translate"
            >
              {translating['designation'] ? <Spinner animation="border" size="sm" /> : <HiOutlineTranslate size={20} />}
            </button>
          </div>
        </Form.Group>
      </Col>
      )}

      <Col md={12}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">
            {itemType === 'services'
              ? 'Short Description'
              : itemType === 'news'
                ? 'Short Description'
                : itemType === 'portfolio'
                  ? 'Short Description'
                  : 'Description'}{' '}
            {itemType !== 'properties' ? <span className="text-danger">*</span> : ''}
          </Form.Label>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Form.Control
                as="textarea"
                rows={itemType === 'services' ? 2 : itemType === 'news' ? 2 : itemType === 'portfolio' ? 2 : 4}
                value={
                  itemType === 'services'
                    ? formData.shortDescription
                    : itemType === 'news'
                      ? formData.shortDescription
                      : itemType === 'portfolio'
                        ? formData.shortDescription
                        : formData.description || ''
                }
                onChange={(e) =>
                  onFormChange(
                    itemType === 'services'
                      ? 'shortDescription'
                      : itemType === 'news'
                        ? 'shortDescription'
                        : itemType === 'portfolio'
                          ? 'shortDescription'
                          : 'description',
                    e.target.value,
                  )
                }
                placeholder={
                  itemType === 'services'
                    ? 'Brief summary for listings...'
                    : itemType === 'news'
                      ? 'Brief summary for listings...'
                      : itemType === 'portfolio'
                        ? 'Brief summary for portfolio...'
                        : 'Provide a detailed description...'
                }
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
              style={{ borderRadius: '8px', height: itemType === 'properties' ? '100px' : '65px', width: '54px' }}
              onClick={() => {
                const source = itemType === 'properties' ? 'description' : 'shortDescription'
                const target = itemType === 'properties' ? 'description_ar' : 'shortDescription_ar'
                handleTranslate(source, target)
              }}
              disabled={translating['description_ar'] || translating['shortDescription_ar']}
              title="Translate"
            >
              {translating['description_ar'] || translating['shortDescription_ar'] ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <HiOutlineTranslate size={20} />
              )}
            </button>
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">
            {itemType === 'services'
              ? 'Short Description (Arabic)'
              : itemType === 'news'
                ? 'Short Description (Arabic)'
                : itemType === 'portfolio'
                  ? 'Short Description (Arabic)'
                  : 'Description (Arabic)'}
          </Form.Label>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Form.Control
                as="textarea"
                rows={itemType === 'services' ? 2 : itemType === 'news' ? 2 : itemType === 'portfolio' ? 2 : 4}
                dir="rtl"
                value={
                  itemType === 'services'
                    ? formData.shortDescription_ar
                    : itemType === 'news'
                      ? formData.shortDescription_ar
                      : itemType === 'portfolio'
                        ? formData.shortDescription_ar
                        : formData.description_ar || ''
                }
                onChange={(e) =>
                  onFormChange(
                    itemType === 'services'
                      ? 'shortDescription_ar'
                      : itemType === 'news'
                        ? 'shortDescription_ar'
                        : itemType === 'portfolio'
                          ? 'shortDescription_ar'
                          : 'description_ar',
                    e.target.value,
                  )
                }
                placeholder="الوصف بالعربية..."
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
              style={{ borderRadius: '8px', height: itemType === 'properties' ? '100px' : '65px', width: '54px' }}
              onClick={() => {
                const source = itemType === 'properties' ? 'description_ar' : 'shortDescription_ar'
                const target = itemType === 'properties' ? 'description' : 'shortDescription'
                handleTranslate(source, target)
              }}
              disabled={translating['description'] || translating['shortDescription']}
              title="Translate"
            >
              {translating['description'] || translating['shortDescription'] ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <HiOutlineTranslate size={20} />
              )}
            </button>
          </div>
        </Form.Group>
      </Col>

      {(itemType === 'news' || itemType === 'services' || itemType === 'portfolio') && (
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Full Description <span className="text-danger">*</span>
            </Form.Label>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Form.Control
                as="textarea"
                rows={6}
                value={formData.fullDescription || ''}
                onChange={(e) => onFormChange('fullDescription', e.target.value)}
                placeholder="Complete content..."
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
              style={{ borderRadius: '8px', height: '145px', width: '54px' }}
              onClick={() => handleTranslate('fullDescription', 'fullDescription_ar')}
              disabled={translating['fullDescription_ar']}
              title="Translate"
            >
              {translating['fullDescription_ar'] ? <Spinner animation="border" size="sm" /> : <HiOutlineTranslate size={20} />}
            </button>
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">Full Description (Arabic)</Form.Label>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Form.Control
                as="textarea"
                rows={6}
                dir="rtl"
                value={formData.fullDescription_ar || ''}
                onChange={(e) => onFormChange('fullDescription_ar', e.target.value)}
                placeholder="المحتوى الكامل بالعربية..."
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
              style={{ borderRadius: '8px', height: '145px', width: '54px' }}
              onClick={() => handleTranslate('fullDescription_ar', 'fullDescription')}
              disabled={translating['fullDescription']}
              title="Translate"
            >
              {translating['fullDescription'] ? <Spinner animation="border" size="sm" /> : <HiOutlineTranslate size={20} />}
            </button>
          </div>
        </Form.Group>
      </Col>
      )}
    </Row>
  )
}

export default BasicInfoSection
