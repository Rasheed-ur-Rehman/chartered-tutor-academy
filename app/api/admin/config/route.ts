import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const config = await db.admin.getConfig();
  // Don't send the actual password hash in a real app, but for this mock we'll use it for validation
  return NextResponse.json({ password: config.passwordHash });
}

export async function PUT(request: Request) {
  try {
    const { oldPassword, newPassword } = await request.json();
    const config = await db.admin.getConfig();

    if (config.passwordHash !== oldPassword) {
      return NextResponse.json({ error: 'Invalid old password' }, { status: 400 });
    }

    await db.admin.updatePassword(newPassword);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
