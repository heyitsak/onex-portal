'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PortalHome() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/member/check').then(r => {
      if (r.ok) router.replace('/dashboard');
      else setChecked(true);
    }).catch(() => setChecked(true));
  }, [router]);

  if (!mounted || !checked) return null;

  return (
    <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        <div className="w-12 h-12 rounded-xl bg-[#5472E6] flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-lg font-bold">X</span>
        </div>
        <h1 className="text-4xl font-bold text-[#E8ECF4] tracking-tight mb-2">
          OneX
        </h1>
        <p className="text-lg text-[#8A92A5] font-light mb-2">Member Portal</p>
        <p className="text-sm text-[#5A6275] font-light mb-10 max-w-sm mx-auto">
          Access your dashboard, manage services, submit tickets, and track community projects.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="btn-primary px-8 py-3 text-sm">
            Sign In
          </Link>
          <Link href="/register" className="btn-secondary px-8 py-3 text-sm">
            Create Account
          </Link>
        </div>
        <div className="mt-12 flex items-center justify-center gap-4 text-xs text-[#5A6275]">
          <a href="http://localhost:3000" className="hover:text-[#8A92A5] transition-colors">&larr; Main Site</a>
          <span className="w-px h-3 bg-[rgba(255,255,255,0.06)]" />
          <span>OneX SpaceTechnologies</span>
        </div>
      </div>
    </div>
  );
}
