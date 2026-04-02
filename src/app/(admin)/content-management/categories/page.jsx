'use client'

import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Card, Table, Modal, Form, Alert, Spinner } from 'react-bootstrap'

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', type: 'properties' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/content/categories')
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (err) {
      setError('Failed to load categories')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const initializeForm = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData(category)
    } else {
      setEditingCategory(null)
      setFormData({ name: '', description: '', type: 'properties' })
    }
    setShowModal(true)
  }

  const handleSaveCategory = async () => {
    try {
      setSaving(true)
      setSuccess(false)
      const response = await fetch('/api/content/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: formData,
          id: editingCategory?.id,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setShowModal(false)
        fetchCategories()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError('Failed to save category')
      }
    } catch (err) {
      setError('Failed to save category')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/content/categories?id=${categoryId}`, { method: 'DELETE' })

        if (response.ok) {
          fetchCategories()
          setSuccess(true)
          setTimeout(() => setSuccess(false), 3000)
        } else {
          setError('Failed to delete category')
        }
      } catch (err) {
        setError('Failed to delete category')
        console.error(err)
      }
    }
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading categories...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h3>Categories Management</h3>
          <p className="text-muted">Manage categories for properties, news, services, and portfolio</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => initializeForm()}>
            <i className="bi bi-plus-circle me-2"></i>
            Add New Category
          </Button>
        </Col>
      </Row>

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
          Category saved successfully!
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <Card.Body>
          {categories.length === 0 ? (
            <p className="text-muted text-center py-4">No categories yet. Add one to get started!</p>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <strong>{category.name}</strong>
                      </td>
                      <td>{category.description || '-'}</td>
                      <td>
                        <span
                          className={`badge ${
                            category.type === 'properties'
                              ? 'bg-primary'
                              : category.type === 'news'
                                ? 'bg-info'
                                : category.type === 'services'
                                  ? 'bg-success'
                                  : 'bg-warning'
                          }`}>
                          {category.type}
                        </span>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => initializeForm(category)}>
                          Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCategory(category.id)}>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} size="md" centered backdrop="static">
        <Modal.Header
          closeButton
          closeVariant="white"
          className="border-0"
          style={{
            background: 'linear-gradient(135deg, #1a6a61 0%, #155550 100%)',
            color: '#ffffff',
            padding: '1.5rem 2rem',
          }}>
          <Modal.Title className="d-flex align-items-center gap-2 mb-0" style={{ color: '#ffffff' }}>
            <i className={`bi ${editingCategory ? 'bi-pencil-square' : 'bi-plus-circle'} fs-4`}></i>
            <span className="fw-bold">{editingCategory ? 'Edit Category' : 'Add New Category'}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: '1.5rem' }}>
          <Form>
            <Card className="mb-3 border-0 shadow-sm">
              <Card.Body className="p-3">
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold mb-2">
                        Category Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        placeholder="Enter category name"
                        className="form-control-lg"
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e9ecef',
                          padding: '0.75rem 1rem',
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold mb-2">Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        placeholder="Provide a description..."
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e9ecef',
                          padding: '0.75rem 1rem',
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold mb-2">Type</Form.Label>
                      <Form.Select
                        value={formData.type || 'properties'}
                        onChange={(e) => handleFormChange('type', e.target.value)}
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e9ecef',
                          padding: '0.75rem 1rem',
                        }}>
                        <option value="properties">Properties</option>
                        <option value="news">News</option>
                        <option value="services">Services</option>
                        <option value="portfolio">Portfolio</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Form>
        </Modal.Body>

        <Modal.Footer
          className="border-0"
          style={{
            padding: '1rem 1.5rem',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
            backgroundColor: 'transparent',
          }}>
          <Button
            variant="light"
            onClick={() => setShowModal(false)}
            className="px-4 py-2"
            style={{
              borderRadius: '8px',
              fontWeight: '500',
            }}>
            <i className="bi bi-x-lg me-2"></i>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveCategory}
            disabled={saving}
            className="px-4 py-2"
            style={{
              borderRadius: '8px',
              fontWeight: '500',
              background: 'linear-gradient(135deg, #1a6a61 0%, #155550 100%)',
              border: 'none',
            }}>
            {saving ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-2"></i>
                Save Category
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default CategoriesPage
