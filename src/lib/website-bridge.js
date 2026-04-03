// Website bridge library for connecting to dashboard database
// This can be used by the website to fetch data from the dashboard

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3001'

class WebsiteBridge {
  constructor() {
    this.baseUrl = DASHBOARD_URL
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Generic fetch method with caching
  async fetch(endpoint, options = {}) {
    const cacheKey = `${endpoint}${JSON.stringify(options)}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      })

      return data
    } catch (error) {
      console.error('Error fetching from dashboard:', error)
      throw error
    }
  }

  // Get properties
  async getProperties() {
    return this.fetch('/api/properties')
  }

  // Get categories
  async getCategories(type = null) {
    const url = type ? `/api/categories?type=${type}` : '/api/categories'
    return this.fetch(url)
  }

  // Get news
  async getNews() {
    return this.fetch('/api/news')
  }

  // Get services
  async getServices() {
    return this.fetch('/api/services')
  }

  // Get portfolio
  async getPortfolio() {
    return this.fetch('/api/portfolio')
  }

  // Get contact info
  async getContactInfo(type = null) {
    const url = type ? `/api/contact-info?type=${type}` : '/api/contact-info'
    return this.fetch(url)
  }

  // Get form options
  async getFormOptions(type = null) {
    const url = type ? `/api/form-options?type=${type}` : '/api/form-options'
    return this.fetch(url)
  }

  // Get social links
  async getSocialLinks() {
    return this.fetch('/api/social-links')
  }

  // Get pages
  async getPages() {
    return this.fetch('/api/pages')
  }

  // Get page by slug
  async getPage(slug) {
    return this.fetch(`/api/pages/${slug}`)
  }

  // Sync data with last sync timestamp
  async syncData(table, lastSync = null) {
    const url = `/api/sync?table=${table}${lastSync ? `&lastSync=${lastSync}` : ''}`
    return this.fetch(url)
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }

  // Clear cache for specific endpoint
  clearCacheFor(endpoint) {
    for (const key of this.cache.keys()) {
      if (key.includes(endpoint)) {
        this.cache.delete(key)
      }
    }
  }
}

// Create singleton instance
export const websiteBridge = new WebsiteBridge()

// Export individual methods for convenience
export const {
  getProperties,
  getCategories,
  getNews,
  getServices,
  getPortfolio,
  getContactInfo,
  getFormOptions,
  getSocialLinks,
  getPages,
  getPage,
  syncData,
  clearCache,
  clearCacheFor
} = websiteBridge

// React hook for website data
export const useWebsiteData = (endpoint, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await websiteBridge.fetch(endpoint, options)
        setData(result)
        setError(null)
      } catch (err) {
        setError(err.message)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint, JSON.stringify(options)])

  return { data, loading, error, refetch: fetchData }
}
