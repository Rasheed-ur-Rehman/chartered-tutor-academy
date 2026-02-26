import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ADMIN_ID = 'admin'

export async function GET() {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: ADMIN_ID }
    })
    
    return NextResponse.json({ exists: !!admin })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { oldPassword, newPassword } = await request.json()
    
    const admin = await prisma.admin.findUnique({
      where: { id: ADMIN_ID }
    })
    
    if (!admin) {
      // Create admin if doesn't exist
      await prisma.admin.create({
        data: {
          id: ADMIN_ID,
          passwordHash: newPassword
        }
      })
      return NextResponse.json({ success: true })
    }
    
    // Verify old password
    if (admin.passwordHash !== oldPassword) {
      return NextResponse.json({ error: 'Invalid old password' }, { status: 401 })
    }
    
    // Update password
    await prisma.admin.update({
      where: { id: ADMIN_ID },
      data: { passwordHash: newPassword }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating admin:', error)
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
  }
}