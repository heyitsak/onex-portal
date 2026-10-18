'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMember } from '@/components/MemberGuard';

const statusBadge: Record<string, string> = {
  open: 'bg-[rgba(84,114,230,0.1)] text-[#5472E6]',
  'in-progress': 'bg-[rgba(84,229,138,0.1)] text-[#54E58A]',
  resolved: 'bg-[rgba(84,229,138,0.1)] text-[#54E58A]',
  closed: 'bg-[rgba(255,255,255,0.04)] text-[#5A6275]',
};

const priorityBadge: Record<string, string> = {
  low: 'bg-[rgba(84,114,230,0.1)] text-[#5472E6]',
  medium: 'bg-[rgba(255,255,255,0.04)] text-[#8A92A5]',
  high: 'bg-[rgba(229,84,84,0.1)] text-[#E55454]',
  urgent: 'bg-[rgba(229,84,84,0.15)] text-[#E55454]',
};

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { member } = useMember();
  const [mounted, setMounted] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!params.id) return;
    fetch(`/api/tickets/${params.id}`)
      .then(async r => {
        if (r.ok) { const d = await r.json(); setTicket(d.ticket); setComments(d.comments || []); }
        else router.replace('/dashboard/tickets');
      })
      .catch(() => router.replace('/dashboard/tickets'))
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handleComment = async () => {
    if (!newComment.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/tickets/${params.id}/comments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments(prev => [...prev, data.comment]);
        setNewComment('');
      }
    } catch {}
    setSending(false);
  };

  if (!mounted || !member) return null;
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 border-[rgba(255,255,255,0.1)] border-t-[#5472E6] animate-spin" />
    </div>
  );
  if (!ticket) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <button onClick={() => router.push('/dashboard/tickets')} className="btn-ghost text-sm self-start">
        &larr; Back to Tickets
      </button>

      <div className="card p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${statusBadge[ticket.status] || ''}`}>
            {ticket.status}
          </span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${priorityBadge[ticket.priority] || ''}`}>
            {ticket.priority}
          </span>
          <span className="text-[11px] text-[#5A6275]">
            {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-[#E8ECF4] tracking-tight mb-3">{ticket.subject}</h1>
        <p className="text-sm text-[#8A92A5] leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
      </div>

      {comments.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#5A6275] uppercase tracking-wider">Comments ({comments.length})</h2>
          {comments.map(c => (
            <div key={c.id} className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-[#E8ECF4]">{c.authorName}</span>
                <span className="text-[10px] text-[#5A6275]">
                  {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-[#8A92A5] leading-relaxed">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {ticket.status !== 'closed' && (
        <div className="card p-5">
          <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} className="input resize-none mb-3" placeholder="Add a comment..." />
          <div className="flex justify-end">
            <button onClick={handleComment} disabled={sending || !newComment.trim()} className="btn-primary text-sm px-5 py-2">
              {sending ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
