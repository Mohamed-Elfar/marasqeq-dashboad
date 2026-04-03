import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    let query = supabase.from('categories').select('*')

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      categories: (data || []).sort((a, b) => {
        const orderA = a.order_index ?? 0
        const orderB = b.order_index ?? 0

        if (orderA !== orderB) {
          return orderA - orderB
        }

        return String(a.name || '').localeCompare(String(b.name || ''))
      })
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { category, id } = await request.json()

    if (!category) {
      return NextResponse.json({ error: 'Category payload is required' }, { status: 400 })
    }

    const payload = {
      ...category,
      visible: category.visible !== undefined ? category.visible : true,
      order_index: category.order_index ?? category.orderIndex ?? 0,
    }

    if (id) {
      const { data, error } = await supabase
        .from('categories')
        .update(payload)
        .eq('id', id)
        .select()

      if (error) {
        throw error
      }

      return NextResponse.json({ success: true, categories: data || [] })
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        id: category.id || Date.now().toString(),
        ...payload
      })
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, categories: data || [] })
  } catch (error) {
    console.error('Error saving category:', error)
    return NextResponse.json({ error: 'Failed to save category' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
