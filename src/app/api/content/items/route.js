import { NextResponse } from 'next/server'
import { handleGet, handlePost, handleDelete } from './handlers.js'

export async function GET(req) {
    try {
        const result = await handleGet(req)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error fetching content items:', error)
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        const result = await handlePost(req)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error saving content item:', error)
        return NextResponse.json({ error: error.message || 'Failed to save item' }, { status: 500 })
    }
}

export async function DELETE(req) {
    try {
        const result = await handleDelete(req)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error deleting content item:', error)
        return NextResponse.json({ error: error.message || 'Failed to delete item' }, { status: 500 })
    }
}
