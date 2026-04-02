import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'public', 'content-data', 'form-options.json')

// Helper function to read data
const readData = () => {
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading form options:', error)
    return { locations: [], propertyTypes: [], objectives: [] }
  }
}

// Helper function to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing form options:', error)
    return false
  }
}

// GET - Retrieve all form options or specific type
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // locations, propertyTypes, or objectives

    const data = readData()

    if (type && data[type]) {
      return NextResponse.json({ [type]: data[type] })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch form options' }, { status: 500 })
  }
}

// POST - Add or update form option
export async function POST(request) {
  try {
    const body = await request.json()
    const { type, option, id } = body // type: locations, propertyTypes, objectives

    if (!type || !option) {
      return NextResponse.json({ error: 'Type and option are required' }, { status: 400 })
    }

    const data = readData()

    if (!data[type]) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    if (id) {
      // Update existing option
      const index = data[type].findIndex(item => item.id === id)
      if (index !== -1) {
        data[type][index] = { ...data[type][index], ...option, id }
      } else {
        return NextResponse.json({ error: 'Option not found' }, { status: 404 })
      }
    } else {
      // Add new option
      const newId = String(Date.now())
      const newOption = {
        id: newId,
        ...option,
        active: option.active !== undefined ? option.active : true,
        order: option.order || data[type].length + 1
      }
      data[type].push(newOption)
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

// DELETE - Remove form option
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
