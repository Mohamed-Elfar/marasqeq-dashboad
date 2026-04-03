import React, { useState } from 'react'
import { Modal, Button, Spinner, Tabs, Tab } from 'react-bootstrap'
import ItemManagerForm from './ItemManagerForm'

const ItemManagerModal = ({ show, onHide, editingItem, formData, itemType, categories, onFormChange, onSave, saving }) => {
  const [activeTab, setActiveTab] = useState('basic')

  const getTabTitle = (key) => {
    const icons = {
      basic: 'bi-info-circle',
      category: 'bi-tags',
      media: 'bi-image',
      specific: 'bi-gear',
      author: 'bi-person-circle',
      settings: 'bi-sliders'
    }
    
    const titles = {
      basic: 'Basic Info',
      category: 'Category',
      media: 'Media',
      specific: 'Details',
      author: 'Author',
      settings: 'Settings'
    }

    return (
      <>
        <i className={`bi ${icons[key]} me-2`}></i>
        {titles[key]}
      </>
    )
  }

  const shouldShowTab = (tabKey) => {
    switch (tabKey) {
      case 'basic':
      case 'category':
      case 'settings':
        return true
      case 'media':
        return !['social', 'faq'].includes(itemType)
      case 'specific':
        return ['properties', 'news', 'services', 'portfolio'].includes(itemType)
      case 'author':
        return itemType === 'news'
      default:
        return false
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      dialogClassName="item-manager-modal">
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
          <span className="fw-bold">
            {editingItem
              ? `Edit ${itemType.charAt(0).toUpperCase() + itemType.slice(1, -1)}`
              : `Add New ${itemType.charAt(0).toUpperCase() + itemType.slice(1, -1)}`}
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: '0' }}>
        <style>{`
          .item-manager-modal .modal-content {
            max-height: 84vh;
          }
          .item-manager-modal .modal-body {
            overflow-y: auto;
          }
          .custom-tabs .nav-tabs {
            border-bottom: 2px solid #e9ecef;
            background: #ffffff;
            padding: 0 2rem;
            margin: 0;
          }
          .custom-tabs .nav-link {
            border: none;
            color: #6c757d;
            font-weight: 500;
            padding: 1rem 1.5rem;
            margin-right: 0.25rem;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
            background: transparent;
            border-radius: 0;
          }
          .custom-tabs .nav-link:hover {
            color: #1a6a61;
            background: rgba(26, 106, 97, 0.05);
            border-color: transparent;
          }
          .custom-tabs .nav-link.active {
            color: #1a6a61;
            background: transparent;
            border-bottom: 3px solid #1a6a61;
            font-weight: 600;
          }
          .custom-tabs .nav-link i {
            font-size: 1rem;
          }
          .custom-tabs .tab-content {
            background: #ffffff;
            min-height: 400px;
          }
          .item-manager-modal .custom-tabs .tab-content {
            min-height: 300px;
          }
        `}</style>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="custom-tabs border-0">
          {shouldShowTab('basic') && (
            <Tab eventKey="basic" title={getTabTitle('basic')}>
              <div style={{ padding: '1.5rem' }}>
                <ItemManagerForm
                  formData={formData}
                  itemType={itemType}
                  categories={categories}
                  onFormChange={onFormChange}
                  onSave={onSave}
                  onCancel={onHide}
                  saving={saving}
                  section="basic"
                />
              </div>
            </Tab>
          )}

          {shouldShowTab('category') && (
            <Tab eventKey="category" title={getTabTitle('category')}>
              <div style={{ padding: '1.5rem' }}>
                <ItemManagerForm
                  formData={formData}
                  itemType={itemType}
                  categories={categories}
                  onFormChange={onFormChange}
                  onSave={onSave}
                  onCancel={onHide}
                  saving={saving}
                  section="category"
                />
              </div>
            </Tab>
          )}

          {shouldShowTab('media') && (
            <Tab eventKey="media" title={getTabTitle('media')}>
              <div style={{ padding: '1.5rem' }}>
                <ItemManagerForm
                  formData={formData}
                  itemType={itemType}
                  categories={categories}
                  onFormChange={onFormChange}
                  onSave={onSave}
                  onCancel={onHide}
                  saving={saving}
                  section="media"
                />
              </div>
            </Tab>
          )}

          {shouldShowTab('specific') && (
            <Tab eventKey="specific" title={getTabTitle('specific')}>
              <div style={{ padding: '1.5rem' }}>
                <ItemManagerForm
                  formData={formData}
                  itemType={itemType}
                  categories={categories}
                  onFormChange={onFormChange}
                  onSave={onSave}
                  onCancel={onHide}
                  saving={saving}
                  section="specific"
                />
              </div>
            </Tab>
          )}

          {shouldShowTab('author') && (
            <Tab eventKey="author" title={getTabTitle('author')}>
              <div style={{ padding: '1.5rem' }}>
                <ItemManagerForm
                  formData={formData}
                  itemType={itemType}
                  categories={categories}
                  onFormChange={onFormChange}
                  onSave={onSave}
                  onCancel={onHide}
                  saving={saving}
                  section="author"
                />
              </div>
            </Tab>
          )}

          {shouldShowTab('settings') && (
            <Tab eventKey="settings" title={getTabTitle('settings')}>
              <div style={{ padding: '1.5rem' }}>
                <ItemManagerForm
                  formData={formData}
                  itemType={itemType}
                  categories={categories}
                  onFormChange={onFormChange}
                  onSave={onSave}
                  onCancel={onHide}
                  saving={saving}
                  section="settings"
                />
              </div>
            </Tab>
          )}
        </Tabs>
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
          onClick={onHide}
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
          onClick={onSave}
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
              Save {itemType.charAt(0).toUpperCase() + itemType.slice(1, -1)}
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ItemManagerModal
