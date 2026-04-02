import { NextResponse } from 'next/server'

// In-memory storage for categories (replace with database in production)
let categories = [
  { id: '1', name: 'Residential', description: 'Residential properties', type: 'properties' },
  { id: '2', name: 'Commercial', description: 'Commercial properties', type: 'properties' },
  { id: '3', name: 'Investment', description: 'Investment opportunities', type: 'properties' },
  { id: '4', name: 'Company News', description: 'Company updates and announcements', type: 'news' },
  { id: '5', name: 'Market Insights', description: 'Real estate market insights', type: 'news' },
  { id: '6', name: 'Real Estate Investment', description: 'Real estate investment services', type: 'services' },
  { id: '7', name: 'Property Marketing', description: 'Property marketing and promotion', type: 'services' },
  { id: '8', name: 'Opportunity Development', description: 'Opportunity development services', type: 'services' },
  { id: '9', name: 'Consulting', description: 'Real estate consulting services', type: 'services' },
  { id: '10', name: 'Property Management', description: 'Property management services', type: 'services' },
  { id: '11', name: 'Buying', description: 'Portfolio items related to buying properties', type: 'portfolio' },
  { id: '12', name: 'Renting', description: 'Portfolio items related to renting properties', type: 'portfolio' },
  { id: '13', name: 'Selling', description: 'Portfolio items related to selling properties', type: 'portfolio' },
  { id: '14', name: 'Development', description: 'Property development projects', type: 'portfolio' },
  { id: '15', name: 'Investment Projects', description: 'Investment-focused portfolio items', type: 'portfolio' },
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    let filteredCategories = categories
    if (type) {
      filteredCategories = categories.filter((cat) => cat.type === type)
    }

    return NextResponse.json({ categories: filteredCategories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { category, id } = await request.json()

    if (id) {
      // Update existing category
      const index = categories.findIndex((cat) => cat.id === id)
      if (index !== -1) {
        categories[index] = { ...categories[index], ...category }
      }
    } else {
      // Create new category
      const newCategory = {
        id: Date.now().toString(),
        ...category,
      }
      categories.push(newCategory)
    }

    return NextResponse.json({ success: true, categories })
  } catch (error) {
    console.error('Error saving category:', error)
    return NextResponse.json({ error: 'Failed to save category' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    categories = categories.filter((cat) => cat.id !== id)

    return NextResponse.json({ success: true, categories })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
