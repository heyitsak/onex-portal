'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/components/MemberGuard';

export default function NewTicketPage() {
  const router = useRouter();
  const { member } = useMember();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  if (!member) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) { setError('All fields required'); return; }
    setSending(true); setError('');
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, description, priority }),
      });
      const data = await res.json();
      if (res.ok) router.push(`/dashboard/tickets/${data.ticket.id}`);
      else setError(data.error || 'Failed to create ticket');
    } catch { setError('Connection error'); }
    setSending(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <span className="text-[11px] text-[#5A6275] uppercase tracking-widest font-medium">Support</span>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#E8ECF4] tracking-tight mt-1">New Ticket</h1>
      </div>
      <form onSubmit={handleSubmit} className="card p-6 lg:p-8 space-y-6">
        <div>
          <label className="label">Subject</label>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief summary of your issue" className="input" autoFocus />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} className="input resize-none" placeholder="Describe your issue in detail..." />
        </div>
        <div>
          <label className="label">Priority</label>
          <div className="flex gap-2">
            {['low', 'medium', 'high', 'urgent'].map(p => (
              <button key={p} type="button" onClick={() => setPriority(p)}
                className={`px-4 py-2 text-xs font-medium rounded-md border transition-colors capitalize ${
                  priority === p
                    ? 'bg-[rgba(84,114,230,0.1)] border-[rgba(84,114,230,0.3)] text-[#5472E6]'
                    : 'border-[rgba(255,255,255,0.06)] text-[#5A6275] hover:border-[rgba(255,255,255,0.15)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <div className="p-3 rounded-lg bg-[rgba(229,84,84,0.1)] border border-[rgba(229,84,84,0.2)] text-[#E55454] text-xs">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="btn-ghost text-sm">Cancel</button>
          <button type="submit" disabled={sending} className="btn-primary px-6 py-2.5 text-sm">
            {sending ? 'Creating...' : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}
