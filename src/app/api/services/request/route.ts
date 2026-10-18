import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getMemberFromRequest } from '@/lib/member-auth';

export async function POST(request: Request) {
  const member = await getMemberFromRequest();
  if (!member) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  try {
    const { serviceId, serviceTitle, description } = await request.json();
    if (!serviceId || !serviceTitle) {
      return NextResponse.json({ error: 'Service ID and title are required' }, { status: 400 });
    }
    const req = db.serviceRequests.create({
      memberId: member.id, serviceId, serviceTitle: String(serviceTitle).slice(0, 200),
      description: String(description || '').slice(0, 2000), status: 'pending',
    });
    return NextResponse.json({ request: req }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
