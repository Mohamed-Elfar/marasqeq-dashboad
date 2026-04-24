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

    if (itemType === 'portfolio') {
        return {
            ...item,
            shortDescription: item.short_description || item.shortDescription || '',
            fullDescription: item.full_description || item.fullDescription || '',
            thumbImage: item.thumb_image || item.thumbImage || '1.jpg',
            img: item.img || item.thumb_image || item.thumbImage || '1.jpg',
            category: item.category || [],
            active: item.active !== false,
            carousel: item.carousel || false,
            filter: item.filter || '',
            featured: item.featured || false,
            captions: item.captions || {
                image1: '31.jpg',
                image2: '32.jpg',
                caption: '',
                captionFullDescription: '',
                captionShortDescription: '',
            },
            reviews: item.reviews || [],
        }
    }

    if (itemType === 'properties') {
        return {
            ...item,
            status: item.status || 'for_sale',
            propertyType: item.property_type || item.propertyType || '',
            rooms: item.rooms || 0,
            yearBuilt: item.year_built || item.yearBuilt || null,
            unitType: item.unit_type || 'sq_m',
            finishStatus: item.finish_status || 'without_finish',
            totalArea: item.total_area ?? null,
            netArea: item.net_area ?? null,
            builtUpArea: item.built_up_area ?? null,
            landArea: item.land_area ?? null,
            productImg: item.product_img || item.productImg || null,
            shortDescription: item.short_description || item.shortDescription || '',
            fullDescription: item.full_description || item.fullDescription || '',
            propertyDetails: item.property_details || item.propertyDetails || {},
            factsAndFeatures: item.facts_and_features || item.factsAndFeatures || {},
            amenitiesList: item.amenities_list || item.amenitiesList || [],
            propertyTypes: item.property_types || item.propertyTypes || [],
            priceRange: item.price_range || item.priceRange || [],
            bedBath: item.bed_bath || item.bedBath || [],
            category: item.category || [],
            mapEmbedUrl: item.map_embed_url || item.mapEmbedUrl || '',
            videoUrl: item.video_url || item.videoUrl || '',
            videoPoster: item.video_poster || item.videoPoster || '',
            galleryImage1: item.gallery_images?.[0] || item.galleryImage1 || '',
            galleryImage2: item.gallery_images?.[1] || item.galleryImage2 || '',
            galleryImage3: item.gallery_images?.[2] || item.galleryImage3 || '',
            galleryImages: item.gallery_images || item.galleryImages || [],
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
            position: item.position || ['header', 'footer', 'news'],
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
            order_index: Number.isFinite(orderValue) && orderValue > 0 ? orderValue : 1,
            currency: item.currency || 'USD',
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
            currency: item.currency || 'USD',
            category_id: item.category_id || null,
            featured: item.featured === true,
            meta_title: item.meta_title || item.title || '',
            meta_description: item.meta_description || item.shortDescription || '',
            visible: item.visible !== false && item.active !== false,
            order_index: Number(item.order_index ?? 0)
        }
    }

    if (itemType === 'portfolio') {
        return {
            title: item.title || '',
            designation: item.designation || '',
            short_description: item.shortDescription || '',
            full_description: item.fullDescription || '',
            thumb_image: item.thumbImage || '1.jpg',
            img: item.img || item.thumbImage || '1.jpg',
            carousel: item.carousel || false,
            active: item.active !== false,
            category: item.category || [],
            filter: item.filter || '',
            featured: item.featured || false,
            captions: item.captions || {
                image1: '31.jpg',
                image2: '32.jpg',
                caption: '',
                captionFullDescription: '',
                captionShortDescription: '',
            },
            reviews: item.reviews || [],
            visible: item.visible !== false,
            currency: item.currency || 'USD',
            order_index: Number(item.order_index ?? 0)
        }
    }

    if (itemType === 'properties') {
        // Merge livingRoom and nannyRoom into property_details
        const propertyDetails = {
            ...(item.propertyDetails || item.property_details || {}),
            livingRoom: item.livingRoom ?? (item.propertyDetails?.livingRoom ?? 0),
            nannyRoom: item.nannyRoom ?? (item.propertyDetails?.nannyRoom ?? 0),
            otherDistinctiveAddition: item.otherDistinctiveAddition ?? (item.propertyDetails?.otherDistinctiveAddition ?? ''),
            numberOfFloors: item.numberOfFloors ?? (item.propertyDetails?.numberOfFloors ?? 0)
        };

        // Always send empty array/string if removed, so DB is updated
        const galleryImages = Array.isArray(item.galleryImages) ? item.galleryImages.filter(url => url && url.trim()) : [];
        const videoUrl = typeof item.videoUrl === 'string' ? item.videoUrl : (item.video_url || '');
        const videoPoster = typeof item.videoPoster === 'string' ? item.videoPoster : (item.video_poster || '');

        return {
            title: item.title || '',
            description: item.description || '',
            short_description: item.shortDescription || '',
            full_description: item.fullDescription || '',
            currency: item.currency || 'USD',
            price: item.price ?? null,
            location: item.location || item.locantion || '',
            property_type: item.propertyType || item.property_type || '',
            bedrooms: item.bedrooms ?? null,
            bathrooms: item.bathrooms ?? null,
            rooms: item.rooms ?? null,
            year_built: item.yearBuilt ?? null,
            area: item.area ?? null,
            unit_type: item.unitType || 'sq_m',
            finish_status: item.finishStatus || 'without_finish',
            total_area: item.totalArea ?? null,
            net_area: item.netArea ?? null,
            built_up_area: item.builtUpArea ?? null,
            land_area: item.landArea ?? null,
            featured: item.featured === true,
            status: item.status || 'for_sale',
            images: item.images || [],
            meta_title: item.meta_title || item.title || '',
            meta_description: item.meta_description || item.shortDescription || '',
            currency: item.currency || 'USD',
            visible: item.visible !== false,
            order_index: Number(item.order_index ?? 0),
            category_id: item.category_id || null,

            // New JSON structure fields
            product_img: item.productImg !== undefined ? item.productImg : (item.product_img || null),
            discount: item.discount ?? 0,
            country: item.country === true,
            district: item.district || '',
            properties_count: item.properties || item.properties_count || 0,
            new: item.new === true,
            rent: item.rent === true,
            rating_count: item.ratingCount || item.rating_count || 0,
            rating: item.rating ?? 0,
            sale_count: item.saleCount || item.sale_count || 0,
            date: item.date || null,
            comments: item.comments || 0,
            path_description: item.pathDescription || item.path_description || '',
            ideal_for: item.idealFor || item.ideal_for || '',
            recommended_label: item.recommendedLabel || item.recommended_label || '',
            opportunity_type: item.opportunityType || item.opportunity_type || '',
            opportunity_stage: item.opportunityStage || item.opportunity_stage || '',

            // JSONB fields
            property_details: propertyDetails,
            facts_and_features: item.factsAndFeatures || item.facts_and_features || {},
            amenities1: item.amenities1 || [],
            amenities2: item.amenities2 || [],
            amenities3: item.amenities3 || [],
            amenities_list: item.amenitiesList || item.AmenitiesList || item.amenities_list || [],
            agent: item.agent || {},
            gallery: item.gallery || {},
            property_types: item.propertyTypes || item.property_types || [],
            currency: item.currency || 'USD',
            carousel: item.carousel || [],
            tags: item.tags || item.tag || [],
            category: item.category || [],
            photo: item.photo || [],
            video: item.video || [],
            bed_bath: item.bedBath || item.bed_bath || [],
            price_range: item.priceRange || item.price_range || [],

            // Location and media fields
            map_embed_url: item.mapEmbedUrl || item.map_embed_url || null,
            video_url: videoUrl || '',
            video_poster: videoPoster || '',
            gallery_images: galleryImages,
            currency: item.currency || 'USD',
        }
    }

    return item
}
