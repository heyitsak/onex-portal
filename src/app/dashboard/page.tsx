'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMember } from '@/components/MemberGuard';

const quickActions = [
  { label: 'New Ticket', href: '/dashboard/tickets/new', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
  { label: 'Browse Services', href: '/dashboard/services', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { label: 'My Tickets', href: '/dashboard/tickets', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'View Projects', href: '/dashboard/projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { member } = useMember();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !member) return null;

  const joined = new Date(member.joinedAt);
  const now = new Date();
  let years = now.getFullYear() - joined.getFullYear();
  let months = now.getMonth() - joined.getMonth();
  if (months < 0) { years--; months += 12; }
  const durationStr = years > 0 ? `${years}y ${months}m` : `${months}m`;

  const hour = now.getHours();
  const greeting = hour >= 5 && hour < 12 ? 'Good morning' :
    hour >= 12 && hour < 17 ? 'Good afternoon' :
    hour >= 17 && hour < 21 ? 'Good evening' : 'Late night';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[rgba(84,114,230,0.5)]" />
          <span className="text-[11px] text-[#5A6275] uppercase tracking-widest font-medium">Welcome back</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#E8ECF4] tracking-tight">
          {greeting}, {member.name}
        </h1>
        <p className="text-sm text-[#5A6275] mt-1">Member for {durationStr}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Member Since', value: joined.getFullYear().toString() },
          { label: 'Status', value: 'Active' },
          { label: 'Services', value: '300+' },
          { label: 'Ecosystem', value: '$28.7B+' },
        ].map(stat => (
          <div key={stat.label} className="card p-5">
            <div className="text-2xl font-bold text-[#E8ECF4] tabular-nums">{stat.value}</div>
            <div className="text-[11px] text-[#5A6275] mt-0.5 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-[#5A6275] mb-4 uppercase tracking-wider">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className="card card-interactive p-5 text-left"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#5472E6] mb-3">
                <path d={action.icon} />
              </svg>
              <div className="text-sm font-semibold text-[#8A92A5]">{action.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 bg-[#5472E6] rounded-full" />
          <h2 className="text-sm font-semibold text-[#5A6275] uppercase tracking-wider">OneX SpaceTechnologies</h2>
        </div>
        <p className="text-sm text-[#5A6275] leading-relaxed max-w-2xl">
          Welcome to the member portal. Manage your profile, browse available services, submit support tickets, and track community projects — all from one place.
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-[#5A6275]">
          <span>{durationStr} and counting</span>
          <span className="w-px h-3 bg-[rgba(255,255,255,0.06)]" />
          <span>Member since {joined.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
