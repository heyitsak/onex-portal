'use client';

import { useState, useEffect } from 'react';
import { useMember } from '@/components/MemberGuard';

const MAIN_SITE = process.env.NEXT_PUBLIC_MAIN_SITE || 'http://localhost:3000';

interface ServiceItem { id: number; title: string; description: string; icon: string; category: string; }

export default function ServicesPage() {
  const { member } = useMember();
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState<ServiceItem | null>(null);
  const [reqDesc, setReqDesc] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    fetch(`${MAIN_SITE}/api/content`).then(r => r.json()).then(d => {
      if (d.services) setServices(d.services);
    }).catch(() => {});
    fetch('/api/services/requests').then(r => r.json()).then(d => setRequests(d.requests || [])).catch(() => {});
  }, [mounted]);

  const categories = ['All', ...new Set(services.map(s => s.category))];
  const filtered = services.filter(s => {
    if (category !== 'All' && s.category !== category) return false;
    if (search) { const q = search.toLowerCase(); return s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q); }
    return true;
  });

  const handleRequest = async (service: ServiceItem) => {
    if (!reqDesc.trim()) return;
    setSending(true);
    try {
      const res = await fetch('/api/services/request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: service.id, serviceTitle: service.title, description: reqDesc }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(prev => [data.request, ...prev]);
        setShowForm(null); setReqDesc('');
      }
    } catch {}
    setSending(false);
  };

  if (!mounted || !member) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-[11px] text-[#5A6275] uppercase tracking-widest font-medium">Catalog</span>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#E8ECF4] tracking-tight mt-1">Services</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..." className="input max-w-xs" />
        <div className="flex gap-2 flex-wrap">
          {categories.slice(0, 8).map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                category === c
                  ? 'bg-[rgba(84,114,230,0.1)] border-[rgba(84,114,230,0.3)] text-[#5472E6]'
                  : 'border-[rgba(255,255,255,0.06)] text-[#5A6275] hover:border-[rgba(255,255,255,0.15)] hover:text-[#8A92A5]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {requests.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#5A6275] mb-4 uppercase tracking-wider">My Requests</h2>
          <div className="space-y-2">
            {requests.slice(0, 5).map(r => (
              <div key={r.id} className="card p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-[#E8ECF4]">{r.serviceTitle}</div>
                  <div className="text-xs text-[#5A6275] mt-0.5">{r.description}</div>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                  r.status === 'pending' ? 'bg-[rgba(84,114,230,0.1)] text-[#5472E6]' :
                  r.status === 'completed' ? 'bg-[rgba(84,230,138,0.1)] text-[#54E58A]' :
                  'bg-[rgba(255,255,255,0.04)] text-[#5A6275]'
                }`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.slice(0, 30).map(service => (
          <div key={service.id} className="card p-5">
            <h3 className="text-sm font-semibold text-[#E8ECF4] mb-1.5">{service.title}</h3>
            <p className="text-xs text-[#8A92A5] leading-relaxed line-clamp-2 mb-3">{service.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#5A6275] uppercase tracking-wider">{service.category}</span>
              <button onClick={() => setShowForm(service)} className="text-[11px] font-medium text-[#5472E6] hover:text-[#6384F2] transition-colors">
                Request
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.7)] flex items-center justify-center p-6" onClick={() => setShowForm(null)}>
          <div className="card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-[#E8ECF4] mb-1">Request Service</h3>
            <p className="text-xs text-[#5A6275] mb-4">{showForm.title}</p>
            <textarea value={reqDesc} onChange={e => setReqDesc(e.target.value)} rows={3} className="input mb-4 resize-none" placeholder="Describe what you need..." />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(null)} className="btn-ghost text-sm">Cancel</button>
              <button onClick={() => handleRequest(showForm)} disabled={sending || !reqDesc.trim()} className="btn-primary text-sm px-5 py-2">
                {sending ? 'Sending...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
