import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  return NextResponse.json(db.students.getAll());
}

export async function POST(request: Request) {
  const data = await request.json();
  const newStudent = db.students.add(data);
  return NextResponse.json(newStudent);
}

export async function PUT(request: Request) {
  const { id, status, ...rest } = await request.json();
  if (status) {
    db.students.updateStatus(id, status);
  }
  if (Object.keys(rest).length > 0) {
    db.students.update(id, rest);
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    db.students.delete(id);
  }
  return NextResponse.json({ success: true });
}
