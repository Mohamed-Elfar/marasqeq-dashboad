import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
    try {
        const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        return NextResponse.json({
            messages: (data || []).map((message) => ({
                ...message,
                createdAt: message.createdAt || message.created_at || null
            }))
        })
    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const body = await req.json()

        const newMessage = {
            id: body.id || `msg-${Date.now()}`,
            name: body.name || '',
            email: body.email || '',
            subject: body.subject || 'Website Message',
            message: body.message || '',
            status: body.status || 'open',
            created_at: body.createdAt || body.created_at || new Date().toISOString()
        }

        const { data, error } = await supabase
            .from('contact_messages')
            .insert(newMessage)
            .select()

        if (error) {
            throw error
        }

        const savedMessage = data?.[0] || newMessage

        return NextResponse.json({
            ...savedMessage,
            createdAt: savedMessage.createdAt || savedMessage.created_at || newMessage.created_at
        })
    } catch (error) {
        console.error('Error creating message:', error)
        return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
    }
}

export async function PATCH(req) {
    try {
        const body = await req.json()
        const { id, status } = body

        if (!id) {
            return NextResponse.json({ error: 'Message id is required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('contact_messages')
            .update({ status })
            .eq('id', id)
            .select()

        if (error) {
            throw error
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 })
        }

        const updatedMessage = data[0]

        return NextResponse.json({
            ...updatedMessage,
            createdAt: updatedMessage.createdAt || updatedMessage.created_at || null
        })
    } catch (error) {
        console.error('Error updating message:', error)
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
    }
}
