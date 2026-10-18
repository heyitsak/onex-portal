'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const links = [
  { label: 'Dashboard', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Profile', href: '/dashboard/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { label: 'Services', href: '/dashboard/services', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { label: 'Tickets', href: '/dashboard/tickets', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Projects', href: '/dashboard/projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-[#0A0C10]/90 backdrop-blur-md border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#8A92A5] hover:text-[#E8ECF4] transition-colors"
        aria-label="Menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {mobileOpen
            ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>}
        </svg>
      </button>

      <aside className={`fixed lg:sticky top-0 left-0 h-full lg:h-screen w-64 z-40 flex-shrink-0 transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full bg-[#0A0C10] border-r border-[rgba(255,255,255,0.04)] flex flex-col">
          <div className="px-6 py-6 border-b border-[rgba(255,255,255,0.04)]">
            <a href="/dashboard" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#5472E6] flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">X</span>
              </div>
              <span className="text-sm font-semibold text-[#E8ECF4]">Portal</span>
            </a>
          </div>
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {links.map(link => {
              const active = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => { e.preventDefault(); setMobileOpen(false); router.push(link.href); }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-[rgba(84,114,230,0.1)] text-[#5472E6]'
                      : 'text-[#5A6275] hover:text-[#8A92A5] hover:bg-[rgba(255,255,255,0.02)]'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
                    <path d={link.icon} />
                  </svg>
                  <span className="font-medium">{link.label}</span>
                </a>
              );
            })}
          </nav>
          <div className="px-3 py-4 border-t border-[rgba(255,255,255,0.04)]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#5A6275] hover:text-[#E55454] hover:bg-[rgba(229,84,84,0.04)] transition-colors w-full"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
