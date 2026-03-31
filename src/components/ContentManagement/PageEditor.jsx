'use client';

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Alert, Nav } from 'react-bootstrap';
import SectionEditor from './SectionEditor';
import PagePreviewFrame from './PagePreviewFrame';

const PageEditor = ({ pageId }) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content/pages');
      const data = await response.json();
      const foundPage = data.pages.find(p => p.id === pageId);
      if (foundPage) {
        setPage(foundPage);
        if (foundPage.sections?.length > 0) {
          setSelectedSectionId(foundPage.sections[0].id);
        }
      } else {
        setError('Page not found');
      }
    } catch (err) {
      setError('Failed to load page');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedSection = page?.sections?.find(section => section.id === selectedSectionId);

  const handleSectionUpdate = (updatedSection) => {
    setPage(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === updatedSection.id ? updatedSection : s
      )
    }));
  };

  const handleSectionRemove = (sectionId) => {
    if (confirm('Are you sure you want to remove this section?')) {
      setPage(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s.id !== sectionId)
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess(false);
      const response = await fetch('/api/content/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page)
      });
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to save page');
      }
    } catch (err) {
      setError('Failed to save page');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
          Page saved successfully!
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Horizontal Tabs for Sections */}
      {page?.sections && page.sections.length > 0 && (
        <div className="mb-4">
          <Nav variant="tabs" className="border-bottom">
            {page.sections.map(section => (
              <Nav.Item key={section.id}>
                <Nav.Link
                  active={selectedSectionId === section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="me-2">{section.name}</span>
                  <small className={section.visible ? 'text-success' : 'text-danger'}>
                    ({section.visible ? 'Visible' : 'Hidden'})
                  </small>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>
      )}

      <Row>
        <Col lg={6}>
          <Card className="mb-3">
            <Card.Header>
              <h6 className="mb-0">Page Screen Preview</h6>
            </Card.Header>
            <Card.Body>
              <PagePreviewFrame
                page={page}
                selectedSectionId={selectedSectionId}
                onSectionSelect={setSelectedSectionId}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          {selectedSection ? (
            <SectionEditor
              key={selectedSection.id}
              section={selectedSection}
              onUpdate={handleSectionUpdate}
              onRemove={handleSectionRemove}
            />
          ) : (
            <Alert variant="info" className="mb-0">
              Select a section to edit its content.
            </Alert>
          )}
        </Col>
      </Row>

      <Row className="mt-4">
        <Col className="text-end">
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={saving}
            size="lg"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PageEditor;
