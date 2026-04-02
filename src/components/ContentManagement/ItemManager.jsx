'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Alert } from 'react-bootstrap'
import { ItemManagerHeader, ItemManagerList, ItemManagerModal } from './_components/ItemManager'

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
      if (itemType === 'portfolio') {
        setFormData({
          title: '',
          designation: '',
          shortDescription: '',
          fullDescription: '',
          thumbImage: '',
          img: '',
          id: '',
          carousel: false,
          active: false,
          category: [],
          filter: '',
          featured: false,
          captions: {
            image1: '',
            image2: '',
            caption: '',
            captionFullDescription: '',
            captionShortDescription: '',
          },
          reviews: [],
        })
      } else if (itemType === 'faq') {
        setFormData({
          question: '',
          answer: '',
          category: 'general',
          active: true,
          order: 1,
        })
      } else if (itemType === 'social') {
        setFormData({
          name: '',
          icon: 'FaFacebookF',
          url: '',
          position: 'both',
          active: true,
          order: 1,
        })
      } else {
        setFormData({
          title: '',
          shortDescription: '',
          fullDescription: '',
          thumbImage: '',
          img: '',
          icon: '',
          category: [],
          buttonText: 'Explore Path',
          active: false,
          featured: false,
          coreFeature: false,
          captions: {
            image1: '',
            image2: '',
            caption: '',
            captionFullDescription: '',
            captionShortDescription: '',
          },
        })
      }
    }
    setShowModal(true)
  }

  const handleFormChange = (field, value) => {
    setFormData((prev) => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }
      }
      return {
        ...prev,
        [field]: value,
      }
    })
  }

  const handleSaveItem = async () => {
    // Set default image for news if not provided
    if (itemType === 'news' && !formData.image) {
      formData.image = '/img/default-avatar.png'
    }

    // Validate required fields
    let requiredFields = []

    if (itemType === 'properties') {
      requiredFields = ['title', 'description', 'category', 'date', 'image', 'price', 'location', 'bedrooms', 'bathrooms', 'area']
    } else if (itemType === 'news') {
      requiredFields = ['title', 'fullDescription', 'shortDescription', 'category', 'type', 'author.name']
    } else if (itemType === 'services') {
      requiredFields = ['title', 'shortDescription', 'fullDescription', 'thumbImage', 'img', 'icon', 'category']
    } else if (itemType === 'portfolio') {
      requiredFields = ['title', 'designation', 'shortDescription', 'fullDescription', 'thumbImage', 'img', 'category', 'filter']
    } else if (itemType === 'faq') {
      requiredFields = ['question', 'answer', 'category']
    } else if (itemType === 'social') {
      requiredFields = ['name', 'icon', 'url', 'position']
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
      setError(null)

      const response = await fetch('/api/content/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemType,
          item: formData,
          id: editingItem?.id,
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
        const response = await fetch('/api/content/items', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemType, id: itemId }),
        })

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

  const title =
    itemType === 'properties'
      ? 'Properties Management'
      : itemType === 'news'
        ? 'News Management'
        : itemType === 'services'
          ? 'Services Management'
          : itemType === 'portfolio'
            ? 'Portfolio Management'
            : itemType === 'faq'
              ? 'FAQ Management'
              : 'Social Media Management'
  const itemLabel =
    itemType === 'properties'
      ? 'Property'
      : itemType === 'news'
        ? 'News'
        : itemType === 'services'
          ? 'Service'
          : itemType === 'portfolio'
            ? 'Portfolio Item'
            : itemType === 'faq'
              ? 'FAQ'
              : 'Social Media Link'

  return (
    <>
      <ItemManagerHeader title={title} itemLabel={itemLabel} onAddNew={() => initializeForm()} />

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

      <ItemManagerList items={items} loading={loading} itemType={itemType} onEdit={initializeForm} onDelete={handleDeleteItem} />

      <ItemManagerModal
        show={showModal}
        onHide={() => setShowModal(false)}
        editingItem={editingItem}
        formData={formData}
        itemType={itemType}
        categories={categories}
        onFormChange={handleFormChange}
        onSave={handleSaveItem}
        saving={saving}
      />
    </>
  )
}

export default ContentItemManager
