import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, setMemberCookie } from '@/lib/member-auth';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 });
    }
    if (!email.includes('@') || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (password.length < 6 || password.length > 128) {
      return NextResponse.json({ error: 'Password must be 6-128 characters' }, { status: 400 });
    }
    if (name.length < 1 || name.length > 100) {
      return NextResponse.json({ error: 'Name must be 1-100 characters' }, { status: 400 });
    }
    if (db.members.findByEmail(email.toLowerCase().trim())) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    const hashed = await hashPassword(password);
    const member = db.members.create({
      email: email.toLowerCase().trim(), password: hashed, name: name.trim(),
      bio: '', avatar: '', role: 'member', joinedAt: Date.now(),
      socialLinks: { discord: '', github: '', twitter: '' },
    });
    await setMemberCookie(member.id);
    const { password: _, ...profile } = member;
    return NextResponse.json({ member: profile }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
