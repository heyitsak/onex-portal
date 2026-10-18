'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    fetch('/api/member/check').then(r => { if (r.ok) router.replace('/dashboard'); }).catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) router.push('/dashboard');
      else setError(data.error || 'Login failed');
    } catch { setError('Connection error'); }
    setLoading(false);
  };

  const anim = (i: number) => mounted ? { opacity: 1, transform: 'translateY(0)', transition: `all 0.5s ${0.1 + i * 0.08}s cubic-bezier(0.22, 1, 0.36, 1)` } : {};

  return (
    <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div style={anim(0)} className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#5472E6] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-sm font-bold">X</span>
          </div>
          <h1 className="text-lg font-bold text-[#E8ECF4] tracking-tight">Sign In</h1>
          <p className="text-xs text-[#5A6275] mt-1">Access your member portal</p>
        </div>
        <div style={anim(1)} className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus className="input" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required className="input" />
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-[rgba(229,84,84,0.1)] border border-[rgba(229,84,84,0.2)] text-[#E55454] text-xs">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-sm">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <div style={anim(2)} className="text-center mt-6">
          <p className="text-xs text-[#5A6275]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#5472E6] hover:text-[#6384F2] transition-colors font-medium">Create one</Link>
          </p>
          <Link href="/" className="inline-block mt-3 text-[11px] text-[#5A6275] hover:text-[#8A92A5] transition-colors">&larr; Back to home</Link>
        </div>
      </div>
    </div>
  );
}
