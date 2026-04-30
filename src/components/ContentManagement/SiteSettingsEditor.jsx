'use client';

import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import VideoUploader from './VideoUploader';

const SiteSettingsEditor = ({ pageKey = 'home' }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [pageKey]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/site-settings');
      const data = await response.json();
      
      if (response.ok) {
        const settingsMap = {};
        (data.settings || []).forEach(setting => {
          settingsMap[setting.key] = setting.value;
        });
        setSettings(settingsMap);
      } else {
        setError(data.error || 'Failed to load settings');
      }
    } catch (err) {
      setError('Failed to load settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPageSettings = () => {
    switch (pageKey) {
      case 'home':
        return [
          { key: 'home_video_url', label: 'Home Page Video URL', type: 'text', placeholder: 'https://www.youtube.com/watch?v=...' },
        ];
      case 'about':
        return [
          { key: 'about_title', label: 'About Page Title', type: 'text', placeholder: 'Enter title' },
          { key: 'about_description', label: 'About Page Description', type: 'textarea', placeholder: 'Enter description' },
          { key: 'about_image', label: 'About Page Image', type: 'text', placeholder: 'Enter image URL' },
        ];
      case 'contact':
        return [
          { key: 'contact_title', label: 'Contact Page Title', type: 'text', placeholder: 'Enter title' },
          { key: 'contact_email', label: 'Contact Email', type: 'text', placeholder: 'Enter email' },
          { key: 'contact_phone', label: 'Contact Phone', type: 'text', placeholder: 'Enter phone' },
          { key: 'contact_address', label: 'Contact Address', type: 'textarea', placeholder: 'Enter address' },
        ];
      case 'services':
        return [
          { key: 'services_title', label: 'Services Page Title', type: 'text', placeholder: 'Enter title' },
          { key: 'services_description', label: 'Services Page Description', type: 'textarea', placeholder: 'Enter description' },
        ];
      default:
        return [];
    }
  };

  const handleFieldChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value
      }));

      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save settings');
      }
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="mb-3">
        <Card.Body className="text-center py-4">
          <Spinner animation="border" size="sm" className="me-2" />
          Loading settings...
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
          Settings saved successfully!
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {pageKey === 'home' ? (
        <Card className="mb-3">
          <Card.Body>
            {getPageSettings().map(field => (
              <Form.Group key={field.key} className="mb-3">
                {pageKey === 'home' && field.key === 'home_video_url' ? (
                  <>
                    <div className="mb-3">
                      <Form.Label className="mb-2">Option 1: Video URL</Form.Label>
                      <Form.Control
                        type="text"
                        value={settings[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... or direct video file URL"
                      />
                      <Form.Text className="text-muted">
                        Enter a YouTube URL or direct video file URL (mp4, webm, etc.)
                      </Form.Text>
                    </div>
                    <div className="mb-3">
                      <Form.Label className="mb-2">Option 2: Upload Video</Form.Label>
                      <VideoUploader
                        currentVideo={settings[field.key]}
                        onUpload={(url) => handleFieldChange(field.key, url)}
                      />
                      <Form.Text className="text-muted">
                        Upload a video file (mp4, webm, mov, etc.) - Max 50MB
                      </Form.Text>
                    </div>
                  </>
                ) : (
                  <>
                    <Form.Label>{field.label}</Form.Label>
                    {field.type === 'textarea' ? (
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={settings[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <Form.Control
                        type={field.type}
                        value={settings[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </>
                )}
              </Form.Group>
            ))}
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-3">
          <Card.Header>
            <h6 className="mb-0">{pageKey.charAt(0).toUpperCase() + pageKey.slice(1)} Page Settings</h6>
          </Card.Header>
          <Card.Body>
            {getPageSettings().map(field => (
              <Form.Group key={field.key} className="mb-3">
                <Form.Label>{field.label}</Form.Label>
                {field.type === 'textarea' ? (
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={settings[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <Form.Control
                    type={field.type}
                    value={settings[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </Form.Group>
            ))}
          </Card.Body>
        </Card>
      )}

      <div className="text-end">
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={saving}
          size="lg"
        >
          {saving ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </>
  );
};

export default SiteSettingsEditor;
