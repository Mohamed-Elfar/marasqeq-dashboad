'use client';

import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import ImageUploader from './ImageUploader';

const SectionEditor = ({ section, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(section.content);

  const handleSave = () => {
    onUpdate({
      ...section,
      content
    });
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleVisibility = () => {
    onUpdate({
      ...section,
      visible: !section.visible
    });
  };

  const renderFieldsForType = () => {
    switch (section.type) {
      case 'hero':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={content.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subtitle</Form.Label>
              <Form.Control
                type="text"
                value={content.subtitle || ''}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hero Image</Form.Label>
              <ImageUploader
                currentImage={content.image}
                onUpload={(url) => handleFieldChange('image', url)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Button Text</Form.Label>
              <Form.Control
                type="text"
                value={content.buttonText || ''}
                onChange={(e) => handleFieldChange('buttonText', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Button URL</Form.Label>
              <Form.Control
                type="text"
                value={content.buttonUrl || ''}
                onChange={(e) => handleFieldChange('buttonUrl', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Video URL (optional)</Form.Label>
              <Form.Control
                type="text"
                value={content.videoUrl || ''}
                onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                placeholder="https://..."
              />
            </Form.Group>
          </>
        );
      case 'about':
      case 'content':
      case 'header':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={content.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={content.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
              />
            </Form.Group>
            {section.type === 'about' && (
              <Form.Group className="mb-3">
                <Form.Label>Section Image</Form.Label>
                <ImageUploader
                  currentImage={content.image}
                  onUpload={(url) => handleFieldChange('image', url)}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Video URL (optional)</Form.Label>
              <Form.Control
                type="text"
                value={content.videoUrl || ''}
                onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                placeholder="https://..."
              />
            </Form.Group>
          </>
        );
      case 'info':
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={content.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={content.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={content.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
              />
            </Form.Group>
          </>
        );
      default:
        return (
          <Form.Group className="mb-3">
            <Form.Label>Content (JSON)</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={JSON.stringify(content, null, 2)}
              onChange={(e) => {
                try {
                  setContent(JSON.parse(e.target.value));
                } catch (error) {
                  // Invalid JSON
                }
              }}
            />
          </Form.Group>
        );
    }
  };

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0">{section.name}</h6>
          <small className="text-muted">Type: {section.type}</small>
        </div>
        <div>
          <Form.Check
            type="switch"
            label="Visible"
            checked={section.visible}
            onChange={toggleVisibility}
            className="me-2"
            inline
          />
        </div>
      </Card.Header>
      <Card.Body>
        {isEditing ? (
          <>
            {renderFieldsForType()}
            <div className="d-flex gap-2">
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save Changes
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setContent(section.content);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => onRemove(section.id)}>
                Delete Section
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-2 small text-muted" style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(content, null, 2)}
            </p>
            <Button variant="outline-primary" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default SectionEditor;
