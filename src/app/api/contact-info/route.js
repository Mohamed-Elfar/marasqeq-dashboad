import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const includeHidden = searchParams.get('includeHidden') === 'true'

    let query = supabase.from('contact_info').select('*')

    // Keep website/public behavior by default, but allow admin views to include hidden items.
    if (!includeHidden) {
      query = query.eq('visible', true)
    }

    if (type) {
      query = query.eq('type', type)
      const { data, error } = await query
      if (error) throw error
      return NextResponse.json({ [type]: data })
    }

    const { data, error } = await query.order('order_index', { ascending: true })
    if (error) throw error

    if (includeHidden) {
      return NextResponse.json({
        emails: data.filter(item => item.type === 'emails'),
        phones: data.filter(item => item.type === 'phones'),
        addresses: data.filter(item => item.type === 'addresses')
      })
    }

    console.log('Raw contact info data:', data)

    // Group by type and remove duplicates based on value
    const uniqueEmails = data.filter(item => item.type === 'emails').filter((item, index, arr) =>
      arr.findIndex(i => i.value === item.value) === index
    )
    const uniquePhones = data.filter(item => item.type === 'phones').filter((item, index, arr) =>
      arr.findIndex(i => i.value === item.value) === index
    )
    const uniqueAddresses = data.filter(item => item.type === 'addresses').filter((item, index, arr) =>
      arr.findIndex(i => i.value === item.value) === index
    )

    const result = {
      emails: uniqueEmails,
      phones: uniquePhones,
      addresses: uniqueAddresses
    }

    console.log('Deduplicated result:', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { type, item, id } = body

    if (!type || !item) {
      return NextResponse.json(
        { error: 'Type and item are required' },
        { status: 400 }
      )
    }

    // Check if this is an update or create operation
    if (id) {
      // Update existing item
      console.log('Updating contact item:', { id, type, item })

      const { data, error } = await supabase
        .from('contact_info')
        .update({
          type,
          value: item.value || item.email || item.phone || item.address ||
            (item.line1 && item.line2 ? `${item.line1}, ${item.line2}` : item.line1) || '', // Handle different field names
          label: item.label,
          visible: item.visible !== undefined ? item.visible : true,
          order_index: item.order_index || 0
        })
        .eq('id', id)
        .select()

      if (error) {
        console.error('Supabase update error:', error)
        throw error
      }

      console.log('Successfully updated item:', data[0])
      return NextResponse.json({ success: true, data: data[0] })
    } else {
      // Create new item
      console.log('Creating new contact item:', { type, item })

      const { data, error } = await supabase
        .from('contact_info')
        .insert({
          type,
          value: item.value || item.email || item.phone || item.address ||
            (item.line1 && item.line2 ? `${item.line1}, ${item.line2}` : item.line1) || '', // Handle different field names
          label: item.label,
          visible: item.visible !== undefined ? item.visible : true,
          order_index: item.order_index || 0
        })
        .select()

      if (error) {
        console.error('Supabase insert error:', error)
        throw error
      }

      console.log('Successfully created item:', data[0])
      return NextResponse.json({ success: true, data: data[0] })
    }
    return NextResponse.json({ success: true, data: data[0] })
  } catch (error) {
    console.error('Error creating/updating contact info:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    })
    console.error('Request body:', {
      type: type,
      id: id,
      item: {
        ...item,
        value: item.value || item.email || item.phone || item.address || item.line1 ? '[REDACTED]' : 'NULL',
        visible: item.visible,
        order_index: item.order_index
      }
    })
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error.message,
        code: error.code,
        hint: error.hint
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Delete from database
    const { error } = await supabase
      .from('contact_info')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete error:', error)
      throw error
    }

    console.log('Successfully deleted item:', id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact info:', error)
    return NextResponse.json(
      { error: 'Failed to delete item', details: error.message },
      { status: 500 }
    )
  }
}
