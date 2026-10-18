'use client';

import { useState, useEffect } from 'react';
import { useMember } from '@/components/MemberGuard';

const MAIN_SITE = process.env.NEXT_PUBLIC_MAIN_SITE || 'http://localhost:3000';

export default function ProjectsPage() {
  const { member } = useMember();
  const [mounted, setMounted] = useState(false);
  const [projectInfo, setProjectInfo] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetch(`${MAIN_SITE}/api/content`).then(r => r.json()).then(d => {
      setProjectInfo(d.projectInfo || null);
      setStats(d.stats || null);
    }).catch(() => {});
  }, []);

  if (!mounted || !member) return null;

  const valueStr = projectInfo?.value ? `$${projectInfo.value.toLocaleString()}+` : '—';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-[11px] text-[#5A6275] uppercase tracking-widest font-medium">Ecosystem</span>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#E8ECF4] tracking-tight mt-1">Community Projects</h1>
      </div>
      <div className="card-elevated p-8 lg:p-12">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1 h-4 bg-[#5472E6] rounded-full" />
          <span className="text-[11px] text-[#5A6275] uppercase tracking-widest font-medium">{projectInfo?.title || 'Project Ecosystem Value'}</span>
        </div>
        <div className="mt-4 mb-3">
          <span className="text-4xl lg:text-5xl font-bold text-[#E8ECF4] tabular-nums tracking-tight">{valueStr}</span>
        </div>
        <p className="text-sm text-[#8A92A5] leading-relaxed max-w-2xl">
          {projectInfo?.description || 'The aggregate value of all active projects within our community ecosystem.'}
        </p>
      </div>
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Members', value: stats.members?.toLocaleString() },
            { label: 'Services', value: stats.services?.toLocaleString() },
            { label: 'Projects', value: stats.projects?.toLocaleString() },
            { label: 'Events', value: stats.events?.toLocaleString() },
          ].map(s => (
            <div key={s.label} className="card p-5 text-center">
              <div className="text-2xl font-bold text-[#E8ECF4] tabular-nums">{s.value}</div>
              <div className="text-[11px] text-[#5A6275] mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="card p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1 h-5 bg-[#5472E6] rounded-full" />
          <h2 className="text-sm font-semibold text-[#5A6275] uppercase tracking-wider">About Our Ecosystem</h2>
        </div>
        <div className="space-y-4 text-sm text-[#8A92A5] leading-relaxed">
          <p>OneX SpaceTechnologies operates across 24 disciplines with 300+ services ranging from software development and AI research to datacenter infrastructure and space exploration.</p>
          <p>Our community brings together engineers, researchers, and creators from around the world to collaborate on projects that push the boundaries of what is possible.</p>
          <div className="flex items-center gap-3 text-xs text-[#5A6275] pt-2">
            <span>Founded 2020</span><span className="w-px h-3 bg-[rgba(255,255,255,0.06)]" /><span>Global community</span><span className="w-px h-3 bg-[rgba(255,255,255,0.06)]" /><span>300+ services</span>
          </div>
        </div>
      </div>
    </div>
  );
}
