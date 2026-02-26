import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test the connection
    await prisma.$connect()
    
    // Try to count students
    const count = await prisma.student.count()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected!',
      studentCount: count 
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}