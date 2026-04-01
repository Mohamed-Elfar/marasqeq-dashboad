'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Container, Row, Col, Button, Card, Spinner, Alert, Modal, Form, Table } from 'react-bootstrap'
import ImageUploader from './ImageUploader'

const ContentItemManager = ({ itemType }) => {
  const searchParams = useSearchParams()
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchItems()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (searchParams?.get('new') === 'true') {
      initializeForm()
    }
  }, [searchParams])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/content/items?type=${itemType}`)
      const data = await response.json()
      const items = data[itemType] || []

      // Sort by date (newest first)
      const sortedItems = items.sort((a, b) => {
        const dateA = new Date(a.date || 0)
        const dateB = new Date(b.date || 0)
        return dateB - dateA
      })

      setItems(sortedItems)
    } catch (err) {
      setError('Failed to load items')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/content/categories?type=${itemType}`)
      const data = await response.json()
      setCategories(data.categories || [])
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  const initializeForm = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData(item)
    } else {
      setEditingItem(null)
      setFormData({
        title: '',
        description: '',
        fullDescription: '',
        shortDescription: '',
        image: '',
        videoUrl: '',
        category: '',
        type: '',
        tag: [],
        author: {
          name: '',
          img: '',
          description: '',
        },
        comments: 0,
        views: 0,
        status: 'published',
        featured: false,
        new: true,
        visible: true,
        date: new Date().toISOString().split('T')[0],
        extraInformation: [],
        extraInformationList: [],
        blockquote: {
          quoteTitle: '',
          name: '',
        },
        extraContent: {
          title: '',
          description1: '',
          description2: '',
          description3: '',
          description4: '',
          caption: {
            img1: '',
            img2: '',
            imageCaption: '',
            imageCaptionDetails: '',
          },
        },
      })
    }
    setShowModal(true)
  }

  const handleSaveItem = async () => {
    // Set default image for news if not provided
    if (itemType === 'news' && !formData.image) {
      formData.image = '/img/default-avatar.png'
    }

    // Validate required fields
    const requiredFields = ['title', 'fullDescription', 'shortDescription', 'category', 'type']

    if (itemType === 'properties') {
      requiredFields.push('price', 'location', 'bedrooms', 'bathrooms', 'area', 'image')
    } else if (itemType === 'news') {
      requiredFields.push('author.name')
    }

    const missingFields = requiredFields.filter((field) => {
      const value = field.split('.').reduce((obj, key) => obj && obj[key], formData)
      return !value || value === ''
    })

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    try {
      setSaving(true)
      setSuccess(false)
      const response = await fetch('/api/content/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: itemType,
          item: formData,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setShowModal(false)
        fetchItems()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError('Failed to save item')
      }
    } catch (err) {
      setError('Failed to save item')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/content/items?type=${itemType}&id=${itemId}`, { method: 'DELETE' })

        if (response.ok) {
          fetchItems()
          setSuccess(true)
          setTimeout(() => setSuccess(false), 3000)
        } else {
          setError('Failed to delete item')
        }
      } catch (err) {
        setError('Failed to delete item')
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
          <p className="mt-3 text-muted">Loading...</p>
        </div>
      </Container>
    )
  }

  const title = itemType === 'properties' ? 'Properties Management' : 'News Management'
  const itemLabel = itemType === 'properties' ? 'Property' : 'News'

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
            <p className="text-muted text-center py-4">No {itemType} yet. Add one to get started!</p>
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
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.title}</strong>
                        <br />
                        <small className="text-muted">{item.description?.substring(0, 50)}...</small>
                      </td>
                      <td>{item.category || '-'}</td>
                      <td>{item.date || '-'}</td>
                      <td>
                        {item.featured ? <span className="badge bg-success">Featured</span> : <span className="badge bg-secondary">Normal</span>}
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => initializeForm(item)}>
                          Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteItem(item.id)}>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered backdrop="static" className="modern-modal">
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
            <i className={`bi ${editingItem ? 'bi-pencil-square' : 'bi-plus-circle'} fs-4`}></i>
            <span className="fw-bold">{editingItem ? `Edit ${itemLabel}` : `Add New ${itemLabel}`}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            background: '#f8f9fa',
            maxHeight: '70vh',
            overflowY: 'auto',
            padding: '2rem',
          }}>
          <Form>
            {/* Basic Information Section */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body className="p-4">
                <h6 className="text-uppercase text-muted mb-3 fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <i className="bi bi-info-circle me-2"></i>
                  Basic Information
                </h6>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold mb-2">
                        Title <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        placeholder={`Enter ${itemLabel.toLowerCase()} title`}
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
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold mb-2">
                        Short Description <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={formData.shortDescription || ''}
                        onChange={(e) => handleFormChange('shortDescription', e.target.value)}
                        placeholder="Brief summary for listings..."
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
                        Full Description <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        value={formData.fullDescription || ''}
                        onChange={(e) => handleFormChange('fullDescription', e.target.value)}
                        placeholder="Complete article content..."
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e9ecef',
                          padding: '0.75rem 1rem',
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold mb-2">
                        Category <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        value={formData.category || ''}
                        onChange={(e) => handleFormChange('category', e.target.value)}
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e9ecef',
                          padding: '0.75rem 1rem',
                        }}>
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold mb-2">
                        Type <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        value={formData.type || ''}
                        onChange={(e) => handleFormChange('type', e.target.value)}
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e9ecef',
                          padding: '0.75rem 1rem',
                        }}>
                        <option value="">Select type</option>
                        <option value="REAL ESTATE">Real Estate</option>
                        <option value="BUSINESS">Business</option>
                        <option value="NEWS">News</option>
                        <option value="TRENDS">Trends</option>
                        <option value="GUIDE">Guide</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold mb-2">
                        Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.date || ''}
                        onChange={(e) => handleFormChange('date', e.target.value)}
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e9ecef',
                          padding: '0.75rem 1rem',
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Media Section */}
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body className="p-4">
                <h6 className="text-uppercase text-muted mb-3 fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <i className="bi bi-image me-2"></i>
                  Media
                </h6>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold mb-2">
                        Image{' '}
                        {itemType === 'properties' ? <span className="text-danger">*</span> : <span className="text-muted small">(optional)</span>}
                      </Form.Label>
                      <ImageUploader currentImage={formData.image} onUpload={(url) => handleFormChange('image', url)} />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold mb-2">
                        Video URL <span className="text-muted small">(optional)</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.videoUrl || ''}
                        onChange={(e) => handleFormChange('videoUrl', e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e9ecef',
                          padding: '0.75rem 1rem',
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Author Section (for news only) */}
            {itemType === 'news' && (
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h6 className="text-uppercase text-muted mb-3 fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                    <i className="bi bi-person-circle me-2"></i>
                    Author Information
                  </h6>

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-2">
                          Author Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.author?.name || ''}
                          onChange={(e) => handleFormChange('author.name', e.target.value)}
                          placeholder="Enter author name"
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
                        <Form.Label className="fw-semibold mb-2">Author Image</Form.Label>
                        <ImageUploader currentImage={formData.author?.img} onUpload={(url) => handleFormChange('author.img', url)} />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-2">Author Bio</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={formData.author?.description || ''}
                          onChange={(e) => handleFormChange('author.description', e.target.value)}
                          placeholder="Brief author biography..."
                          style={{
                            borderRadius: '8px',
                            border: '2px solid #e9ecef',
                            padding: '0.75rem 1rem',
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* News Details Section (for news only) */}
            {itemType === 'news' && (
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h6 className="text-uppercase text-muted mb-3 fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                    <i className="bi bi-newspaper me-2"></i>
                    News Details
                  </h6>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-2">Comments Count</Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.comments || 0}
                          onChange={(e) => handleFormChange('comments', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          style={{
                            borderRadius: '8px',
                            border: '2px solid #e9ecef',
                            padding: '0.75rem 1rem',
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-2">Views Count</Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.views || 0}
                          onChange={(e) => handleFormChange('views', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          style={{
                            borderRadius: '8px',
                            border: '2px solid #e9ecef',
                            padding: '0.75rem 1rem',
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}
            {itemType === 'properties' && (
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h6 className="text-uppercase text-muted mb-3 fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                    <i className="bi bi-house-door me-2"></i>
                    Property Details
                  </h6>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-2">
                          Price <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.price || ''}
                          onChange={(e) => handleFormChange('price', e.target.value)}
                          placeholder="0.00"
                          style={{
                            borderRadius: '8px',
                            border: '2px solid #e9ecef',
                            padding: '0.75rem 1rem',
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-2">
                          Location <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.location || ''}
                          onChange={(e) => handleFormChange('location', e.target.value)}
                          placeholder="City, Country"
                          style={{
                            borderRadius: '8px',
                            border: '2px solid #e9ecef',
                            padding: '0.75rem 1rem',
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-2">
                          <i className="bi bi-door-closed me-1"></i> Bedrooms <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.bedrooms || ''}
                          onChange={(e) => handleFormChange('bedrooms', e.target.value)}
                          placeholder="0"
                          style={{
                            borderRadius: '8px',
                            border: '2px solid #e9ecef',
                            padding: '0.75rem 1rem',
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-2">
                          <i className="bi bi-droplet me-1"></i> Bathrooms <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.bathrooms || ''}
                          onChange={(e) => handleFormChange('bathrooms', e.target.value)}
                          placeholder="0"
                          style={{
                            borderRadius: '8px',
                            border: '2px solid #e9ecef',
                            padding: '0.75rem 1rem',
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold mb-2">
                          <i className="bi bi-rulers me-1"></i> Area (sqm) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.area || ''}
                          onChange={(e) => handleFormChange('area', e.target.value)}
                          placeholder="0"
                          style={{
                            borderRadius: '8px',
                            border: '2px solid #e9ecef',
                            padding: '0.75rem 1rem',
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* Settings Section */}
            <Card className="mb-0 border-0 shadow-sm">
              <Card.Body className="p-4">
                <h6 className="text-uppercase text-muted mb-3 fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </h6>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold mb-2">Status</Form.Label>
                      <Form.Select
                        value={formData.status || 'published'}
                        onChange={(e) => handleFormChange('status', e.target.value)}
                        style={{
                          borderRadius: '8px',
                          border: '2px solid #e9ecef',
                          padding: '0.75rem 1rem',
                        }}>
                        <option value="published">✓ Published</option>
                        <option value="draft">📝 Draft</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <div className="d-flex gap-4">
                      <Form.Group className="mb-0">
                        <Form.Check
                          type="switch"
                          id="featured-switch"
                          label={
                            <span className="fw-semibold">
                              <i className="bi bi-star-fill text-warning me-2"></i>
                              Mark as Featured
                            </span>
                          }
                          checked={formData.featured || false}
                          onChange={(e) => handleFormChange('featured', e.target.checked)}
                          className="fs-6"
                        />
                      </Form.Group>

                      <Form.Group className="mb-0">
                        <Form.Check
                          type="switch"
                          id="visible-switch"
                          label={
                            <span className="fw-semibold">
                              <i className="bi bi-eye-fill text-primary me-2"></i>
                              Visible on Website
                            </span>
                          }
                          checked={formData.visible !== false}
                          onChange={(e) => handleFormChange('visible', e.target.checked)}
                          className="fs-6"
                        />
                      </Form.Group>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Form>
        </Modal.Body>

        <Modal.Footer
          className="border-0"
          style={{
            background: '#ffffff',
            padding: '1.5rem 2rem',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
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
            onClick={handleSaveItem}
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
                Save {itemLabel}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ContentItemManager
