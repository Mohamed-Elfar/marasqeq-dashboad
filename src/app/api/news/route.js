import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        categories(name, slug)
      `)
      .order('order_index', { ascending: true })

    if (error) throw error

    console.log('Dashboard News API - Raw data:', data);

    // Transform data to match dashboard expectations
    const transformedData = data.map(item => ({
      ...item,
      // Map database fields to dashboard expected fields
      shortDescription: item.excerpt || '',
      fullDescription: item.content || '',
      category: item.categories?.name || item.category_name || '',
      category_id: item.category_id || '',
      featured_image: item.featured_image || '', // Keep featured_image field
      type: 'news',
      status: item.published ? 'Published' : 'Draft', // Add status field
      visibility: item.visible ? 'Visible' : 'Hidden', // Add visibility status
      date: item.published_at ? new Date(item.published_at).toLocaleDateString() : new Date(item.created_at).toLocaleDateString(), // Format date
      author: {
        name: 'Maraseq Team',
        img: '/img/logo.svg', // Use website logo path
        description: 'Real estate experts providing insights and updates'
      }
    }));

    console.log('Dashboard News API - Transformed data:', transformedData);
    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Dashboard News API POST - Raw body:', body);
    console.log('Dashboard News API POST - Author data:', body.author);

    // Transform dashboard data to database format
    const transformedBody = {
      title: body.title,
      excerpt: body.shortDescription || '',
      content: body.fullDescription || '',
      category_id: body.category_id || body.category || null,
      featured_image: body.featured_image || '',
      published: body.published === true,
      featured: body.featured || false,
      visible: body.visible !== false,
      order_index: body.order_index || 0,
      meta_title: body.meta_title || body.title,
      meta_description: body.meta_description || body.shortDescription || ''
    };

    console.log('Dashboard News API POST - Transformed body:', transformedBody);

    const { data, error } = await supabase
      .from('news')
      .insert([transformedBody])
      .select()

    if (error) throw error
    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...newsItem } = body
    console.log('Dashboard News API PUT - Raw body:', body);

    // Transform dashboard data to database format
    const transformedItem = {
      title: newsItem.title,
      excerpt: newsItem.shortDescription || '',
      content: newsItem.fullDescription || '',
      category_id: newsItem.category_id || newsItem.category || null,
      featured_image: newsItem.featured_image || '',
      published: newsItem.published === true,
      featured: newsItem.featured || false,
      visible: newsItem.visible !== false,
      order_index: newsItem.order_index || 0,
      meta_title: newsItem.meta_title || newsItem.title,
      meta_description: newsItem.meta_description || newsItem.shortDescription || ''
    };

    console.log('Dashboard News API PUT - Transformed item:', transformedItem);

    const { data, error } = await supabase
      .from('news')
      .update(transformedItem)
      .eq('id', id)
      .select()

    if (error) throw error
    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { error: 'Failed to update news' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json()
    const { id } = body

    console.log('Dashboard News API DELETE - ID:', id);

    if (!id) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { error: 'Failed to delete news' },
      { status: 500 }
    )
  }
}
