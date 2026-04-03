// Migration helper to transition from JSON-based IDs to UUID-based IDs
import { getContactInfo, getFormOptions } from './database'

// Map old string IDs to new UUIDs
const idMapping = {
  contactInfo: {},
  formOptions: {}
}

// Build ID mapping from database
export const buildIdMapping = async () => {
  try {
    // Get contact info and build mapping
    const contactInfo = await getContactInfo()
    contactInfo.forEach(item => {
      // Create a predictable ID for old string IDs
      const oldId = `${item.type}_${item.order_index}`
      idMapping.contactInfo[oldId] = item.id
    })

    // Get form options and build mapping
    const [locations, propertyTypes, objectives] = await Promise.all([
      getFormOptions('locations'),
      getFormOptions('property_types'),
      getFormOptions('objectives')
    ])

    locations.forEach(item => {
      const oldId = `locations_${item.order_index}`
      idMapping.formOptions[oldId] = item.id
    })

    propertyTypes.forEach(item => {
      const oldId = `propertyTypes_${item.order_index}`
      idMapping.formOptions[oldId] = item.id
    })

    objectives.forEach(item => {
      const oldId = `objectives_${item.order_index}`
      idMapping.formOptions[oldId] = item.id
    })

    return idMapping
  } catch (error) {
    console.error('Error building ID mapping:', error)
    return idMapping
  }
}

// Convert old ID to new UUID
export const convertId = (type, oldId) => {
  if (type === 'contactInfo') {
    return idMapping.contactInfo[oldId] || null
  } else if (type === 'formOptions') {
    return idMapping.formOptions[oldId] || null
  }
  return null
}

// Check if ID is a UUID
export const isUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

// Get or convert ID
export const getValidId = async (type, id) => {
  // If it's already a UUID, return it
  if (isUUID(id)) {
    return id
  }

  // Otherwise, try to convert it
  if (!idMapping.contactInfo || Object.keys(idMapping.contactInfo).length === 0) {
    await buildIdMapping()
  }

  return convertId(type, id)
}

// Initialize the mapping
let isInitialized = false
const initializeMapping = async () => {
  if (!isInitialized) {
    await buildIdMapping()
    isInitialized = true
    console.log('ID mapping initialized:', idMapping)
  }
}

// Export initialization function
export { initializeMapping }
