'use client'

import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Button, Table, Modal, Form, Badge, Alert } from 'react-bootstrap'

const FormOptionsManager = () => {
  const [formOptions, setFormOptions] = useState({
    locations: [],
    propertyTypes: [],
    objectives: []
  })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingOption, setEditingOption] = useState(null)
  const [currentType, setCurrentType] = useState('')
  const [formData, setFormData] = useState({ label: '', value: '', active: true })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const typeLabels = {
    locations: 'Locations',
    propertyTypes: 'Property Types',
    objectives: 'Objectives'
  }

  const typeIcons = {
    locations: 'bi-geo-alt',
    propertyTypes: 'bi-building',
    objectives: 'bi-bullseye'
  }

  useEffect(() => {
    fetchFormOptions()
  }, [])

  const fetchFormOptions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/form-options?includeInactive=true')
      const data = await response.json()
      setFormOptions(data)
    } catch (err) {
      setError('Failed to load form options')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = (type) => {
    setCurrentType(type)
    setEditingOption(null)
    setFormData({ label: '', value: '', active: true })
    setShowModal(true)
  }

  const handleEdit = (type, option) => {
    setCurrentType(type)
    setEditingOption(option)
    setFormData({
      label: option.label,
      value: option.value,
      active: option.active
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.label || !formData.value) {
      setError('Label and value are required')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const response = await fetch('/api/form-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: currentType,
          option: formData,
          id: editingOption?.id
        })
      })

      if (response.ok) {
        setSuccess(true)
        setShowModal(false)
        fetchFormOptions()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError('Failed to save option')
      }
    } catch (err) {
      setError('Failed to save option')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this option?')) return

    try {
      const response = await fetch('/api/form-options', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id })
      })

      if (response.ok) {
        setSuccess(true)
        fetchFormOptions()
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError('Failed to delete option')
      }
    } catch (err) {
      setError('Failed to delete option')
      console.error(err)
    }
  }

  const renderOptionsTable = (type, options) => (
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
          <i className={`${typeIcons[type]} me-2 fs-5`}></i>
          {typeLabels[type]}
        </h5>
        <Button 
          variant="light" 
          size="sm" 
          onClick={() => handleAddNew(type)}
          style={{
            borderRadius: '6px',
            fontWeight: '500',
            padding: '0.5rem 1rem'
          }}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Add New
        </Button>
      </Card.Header>
      <Card.Body style={{ padding: '1.5rem' }}>
        {options.length === 0 ? (
          <p className="text-muted text-center py-3">No options available. Click "Add New" to create one.</p>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Label</th>
                <th>Value</th>
                <th>Status</th>
                <th>Order</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {options
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((option) => (
                  <tr key={option.id}>
                    <td className="fw-semibold">{option.label}</td>
                    <td>
                      <code className="text-muted">{option.value}</code>
                    </td>
                    <td>
                      {option.active ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="secondary">Inactive</Badge>
                      )}
                    </td>
                    <td>{option.order || '-'}</td>
                    <td className="text-end">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(type, option)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(type, option.id)}
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
                <i className="bi bi-sliders me-2"></i>
                Form Options Management
              </h2>
              <p className="text-muted mb-0">
                Manage dropdown options for "Choose your location", "Select property type", and "Set your objective" sections
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
          Option saved successfully!
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Row>
        <Col md={12}>
          {renderOptionsTable('locations', formOptions.locations)}
        </Col>
        <Col md={12}>
          {renderOptionsTable('propertyTypes', formOptions.propertyTypes)}
        </Col>
        <Col md={12}>
          {renderOptionsTable('objectives', formOptions.objectives)}
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
            <i className={`bi ${editingOption ? 'bi-pencil-square' : 'bi-plus-circle'} fs-4`}></i>
            <span className="fw-bold">
              {editingOption ? 'Edit' : 'Add'} {typeLabels[currentType]} Option
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '1.5rem' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Label <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Riyadh"
              />
              <Form.Text className="text-muted">
                This is what users will see in the dropdown
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Value <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="e.g., riyadh"
              />
              <Form.Text className="text-muted">
                Internal value (use lowercase with hyphens)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="active-switch"
                label="Active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              <Form.Text className="text-muted">
                Only active options will appear in the dropdown
              </Form.Text>
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
                Save Option
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default FormOptionsManager
