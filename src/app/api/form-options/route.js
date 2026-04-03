import { NextResponse } from 'next/server'
import { getFormOptions, createFormOption, updateFormOption, deleteFormOption } from '@/lib/database'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // locations, propertyTypes, or objectives

    if (type) {
      const options = await getFormOptions(type)
      return NextResponse.json({ [type]: options })
    }

    // Return all types
    const [locations, propertyTypes, objectives] = await Promise.all([
      getFormOptions('locations'),
      getFormOptions('property_types'),
      getFormOptions('objectives')
    ])

    return NextResponse.json({
      locations,
      propertyTypes,
      objectives
    })
  } catch (error) {
    console.error('Error fetching form options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form options' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { type, option, id } = body

    if (!type || !option) {
      return NextResponse.json(
        { error: 'Type and option are required' },
        { status: 400 }
      )
    }

    // Map frontend type names to database type names
    const typeMapping = {
      'locations': 'locations',
      'propertyTypes': 'property_types',
      'objectives': 'objectives'
    }

    const dbType = typeMapping[type] || type

    if (id) {
      // Update existing option
      try {
        const updatedOption = await updateFormOption(id, {
          ...option,
          type: dbType
        })
        return NextResponse.json({ success: true, data: updatedOption })
      } catch (updateError) {
        console.error('Update error:', updateError)
        // If update fails, it might be because the ID doesn't exist
        // Try to create a new option instead
        const newOption = await createFormOption({
          type: dbType,
          label: option.label,
          value: option.value,
          active: option.active !== undefined ? option.active : true,
          order_index: option.order_index || 0
        })
        return NextResponse.json({ success: true, data: newOption })
      }
    } else {
      // Create new option
      const newOption = await createFormOption({
        type: dbType,
        label: option.label,
        value: option.value,
        active: option.active !== undefined ? option.active : true,
        order_index: option.order_index || 0
      })
      return NextResponse.json({ success: true, data: newOption })
    }
  } catch (error) {
    console.error('Error creating/updating form option:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
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

    await deleteFormOption(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting form option:', error)
    return NextResponse.json(
      { error: 'Failed to delete option' },
      { status: 500 }
    )
  }
}
