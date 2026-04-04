import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const TABLE_MAP = {
    properties: 'properties',
    news: 'news',
    services: 'services',
    portfolio: 'portfolio',
    faq: 'faqs',
    social: 'social_links'
}

const DEFAULT_RESPONSE = {
    properties: [],
    news: [],
    services: [],
    portfolio: [],
    faq: [],
    social: []
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isUuid = (value) => typeof value === 'string' && UUID_PATTERN.test(value)


const mapFromDatabase = (itemType, item) => {
    if (!item) {
        return item
    }

    if (itemType === 'social') {
        return {
            ...item,
            order: item.order ?? item.order_index ?? 1
        }
    }

    if (itemType === 'faq') {
        return {
            ...item,
            order: item.order ?? item.order_index ?? 1
        }
    }

    if (itemType === 'services') {
        const categoryName = item.categories?.name || item.category_name || ''
        return {
            ...item,
            shortDescription: item.meta_description ?? item.shortDescription ?? '',
            fullDescription: item.description ?? item.fullDescription ?? '',
            thumbImage: item.featured_image ?? item.thumbImage ?? '',
            img: item.img ?? item.featured_image ?? '',
            category: categoryName ? [categoryName] : [],
            active: item.visible !== false,
            buttonText: 'Explore Path',
            coreFeature: false,
            detail_image_1: item.detail_image_1 || '',
            detail_image_2: item.detail_image_2 || '',
            captions: {
                image1: item.detail_image_1 || '',
                image2: item.detail_image_2 || '',
                caption: item.title || '',
                captionFullDescription: item.description || '',
                captionShortDescription: item.meta_description || '',
            },
        }
    }

    return item
}

const mapToDatabase = (itemType, item) => {
    if (itemType === 'social') {
        const mapped = {
            name: item.name || '',
            icon: item.icon || '',
            url: item.url || '',
            position: item.position || 'both',
            active: item.active !== false,
            order_index: item.order ?? item.order_index ?? 1
        }

        if (isUuid(item.id)) {
            mapped.id = item.id
        }

        return mapped
    }

    if (itemType === 'faq') {
        const orderValue = Number(item.order ?? item.order_index ?? 1)
        return {
            question: item.question || '',
            answer: item.answer || '',
            category: item.category || 'general',
            active: item.active !== false,
            order_index: Number.isFinite(orderValue) && orderValue > 0 ? orderValue : 1
        }
    }

    if (itemType === 'services') {
        // Handle image deletion - check if images are explicitly cleared
        const detailImage1 = item.detail_image_1 === '' || item.detail_image_1 === null ? '31.jpg' : (item.detail_image_1 || '31.jpg')
        const detailImage2 = item.detail_image_2 === '' || item.detail_image_2 === null ? '32.jpg' : (item.detail_image_2 || '32.jpg')
        const featuredImage = (item.thumbImage === '' || item.thumbImage === null) ? '21.jpg' : (item.thumbImage || item.featured_image || '21.jpg')
        const mainImage = (item.img === '' || item.img === null) ? featuredImage : (item.img || featuredImage)

        return {
            title: item.title || '',
            description: item.fullDescription || item.description || item.shortDescription || '',
            icon: item.icon || '',
            featured_image: featuredImage,
            img: mainImage,
            detail_image_1: detailImage1,
            detail_image_2: detailImage2,
            price: item.price ?? null,
            category_id: item.category_id || null,
            featured: item.featured === true,
            meta_title: item.meta_title || item.title || '',
            meta_description: item.meta_description || item.shortDescription || '',
            visible: item.visible !== false && item.active !== false,
            order_index: Number(item.order_index ?? 0)
        }
    }

    return item
}

const fetchTableItems = async (itemType) => {
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

const getNextSocialOrder = async () => {
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

const getNextServiceOrder = async () => {
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

const resolveServiceCategoryId = async (item) => {
    if (isUuid(item?.category_id)) {
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

const buildResponseForType = async (itemType) => {
    const items = await fetchTableItems(itemType)
    return { [itemType]: items }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const type = searchParams.get('type')

        if (type) {
            return NextResponse.json(await buildResponseForType(type))
        }

        const [properties, news, services, portfolio, faq, social] = await Promise.all([
            fetchTableItems('properties'),
            fetchTableItems('news'),
            fetchTableItems('services'),
            fetchTableItems('portfolio'),
            fetchTableItems('faq'),
            fetchTableItems('social')
        ])

        return NextResponse.json({
            ...DEFAULT_RESPONSE,
            properties,
            news,
            services,
            portfolio,
            faq,
            social
        })
    } catch (error) {
        console.error('Error fetching content items:', error)
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const body = await req.json()
        const { itemType, item, id } = body

        const table = TABLE_MAP[itemType]

        if (!table || !item) {
            return NextResponse.json({ error: 'Item type and item are required' }, { status: 400 })
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
                return NextResponse.json({ error: 'Please select a valid services category before saving.' }, { status: 400 })
            }

            const providedOrder = Number(payload.order_index ?? 0)
            payload.order_index = providedOrder > 0
                ? providedOrder
                : (isUpdate ? providedOrder : await getNextServiceOrder())

            // No captions column handling needed - captions are generated from database fields
        }

        let result

        if (isUpdate) {
            console.log(`[${itemType}] Updating item with id=${targetId}`)
            let { data, error } = await supabase
                .from(table)
                .update(payload)
                .eq('id', targetId)
                .select()

            if (error) {
                throw error
            }

            console.log(`[${itemType}] Update result:`, data)
            result = data?.[0] || payload
        } else {
            console.log(`[${itemType}] Inserting new item`)
            let { data, error } = await supabase
                .from(table)
                .insert(payload)
                .select()

            // No captions column handling needed

            if (error) {
                console.error(`[${itemType}] Insert error:`, error)
                throw error
            }

            console.log(`[${itemType}] Insert result:`, data)
            result = data?.[0] || payload
        }

        return NextResponse.json(mapFromDatabase(itemType, result))
    } catch (error) {
        console.error('Error saving content item:', error)
        return NextResponse.json({ error: error?.message || 'Failed to save item' }, { status: 500 })
    }
}

export async function DELETE(req) {
    try {
        const body = await req.json()
        const { itemType, id } = body

        const table = TABLE_MAP[itemType]

        if (!table || !id) {
            return NextResponse.json({ error: 'Item type and id are required' }, { status: 400 })
        }

        if (itemType === 'social' && !isUuid(id)) {
            return NextResponse.json({ error: 'Invalid social link id' }, { status: 400 })
        }

        const { error } = await supabase.from(table).delete().eq('id', id)

        if (error) {
            throw error
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting content item:', error)
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
    }
}
