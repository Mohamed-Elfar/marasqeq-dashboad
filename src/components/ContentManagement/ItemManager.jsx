'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Spinner,
  Alert,
  Modal,
  Form,
  Table
} from 'react-bootstrap';
import ImageUploader from './ImageUploader';

const ItemManager = ({ itemType }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/content/items?type=${itemType}`);
      const data = await response.json();
      setItems(data[itemType] || []);
    } catch (err) {
      setError('Failed to load items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initializeForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        image: '',
        videoUrl: '',
        price: '',
        location: '',
        category: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        status: 'published',
        featured: false,
        visible: true,
        date: new Date().toISOString().split('T')[0]
      });
    }
    setShowModal(true);
  };

  const handleSaveItem = async () => {
    try {
      setSaving(true);
      setSuccess(false);
      const response = await fetch('/api/content/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: itemType,
          item: formData
        })
      });

      if (response.ok) {
        setSuccess(true);
        setShowModal(false);
        fetchItems();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to save item');
      }
    } catch (err) {
      setError('Failed to save item');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(
          `/api/content/items?type=${itemType}&id=${itemId}`,
          { method: 'DELETE' }
        );

        if (response.ok) {
          fetchItems();
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError('Failed to delete item');
        }
      } catch (err) {
        setError('Failed to delete item');
        console.error(err);
      }
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const title = itemType === 'properties' ? 'Properties Management' : 'News & Blog Management';
  const itemLabel = itemType === 'properties' ? 'Property' : 'News Article';

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

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h3>{title}</h3>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => initializeForm()}>
            Add New {itemLabel}
          </Button>
        </Col>
      </Row>

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
          {itemLabel} saved successfully!
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <Card.Body>
          {items.length === 0 ? (
            <p className="text-muted text-center py-4">
              No {itemType} yet. Add one to get started!
            </p>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.title}</strong>
                        <br />
                        <small className="text-muted">
                          {item.description?.substring(0, 50)}...
                        </small>
                      </td>
                      <td>{item.category || '-'}</td>
                      <td>{item.date || '-'}</td>
                      <td>
                        {item.featured ? (
                          <span className="badge bg-success">Featured</span>
                        ) : (
                          <span className="badge bg-secondary">Normal</span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => initializeForm(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingItem ? `Edit ${itemLabel}` : `Add New ${itemLabel}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleFormChange('title', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.description || ''}
                onChange={(e) => handleFormChange('description', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <ImageUploader
                currentImage={formData.image}
                onUpload={(url) => handleFormChange('image', url)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Video URL (optional)</Form.Label>
              <Form.Control
                type="text"
                value={formData.videoUrl || ''}
                onChange={(e) => handleFormChange('videoUrl', e.target.value)}
                placeholder="https://..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={formData.category || ''}
                onChange={(e) => handleFormChange('category', e.target.value)}
                placeholder="e.g., Residential, Commercial"
              />
            </Form.Group>

            {itemType === 'properties' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => handleFormChange('price', e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => handleFormChange('location', e.target.value)}
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bedrooms</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.bedrooms || ''}
                        onChange={(e) => handleFormChange('bedrooms', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bathrooms</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.bathrooms || ''}
                        onChange={(e) => handleFormChange('bathrooms', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Area (sqm)</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.area || ''}
                        onChange={(e) => handleFormChange('area', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status || 'published'}
                onChange={(e) => handleFormChange('status', e.target.value)}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date || ''}
                onChange={(e) => handleFormChange('date', e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Mark as Featured"
                checked={formData.featured || false}
                onChange={(e) => handleFormChange('featured', e.target.checked)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Visible on website"
                checked={formData.visible !== false}
                onChange={(e) => handleFormChange('visible', e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveItem}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ItemManager;
