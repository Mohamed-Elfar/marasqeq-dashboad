import { NextResponse } from 'next/server'

export async function GET() {
  // Return a simple session object for now
  // You can implement proper session management later
  return NextResponse.json({
    user: {
      name: 'Admin User',
      email: 'admin@maraseq.com',
      role: 'admin'
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  })
}
