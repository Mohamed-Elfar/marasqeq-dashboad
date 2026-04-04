import React from 'react'
import { Form, Row, Col } from 'react-bootstrap'

const BasicInfoSection = ({ formData, itemType, onFormChange }) => {
  return (
    <Row>
      <Col md={12}>
        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold mb-2">
            {itemType === 'social' ? 'Social Media Name' : itemType === 'faq' ? 'Question' : 'Title'} <span className="text-danger">*</span>
          </Form.Label>
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
        </>
      )}

      {itemType === 'faq' && (
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Answer <span className="text-danger">*</span>
            </Form.Label>
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
          </Form.Group>
        </Col>
      )}

      {itemType === 'portfolio' && (
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Designation <span className="text-danger">*</span>
            </Form.Label>
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
        </Form.Group>
      </Col>

      {(itemType === 'news' || itemType === 'services' || itemType === 'portfolio') && (
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-2">
              Full Description <span className="text-danger">*</span>
            </Form.Label>
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
          </Form.Group>
        </Col>
      )}
    </Row>
  )
}

export default BasicInfoSection
