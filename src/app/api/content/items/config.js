// Configuration constants for content items API

export const TABLE_MAP = {
    properties: 'properties',
    news: 'news',
    services: 'services',
    portfolio: 'portfolio',
    faq: 'faqs',
    social: 'social_links'
}

export const DEFAULT_RESPONSE = {
    properties: [],
    news: [],
    services: [],
    portfolio: [],
    faq: [],
    social: []
}

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const isUuid = (value) => typeof value === 'string' && UUID_PATTERN.test(value)
