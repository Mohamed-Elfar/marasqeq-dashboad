// Data mapping functions for content items API

export const mapFromDatabase = (itemType, item) => {
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

export const mapToDatabase = (itemType, item) => {
    if (itemType === 'social') {
        const mapped = {
            name: item.name || '',
            icon: item.icon || '',
            url: item.url || '',
            position: item.position || 'both',
            active: item.active !== false,
            order_index: item.order ?? item.order_index ?? 1
        }

        if (item.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.id)) {
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
