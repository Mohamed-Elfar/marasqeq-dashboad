import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req) {
    try {
        const { data, error } = await supabase.from('pages').select('*')

        if (error) {
            throw error
        }

        return NextResponse.json({ pages: data || [] })
    } catch (error) {
        console.error('Error fetching pages:', error)
        return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const body = await req.json()
        const pageId = body.id || body.slug

        if (!pageId) {
            return NextResponse.json({ error: 'Page id is required' }, { status: 400 })
        }

        const record = {
            ...body,
            id: pageId
        }

        const { data: existing, error: fetchError } = await supabase
            .from('pages')
            .select('*')
            .eq('id', pageId)
            .maybeSingle()

        if (fetchError) {
            throw fetchError
        }

        const query = existing
            ? supabase.from('pages').update(record).eq('id', pageId).select()
            : supabase.from('pages').insert(record).select()

        const { data, error } = await query

        if (error) {
            throw error
        }

        return NextResponse.json(data?.[0] || record)
    } catch (error) {
        console.error('Error saving page:', error)
        return NextResponse.json({ error: 'Failed to save page' }, { status: 500 })
    }
}
