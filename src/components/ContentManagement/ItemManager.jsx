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
      
      // Use dashboard's news API for news items
      const apiUrl = itemType === 'news' ? '/api/news' : `/api/content/items?type=${itemType}`
      console.log(`[${itemType}] Fetching from:`, apiUrl);
      
      const response = await fetch(apiUrl)
      console.log(`[${itemType}] Response status:`, response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[${itemType}] API Error:`, errorText)
        throw new Error(`API returned ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      
      // For news API, data is the array directly, for others, extract from response
      const items = itemType === 'news' ? data : (data[itemType] || [])
      
      console.log(`[${itemType}] Raw response:`, data);
      console.log(`[${itemType}] Items array:`, items);

      const sortedItems = [...items].sort((left, right) => {
        if (itemType === 'social' || itemType === 'faq') {
          const leftOrder = Number(left.order ?? left.order_index ?? 0)
          const rightOrder = Number(right.order ?? right.order_index ?? 0)

          if (leftOrder !== rightOrder) {
            return leftOrder - rightOrder
          }

          return String(left.name || left.question || '').localeCompare(String(right.name || right.question || ''))
        }

        const dateA = new Date(left.date || 0)
        const dateB = new Date(right.date || 0)
        return dateB - dateA
      })

      setItems(sortedItems)
    } catch (err) {
      setError('Failed to load items')
      console.error(`[${itemType}] fetchItems error:`, err)
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
      console.log('Dashboard initializeForm - Item data:', item);
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
        const nextFaqOrder = items.reduce((highest, currentItem) => {
          const currentOrder = Number(currentItem.order ?? currentItem.order_index ?? 0)
          return currentOrder > highest ? currentOrder : highest
        }, 0) + 1

        setFormData({
          question: '',
          answer: '',
          category: 'general',
          active: true,
          order: nextFaqOrder,
        })
      } else if (itemType === 'social') {
        const nextSocialOrder = items.reduce((highest, currentItem) => {
          const currentOrder = Number(currentItem.order ?? currentItem.order_index ?? 0)
          return currentOrder > highest ? currentOrder : highest
        }, 0) + 1

        setFormData({
          name: '',
          icon: 'FaFacebookF',
          url: '',
          position: ['header', 'footer', 'news'],
          active: true,
          order: nextSocialOrder,
        })
      } else if (itemType === 'news') {
        const nextNewsOrder = items.reduce((highest, currentItem) => {
          const currentOrder = Number(currentItem.order ?? currentItem.order_index ?? 0)
          return currentOrder > highest ? currentOrder : highest
        }, 0) + 1

        setFormData({
          title: '',
          shortDescription: '',
          fullDescription: '',
          featured_image: '',
          excerpt: '',
          category_id: null,
          published: true,
          featured: false,
          visible: true,
          order_index: nextNewsOrder,
          meta_title: '',
          meta_description: '',
        })
      } else {
        setFormData({
          title: '',
          shortDescription: '',
          fullDescription: '',
          thumbImage: '',
          img: '',
          detail_image_1: '',
          detail_image_2: '',
          icon: '',
          category: [],
          buttonText: 'Explore Path',
          active: true,
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
      requiredFields = ['title', 'price', 'location']
    } else if (itemType === 'news') {
      requiredFields = ['title', 'fullDescription', 'shortDescription', 'category', 'type', 'author.name']
    } else if (itemType === 'services') {
      requiredFields = ['title', 'shortDescription', 'fullDescription', 'icon', 'category']
    } else if (itemType === 'portfolio') {
      requiredFields = ['title', 'designation', 'shortDescription', 'fullDescription', 'thumbImage', 'img', 'category', 'filter']
    } else if (itemType === 'faq') {
      requiredFields = ['question', 'answer', 'category']
    } else if (itemType === 'social') {
      requiredFields = ['name', 'icon', 'url', 'position']
    }

    const missingFields = requiredFields.filter((field) => {
      const value = field.split('.').reduce((obj, key) => obj && obj[key], formData)

      if (value === null || value === undefined) {
        return true
      }

      // For portfolio images, empty strings are valid (will use defaults)
      if (itemType === 'portfolio' && (field === 'thumbImage' || field === 'img')) {
        return false // Don't require these fields to have values
      }

      if (value === '') {
        return true
      }

      if (Array.isArray(value)) {
        return value.length === 0
      }

      if (typeof value === 'object') {
        return Object.keys(value).length === 0
      }

      return false
    })

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    try {
      setSaving(true)
      setSuccess(false)
      setError(null)

      console.log(`[${itemType}] Saving item:`, {
        id: editingItem?.id,
        formData,
        isEditing: Boolean(editingItem?.id),
      })

      // Use dashboard's news API for news items
      const apiUrl = itemType === 'news' ? '/api/news' : '/api/content/items'
      const method = editingItem?.id ? 'PUT' : 'POST'
      
      const response = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          itemType === 'news' 
            ? formData 
            : {
                itemType,
                item: formData,
                id: editingItem?.id,
              }
        ),
      })

      if (response.ok) {
        setShowModal(false)
        await fetchItems()
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const errorData = await response.json().catch(() => null)
        setError(errorData?.error || 'Failed to save item')
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
        // Use dashboard's news API for news items
        const apiUrl = itemType === 'news' 
          ? `/api/news?id=${itemId}` 
          : `/api/content/items?id=${itemId}&type=${itemType}`
        
        const response = await fetch(apiUrl, {
          method: 'DELETE',
        })

        if (response.ok) {
          fetchItems()
          setSuccess(true)
          setTimeout(() => setSuccess(false), 3000)
        } else {
          const errorData = await response.json().catch(() => null)
          setError(errorData?.error || 'Failed to delete item')
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
