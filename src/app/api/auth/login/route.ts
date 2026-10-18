import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, setMemberCookie } from '@/lib/member-auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const member = db.members.findByEmail(email.toLowerCase().trim());
    if (!member || !(await verifyPassword(password, member.password))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    await setMemberCookie(member.id);
    const { password: _, ...profile } = member;
    return NextResponse.json({ member: profile });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
