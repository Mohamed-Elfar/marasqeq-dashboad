import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'public', 'content-data', 'contact-info.json')

const readData = () => {
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading contact info:', error)
    return { emails: [], phones: [], addresses: [] }
  }
}

const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing contact info:', error)
    return false
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    const data = readData()
    
    if (type && data[type]) {
      return NextResponse.json({ [type]: data[type] })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contact info' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { type, item, id } = body
    
    if (!type || !item) {
      return NextResponse.json({ error: 'Type and item are required' }, { status: 400 })
    }
    
    const data = readData()
    
    if (!data[type]) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    
    if (id) {
      const index = data[type].findIndex(i => i.id === id)
      if (index !== -1) {
        data[type][index] = { ...data[type][index], ...item, id }
      } else {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 })
      }
    } else {
      const newId = String(Date.now())
      const newItem = {
        id: newId,
        ...item,
        visible: item.visible !== undefined ? item.visible : true,
        order: item.order || data[type].length + 1
      }
      data[type].push(newItem)
    }
    
    const success = writeData(data)
    
    if (success) {
      return NextResponse.json({ success: true, data: data[type] })
    } else {
      return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json()
    const { type, id } = body
    
    if (!type || !id) {
      return NextResponse.json({ error: 'Type and ID are required' }, { status: 400 })
    }
    
    const data = readData()
    
    if (!data[type]) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    
    data[type] = data[type].filter(item => item.id !== id)
    
    const success = writeData(data)
    
    if (success) {
      return NextResponse.json({ success: true, data: data[type] })
    } else {
      return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in DELETE:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
