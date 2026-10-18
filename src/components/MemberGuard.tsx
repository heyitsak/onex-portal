'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface Member {
  id: number; email: string; name: string; bio: string; avatar: string;
  role: string; joinedAt: number;
  socialLinks: { discord: string; github: string; twitter: string };
}

export default function MemberGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/member/check')
      .then(async r => { if (r.ok) setMember((await r.json()).member); else router.replace('/login'); })
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[rgba(255,255,255,0.1)] border-t-[#5472E6] animate-spin" />
    </div>
  );
  if (!member) return null;
  return <>{children}</>;
}

export function useMember() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/member/check')
      .then(async r => { if (r.ok) setMember((await r.json()).member); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { member, loading, setMember };
}
