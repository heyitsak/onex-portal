import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getMemberFromRequest } from '@/lib/member-auth';

export async function GET() {
  const member = await getMemberFromRequest();
  if (!member) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  return NextResponse.json({ requests: db.serviceRequests.findByMember(member.id) });
}
