import { NextResponse } from 'next/server'
import { getPortfolio, createPortfolio, updatePortfolio, deletePortfolio } from '@/lib/database'

export async function GET(request) {
  try {
    const portfolio = await getPortfolio()
    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const portfolio = await createPortfolio(body)
    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error creating portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    const portfolio = await updatePortfolio(id, updateData)
    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      )
    }
    
    await deletePortfolio(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    )
  }
}
