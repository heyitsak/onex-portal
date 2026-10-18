import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getMemberFromRequest } from '@/lib/member-auth';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMemberFromRequest();
  if (!member) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  const ticketId = parseInt(id);
  if (isNaN(ticketId)) return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
  const ticket = db.tickets.findById(ticketId);
  if (!ticket || ticket.memberId !== member.id) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }
  return NextResponse.json({ ticket, comments: db.ticketComments.findByTicket(ticketId) });
}
