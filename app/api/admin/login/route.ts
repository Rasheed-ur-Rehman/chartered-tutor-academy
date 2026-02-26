import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { id: 'admin' }
    })

    if (!admin) {
      // Create default admin if doesn't exist
      await prisma.admin.create({
        data: {
          id: 'admin',
          passwordHash: 'Admin'
        }
      })
      
      // Check if password matches default
      if (password === 'Admin') {
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Compare passwords
    if (admin.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}