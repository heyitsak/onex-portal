import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getMemberFromRequest } from '@/lib/member-auth';

export async function GET() {
  const member = await getMemberFromRequest();
  if (!member) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  return NextResponse.json({ tickets: db.tickets.findByMember(member.id) });
}

export async function POST(request: Request) {
  const member = await getMemberFromRequest();
  if (!member) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  try {
    const { subject, description, priority } = await request.json();
    if (!subject || !description) {
      return NextResponse.json({ error: 'Subject and description are required' }, { status: 400 });
    }
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    const ticket = db.tickets.create({
      memberId: member.id, subject: String(subject).slice(0, 200),
      description: String(description).slice(0, 5000),
      priority: validPriorities.includes(priority) ? priority : 'medium', status: 'open',
    });
    return NextResponse.json({ ticket }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
