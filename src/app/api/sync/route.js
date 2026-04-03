import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// WebSocket-like endpoint for real-time sync between dashboard and website
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get('table')
    const lastSync = searchParams.get('lastSync')

    if (!table) {
      return NextResponse.json(
        { error: 'Table parameter is required' },
        { status: 400 }
      )
    }

    // Validate table names
    const allowedTables = [
      'properties', 'categories', 'news', 'services', 'portfolio',
      'contact_info', 'form_options', 'social_links', 'pages'
    ]

    if (!allowedTables.includes(table)) {
      return NextResponse.json(
        { error: 'Invalid table name' },
        { status: 400 }
      )
    }

    let query = supabase
      .from(table)
      .select('*')

    // Add filter for visible items where applicable
    if (['properties', 'categories', 'news', 'services', 'portfolio', 'contact_info', 'form_options', 'social_links', 'pages'].includes(table)) {
      query = query.eq('visible', true)
    }

    // Add filter for published news
    if (table === 'news') {
      query = query.eq('published', true)
    }

    // Add filter for active form options and social links
    if (['form_options', 'social_links'].includes(table)) {
      query = query.eq(table === 'form_options' ? 'active' : 'active', true)
    }

    // Add last sync filter if provided
    if (lastSync) {
      query = query.gte('updated_at', lastSync)
    }

    // Add ordering
    if (table === 'news') {
      query = query.order('published_at', { ascending: false })
    } else {
      query = query.order('order_index', { ascending: true })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching sync data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      table,
      data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in sync endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST for triggering sync events
export async function POST(request) {
  try {
    const body = await request.json()
    const { table, action, data } = body

    // Validate table names
    const allowedTables = [
      'properties', 'categories', 'news', 'services', 'portfolio',
      'contact_info', 'form_options', 'social_links', 'pages'
    ]

    if (!allowedTables.includes(table)) {
      return NextResponse.json(
        { error: 'Invalid table name' },
        { status: 400 }
      )
    }

    // Broadcast sync event to all connected clients
    // This would typically be handled by Supabase real-time subscriptions
    // but we're adding this for manual sync triggers

    return NextResponse.json({
      success: true,
      message: `Sync event triggered for ${table}`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in sync POST:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
