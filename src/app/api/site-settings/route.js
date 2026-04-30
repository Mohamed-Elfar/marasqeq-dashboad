import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    let query = supabase.from('site_settings').select('*')

    if (key) {
      const { data, error } = await query.eq('key', key).single()
      if (error && error.code !== 'PGRST116') throw error
      return NextResponse.json(data || null)
    }

    const { data, error } = await query.order('key')
    if (error) throw error

    return NextResponse.json({ settings: data || [] })
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const updates = await request.json()

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Request body must be an array of settings' },
        { status: 400 }
      )
    }

    const results = []

    for (const setting of updates) {
      const { key, value } = setting

      if (!key) {
        return NextResponse.json(
          { error: 'Each setting must have a key' },
          { status: 400 }
        )
      }

      const { data, error } = await supabase
        .from('site_settings')
        .upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        )
        .select()
        .single()

      if (error) throw error
      results.push(data)
    }

    return NextResponse.json({ settings: results })
  } catch (error) {
    console.error('Error updating site settings:', error)
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  return POST(request)
}
