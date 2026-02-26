import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tutors = await prisma.tutor.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(tutors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tutors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const tutor = await prisma.tutor.create({
      data: {
        ...data,
        status: 'pending',
        availability: 'Open',
        tuitionType: data.tuitionType || []
      }
    });
    return NextResponse.json(tutor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tutor' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status, ...data } = await request.json();
    
    if (status) {
      // Update only status
      const tutor = await prisma.tutor.update({
        where: { id },
        data: { status }
      });
      return NextResponse.json(tutor);
    } else {
      // Update full tutor
      const tutor = await prisma.tutor.update({
        where: { id },
        data
      });
      return NextResponse.json(tutor);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tutor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    await prisma.tutor.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tutor' }, { status: 500 });
  }
}