import { NextResponse } from 'next/server'

// In-memory storage for categories (replace with database in production)
let categories = [
  { id: '1', name: 'Residential', description: 'Residential properties', type: 'properties' },
  { id: '2', name: 'Commercial', description: 'Commercial properties', type: 'properties' },
  { id: '3', name: 'Investment', description: 'Investment opportunities', type: 'properties' },
  { id: '4', name: 'Company News', description: 'Company updates and announcements', type: 'news' },
  { id: '5', name: 'Market Insights', description: 'Real estate market insights', type: 'news' },
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
