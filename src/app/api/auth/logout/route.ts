import { NextResponse } from 'next/server';
import { clearMemberCookie } from '@/lib/member-auth';

export async function POST() {
  await clearMemberCookie();
  return NextResponse.json({ ok: true });
}
