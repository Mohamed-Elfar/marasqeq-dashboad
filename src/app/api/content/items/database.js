// Database operations for content items API
import { supabase } from '@/lib/supabase'
import { isUuid } from './config.js'
import { mapFromDatabase } from './mappers.js'

export const fetchTableItems = async (itemType) => {
    const TABLE_MAP = {
        properties: 'properties',
        news: 'news',
        services: 'services',
        portfolio: 'portfolio',
        faq: 'faqs',
        social: 'social_links'
    }

    const table = TABLE_MAP[itemType]

    if (!table) {
        return []
    }

    let query = supabase.from(table).select('*')

    if (itemType === 'services') {
        query = supabase.from(table).select('*, categories(name)')
    }

    const { data, error } = await query

    if (error) {
        throw error
    }

    const items = (data || []).map((item) => mapFromDatabase(itemType, item))

    if (itemType === 'social' || itemType === 'faq') {
        return items.sort((left, right) => {
            const leftOrder = left.order ?? left.order_index ?? 0
            const rightOrder = right.order ?? right.order_index ?? 0
            return leftOrder - rightOrder
        })
    }

    return items
}

export const getNextSocialOrder = async () => {
    const { data, error } = await supabase
        .from('social_links')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)

    if (error) {
        throw error
    }

    const currentMaxOrder = Number(data?.[0]?.order_index ?? 0)
    return currentMaxOrder + 1
}

export const getNextServiceOrder = async () => {
    const { data, error } = await supabase
        .from('services')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)

    if (error) {
        throw error
    }

    const currentMaxOrder = Number(data?.[0]?.order_index ?? 0)
    return currentMaxOrder + 1
}

export const resolveServiceCategoryId = async (item) => {
    if (item?.category_id && isUuid(item.category_id)) {
        return item.category_id
    }

    const categoryInput = Array.isArray(item?.category)
        ? item.category.find(Boolean)
        : item?.category

    if (!categoryInput) {
        return null
    }

    const { data, error } = await supabase
        .from('categories')
        .select('id')
        .eq('type', 'services')
        .ilike('name', String(categoryInput))
        .limit(1)

    if (error) {
        throw error
    }

    return data?.[0]?.id || null
}

export const createItem = async (itemType, payload) => {
    const TABLE_MAP = {
        properties: 'properties',
        news: 'news',
        services: 'services',
        portfolio: 'portfolio',
        faq: 'faqs',
        social: 'social_links'
    }

    const table = TABLE_MAP[itemType]

    let { data, error } = await supabase
        .from(table)
        .insert(payload)
        .select()

    if (error) {
        throw error
    }

    return data?.[0] || payload
}

export const updateItem = async (itemType, payload, targetId) => {
    const TABLE_MAP = {
        properties: 'properties',
        news: 'news',
        services: 'services',
        portfolio: 'portfolio',
        faq: 'faqs',
        social: 'social_links'
    }

    const table = TABLE_MAP[itemType]

    let { data, error } = await supabase
        .from(table)
        .update(payload)
        .eq('id', targetId)
        .select()

    if (error) {
        throw error
    }

    return data?.[0] || payload
}

export const deleteItem = async (itemType, id) => {
    const TABLE_MAP = {
        properties: 'properties',
        news: 'news',
        services: 'services',
        portfolio: 'portfolio',
        faq: 'faqs',
        social: 'social_links'
    }

    const table = TABLE_MAP[itemType]

    const { error } = await supabase.from(table).delete().eq('id', id)

    if (error) {
        throw error
    }

    return { success: true }
}
