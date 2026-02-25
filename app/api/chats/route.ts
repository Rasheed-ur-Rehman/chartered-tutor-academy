import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  return NextResponse.json(await db.chats.getAll());
}

export async function POST(request: Request) {
  const data = await request.json();
  const newChat = await db.chats.add(data);
  // In a real app, you would send an auto-reply email here
  return NextResponse.json(newChat);
}

export async function PUT(request: Request) {
  const { id, adminReply } = await request.json();
  if (id && adminReply) {
    await db.chats.reply(id, adminReply);
    // In a real app, you would send the admin reply to the user's email here
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    await db.chats.delete(id);
  }
  return NextResponse.json({ success: true });
}
