'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/components/MemberGuard';

const priorityBadge: Record<string, string> = {
  low: 'bg-[rgba(84,114,230,0.1)] text-[#5472E6]',
  medium: 'bg-[rgba(255,255,255,0.04)] text-[#8A92A5]',
  high: 'bg-[rgba(229,84,84,0.1)] text-[#E55454]',
  urgent: 'bg-[rgba(229,84,84,0.15)] text-[#E55454]',
};

const statusBadge: Record<string, string> = {
  open: 'bg-[rgba(84,114,230,0.1)] text-[#5472E6]',
  'in-progress': 'bg-[rgba(84,229,138,0.1)] text-[#54E58A]',
  resolved: 'bg-[rgba(84,229,138,0.1)] text-[#54E58A]',
  closed: 'bg-[rgba(255,255,255,0.04)] text-[#5A6275]',
};

export default function TicketsPage() {
  const router = useRouter();
  const { member } = useMember();
  const [mounted, setMounted] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setMounted(true);
    fetch('/api/tickets').then(r => r.json()).then(d => setTickets(d.tickets || [])).catch(() => {});
  }, []);

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);
  if (!mounted || !member) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] text-[#5A6275] uppercase tracking-widest font-medium">Support</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#E8ECF4] tracking-tight mt-1">Tickets</h1>
        </div>
        <button onClick={() => router.push('/dashboard/tickets/new')} className="btn-primary px-5 py-2.5 text-sm">
          New Ticket
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'open', 'in-progress', 'resolved', 'closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors capitalize ${
              filter === f
                ? 'bg-[rgba(84,114,230,0.1)] border-[rgba(84,114,230,0.3)] text-[#5472E6]'
                : 'border-[rgba(255,255,255,0.06)] text-[#5A6275] hover:border-[rgba(255,255,255,0.15)] hover:text-[#8A92A5]'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-[#5A6275]">No tickets found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(ticket => (
            <button key={ticket.id} onClick={() => router.push(`/dashboard/tickets/${ticket.id}`)}
              className="card card-interactive p-5 w-full text-left flex items-center justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-[#E8ECF4] truncate">{ticket.subject}</div>
                <div className="text-xs text-[#5A6275] mt-1">
                  {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${priorityBadge[ticket.priority] || ''}`}>
                  {ticket.priority}
                </span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${statusBadge[ticket.status] || ''}`}>
                  {ticket.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
