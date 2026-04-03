import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('contact_info')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 500 })
    }
    
    // Test insert
    const { data: insertData, error: insertError } = await supabase
      .from('contact_info')
      .insert({
        type: 'emails',
        value: 'test@example.com',
        label: 'Test Email',
        visible: true,
        order_index: 999
      })
      .select()
    
    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({
        success: false,
        error: 'Insert failed',
        details: insertError
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      inserted: insertData[0]
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
