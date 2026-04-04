// Request handlers for content items API
import { DEFAULT_RESPONSE } from './config.js'
import { fetchTableItems, createItem, updateItem, deleteItem, getNextSocialOrder, getNextServiceOrder, resolveServiceCategoryId } from './database.js'
import { mapToDatabase } from './mappers.js'
import { isUuid } from './config.js'

export const handleGet = async (req) => {
    try {
        const { searchParams } = new URL(req.url)
        const type = searchParams.get('type')

        if (type) {
            return await buildResponseForType(type)
        }

        const [properties, news, services, portfolio, faq, social] = await Promise.all([
            fetchTableItems('properties'),
            fetchTableItems('news'),
            fetchTableItems('services'),
            fetchTableItems('portfolio'),
            fetchTableItems('faq'),
            fetchTableItems('social')
        ])

        return {
            ...DEFAULT_RESPONSE,
            properties,
            news,
            services,
            portfolio,
            faq,
            social
        }
    } catch (error) {
        console.error('Error fetching content items:', error)
        throw new Error('Failed to fetch items')
    }
}

export const handlePost = async (req) => {
    try {
        const body = await req.json()
        const { itemType, item, id } = body

        const TABLE_MAP = {
            properties: 'properties',
            news: 'news',
            services: 'services',
            portfolio: 'portfolio',
            faq: 'faqs',
            social: 'social_links'
        }

        const table = TABLE_MAP[itemType]

        if (!table || !item) {
            throw new Error('Item type and item are required')
        }

        const targetId = id || item.id
        const isUpdate = Boolean(targetId && (itemType !== 'social' || isUuid(targetId)))
        const payload = mapToDatabase(itemType, item)

        console.log(`[${itemType}] isUpdate=${isUpdate}, targetId=${targetId}, payload=`, payload)

        if (!isUpdate && itemType === 'social') {
            const providedOrder = Number(payload.order_index ?? 0)
            payload.order_index = providedOrder > 0 ? providedOrder : await getNextSocialOrder()
        }

        if (itemType === 'services') {
            payload.category_id = await resolveServiceCategoryId(item)

            if (!payload.category_id) {
                throw new Error('Please select a valid services category before saving.')
            }

            const providedOrder = Number(payload.order_index ?? 0)
            payload.order_index = providedOrder > 0
                ? providedOrder
                : (isUpdate ? providedOrder : await getNextServiceOrder())
        }

        let result

        if (isUpdate) {
            console.log(`[${itemType}] Updating item with id=${targetId}`)
            result = await updateItem(itemType, payload, targetId)
            console.log(`[${itemType}] Update result:`, result)
        } else {
            console.log(`[${itemType}] Inserting new item`)
            result = await createItem(itemType, payload)
            console.log(`[${itemType}] Insert result:`, result)
        }

        return result
    } catch (error) {
        console.error('Error saving content item:', error)
        throw error
    }
}

export const handleDelete = async (req) => {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        const type = searchParams.get('type')

        const TABLE_MAP = {
            properties: 'properties',
            news: 'news',
            services: 'services',
            portfolio: 'portfolio',
            faq: 'faqs',
            social: 'social_links'
        }

        const table = TABLE_MAP[type]

        if (!table || !id) {
            throw new Error('Item type and id are required')
        }

        if (type === 'social' && !isUuid(id)) {
            throw new Error('Invalid social link id')
        }

        await deleteItem(type, id)

        return { success: true }
    } catch (error) {
        console.error('Error deleting content item:', error)
        throw error
    }
}

const buildResponseForType = async (itemType) => {
    const items = await fetchTableItems(itemType)
    return { [itemType]: items }
}
