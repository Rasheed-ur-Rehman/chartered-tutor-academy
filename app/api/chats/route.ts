import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  return NextResponse.json(db.chats.getAll());
}

export async function POST(request: Request) {
  const data = await request.json();
  const newChat = db.chats.add(data);
  // In a real app, you would send an auto-reply email here
  return NextResponse.json(newChat);
}

export async function PUT(request: Request) {
  const { id, adminReply } = await request.json();
  if (id && adminReply) {
    db.chats.reply(id, adminReply);
    // In a real app, you would send the admin reply to the user's email here
  }
  return NextResponse.json({ success: true });
}
