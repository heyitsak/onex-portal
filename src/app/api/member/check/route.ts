import { NextResponse } from 'next/server';
import { getMemberFromRequest } from '@/lib/member-auth';

export async function GET() {
  const member = await getMemberFromRequest();
  if (!member) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, member });
}
