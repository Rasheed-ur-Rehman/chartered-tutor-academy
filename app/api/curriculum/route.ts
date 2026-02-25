import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  return NextResponse.json(await db.curricula.getAll());
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const newCurriculum = await db.curricula.add(name);
  return NextResponse.json(newCurriculum);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    await db.curricula.delete(id);
  }
  return NextResponse.json({ success: true });
}
