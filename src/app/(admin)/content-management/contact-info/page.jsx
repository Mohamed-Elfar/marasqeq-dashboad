'use client'

import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Button, Table, Modal, Form, Badge, Alert } from 'react-bootstrap'

const ContactInfoManager = () => {
  const [contactInfo, setContactInfo] = useState({
    emails: [],
    phones: [],
    addresses: []
  })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [currentType, setCurrentType] = useState('')
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const typeLabels = {
    emails: 'Email Addresses',
    phones: 'Phone Numbers',
    addresses: 'Office Addresses'
  }

  const typeIcons = {
    emails: 'bi-envelope',
    phones: 'bi-telephone',
    addresses: 'bi-geo-alt'
  }

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contact-info')
      const data = await response.json()
      setContactInfo(data)
    } catch (err) {
      setError('Failed to load contact information')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = (type) => {
    setCurrentType(type)
    setEditingItem(null)
    
    if (type === 'emails') {
      setFormData({ email: '', label: '', visible: true })
    } else if (type === 'phones') {
      setFormData({ phone: '', label: '', visible: true })
    } else if (type === 'addresses') {
      setFormData({ line1: '', line2: '', label: '', visible: true })
    }
    
    setShowModal(true)
  }

  const handleEdit = (type, item) => {
    setCurrentType(type)
    setEditingItem(item)
    setFormData({ ...item })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (currentType === 'emails' && !formData.email) {
      setError('Email is required')
      return
    }
    if (currentType === 'phones' && !formData.phone) {
      setError('Phone number is required')
      return
    }
    if (currentType === 'addresses' && !formData.line1) {
      setError('Address line 1 is required')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const response = await fetch('/api/contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: currentType,
          item: formData,
          id: editingItem?.id
        })
      })

      if (response.ok) {
        setSuccess(true)
        setShowModal(false)
        fetchContactInfo()
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

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch('/api/contact-info', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id })
      })

      if (response.ok) {
        setSuccess(true)
        fetchContactInfo()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError('Failed to delete item')
      }
    } catch (err) {
      setError('Failed to delete item')
      console.error(err)
    }
  }

  const toggleVisibility = async (type, item) => {
    try {
      const response = await fetch('/api/contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          item: { ...item, visible: !item.visible },
          id: item.id
        })
      })

      if (response.ok) {
        fetchContactInfo()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const renderEmailsTable = () => (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Header 
        className="d-flex justify-content-between align-items-center border-0"
        style={{
          background: 'linear-gradient(135deg, #1a6a61 0%, #155550 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem'
        }}
      >
        <h5 className="mb-0 d-flex align-items-center" style={{ color: '#ffffff' }}>
          <i className="bi-envelope me-2 fs-5"></i>
          Email Addresses
        </h5>
        <Button 
          variant="light" 
          size="sm" 
          onClick={() => handleAddNew('emails')}
          style={{
            borderRadius: '6px',
            fontWeight: '500',
            padding: '0.5rem 1rem'
          }}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Add Email
        </Button>
      </Card.Header>
      <Card.Body style={{ padding: '1.5rem' }}>
        {contactInfo.emails.length === 0 ? (
          <p className="text-muted text-center py-3">No email addresses. Click "Add Email" to create one.</p>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>Label</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactInfo.emails
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item) => (
                  <tr key={item.id}>
                    <td className="fw-semibold">
                      <i className="bi bi-envelope me-2 text-muted"></i>
                      {item.email}
                    </td>
                    <td>{item.label || '-'}</td>
                    <td>
                      <Badge 
                        bg={item.visible ? 'success' : 'secondary'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleVisibility('emails', item)}
                      >
                        {item.visible ? 'Visible' : 'Hidden'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit('emails', item)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete('emails', item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )

  const renderPhonesTable = () => (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Header 
        className="d-flex justify-content-between align-items-center border-0"
        style={{
          background: 'linear-gradient(135deg, #1a6a61 0%, #155550 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem'
        }}
      >
        <h5 className="mb-0 d-flex align-items-center" style={{ color: '#ffffff' }}>
          <i className="bi-telephone me-2 fs-5"></i>
          Phone Numbers
        </h5>
        <Button 
          variant="light" 
          size="sm" 
          onClick={() => handleAddNew('phones')}
          style={{
            borderRadius: '6px',
            fontWeight: '500',
            padding: '0.5rem 1rem'
          }}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Add Phone
        </Button>
      </Card.Header>
      <Card.Body style={{ padding: '1.5rem' }}>
        {contactInfo.phones.length === 0 ? (
          <p className="text-muted text-center py-3">No phone numbers. Click "Add Phone" to create one.</p>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Phone Number</th>
                <th>Label</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactInfo.phones
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item) => (
                  <tr key={item.id}>
                    <td className="fw-semibold">
                      <i className="bi bi-telephone me-2 text-muted"></i>
                      {item.phone}
                    </td>
                    <td>{item.label || '-'}</td>
                    <td>
                      <Badge 
                        bg={item.visible ? 'success' : 'secondary'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleVisibility('phones', item)}
                      >
                        {item.visible ? 'Visible' : 'Hidden'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit('phones', item)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete('phones', item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )

  const renderAddressesTable = () => (
    <Card className="mb-4 border-0 shadow-sm">
      <Card.Header 
        className="d-flex justify-content-between align-items-center border-0"
        style={{
          background: 'linear-gradient(135deg, #1a6a61 0%, #155550 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem'
        }}
      >
        <h5 className="mb-0 d-flex align-items-center" style={{ color: '#ffffff' }}>
          <i className="bi-geo-alt me-2 fs-5"></i>
          Office Addresses
        </h5>
        <Button 
          variant="light" 
          size="sm" 
          onClick={() => handleAddNew('addresses')}
          style={{
            borderRadius: '6px',
            fontWeight: '500',
            padding: '0.5rem 1rem'
          }}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Add Address
        </Button>
      </Card.Header>
      <Card.Body style={{ padding: '1.5rem' }}>
        {contactInfo.addresses.length === 0 ? (
          <p className="text-muted text-center py-3">No addresses. Click "Add Address" to create one.</p>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Address</th>
                <th>Label</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactInfo.addresses
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item) => (
                  <tr key={item.id}>
                    <td className="fw-semibold">
                      <i className="bi bi-geo-alt me-2 text-muted"></i>
                      {item.line1}
                      {item.line2 && <><br /><small className="text-muted">{item.line2}</small></>}
                    </td>
                    <td>{item.label || '-'}</td>
                    <td>
                      <Badge 
                        bg={item.visible ? 'success' : 'secondary'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleVisibility('addresses', item)}
                      >
                        {item.visible ? 'Visible' : 'Hidden'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit('addresses', item)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete('addresses', item.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#1a6a61' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-2 fw-bold" style={{ color: '#1a6a61' }}>
                <i className="bi bi-info-circle me-2"></i>
                Contact Information Management
              </h2>
              <p className="text-muted mb-0">
                Manage email addresses, phone numbers, and office addresses displayed on the contact page
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
          Changes saved successfully!
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row>
        <Col md={12}>
          {renderEmailsTable()}
        </Col>
        <Col md={12}>
          {renderPhonesTable()}
        </Col>
        <Col md={12}>
          {renderAddressesTable()}
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="md" centered backdrop="static">
        <Modal.Header 
          closeButton 
          closeVariant="white"
          className="border-0"
          style={{
            background: 'linear-gradient(135deg, #1a6a61 0%, #155550 100%)',
            color: '#ffffff',
            padding: '1.5rem 2rem'
          }}
        >
          <Modal.Title className="d-flex align-items-center gap-2 mb-0" style={{ color: '#ffffff' }}>
            <i className={`bi ${editingItem ? 'bi-pencil-square' : 'bi-plus-circle'} fs-4`}></i>
            <span className="fw-bold">
              {editingItem ? 'Edit' : 'Add'} {typeLabels[currentType]}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '1.5rem' }}>
          <Form>
            {currentType === 'emails' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., info@maraseqgroup.com"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Label</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.label || ''}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., General Inquiries"
                  />
                </Form.Group>
              </>
            )}

            {currentType === 'phones' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Phone Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., +201102223231"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Label</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.label || ''}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Main Office"
                  />
                </Form.Group>
              </>
            )}

            {currentType === 'addresses' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Address Line 1 <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.line1 || ''}
                    onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                    placeholder="e.g., Qutur, Tanta"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.line2 || ''}
                    onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                    placeholder="e.g., Gharbia Governorate, Egypt"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Label</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.label || ''}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="e.g., Main Office"
                  />
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="visible-switch"
                label="Visible on website"
                checked={formData.visible !== false}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer 
          className="border-0"
          style={{
            padding: '1rem 1.5rem',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
            backgroundColor: 'transparent'
          }}
        >
          <Button 
            variant="light" 
            onClick={() => setShowModal(false)}
            className="px-4 py-2"
            style={{
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            <i className="bi bi-x-lg me-2"></i>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            disabled={saving}
            className="px-4 py-2"
            style={{
              borderRadius: '8px',
              fontWeight: '500',
              background: 'linear-gradient(135deg, #1a6a61 0%, #155550 100%)',
              border: 'none'
            }}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-2"></i>
                Save
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ContactInfoManager
