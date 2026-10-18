'use client';

import { useState, useEffect } from 'react';
import { useMember } from '@/components/MemberGuard';

export default function ProfilePage() {
  const { member, setMember } = useMember();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [discord, setDiscord] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setMounted(true);
    if (member) {
      setName(member.name); setBio(member.bio);
      setDiscord(member.socialLinks?.discord || '');
      setGithub(member.socialLinks?.github || '');
      setTwitter(member.socialLinks?.twitter || '');
    }
  }, [member]);

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try {
      const res = await fetch('/api/member/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, socialLinks: { discord, github, twitter } }),
      });
      const data = await res.json();
      if (res.ok) { setMember(data.member); setMsg('Profile saved'); }
      else setMsg(data.error || 'Save failed');
    } catch { setMsg('Connection error'); }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  if (!mounted || !member) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <span className="text-[11px] text-[#5A6275] uppercase tracking-widest font-medium">Settings</span>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#E8ECF4] tracking-tight mt-1">Your Profile</h1>
      </div>
      <div className="space-y-6">
        <div className="card p-6 lg:p-8">
          <h2 className="text-sm font-semibold text-[#5A6275] uppercase tracking-wider mb-6">Personal Info</h2>
          <div className="space-y-5">
            <div>
              <label className="label">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" />
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} maxLength={500} className="input resize-none" placeholder="Tell us about yourself..." />
              <p className="text-[11px] text-[#5A6275] mt-1.5">{bio.length}/500</p>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={member.email} disabled className="input opacity-50 cursor-not-allowed" />
              <p className="text-[11px] text-[#5A6275] mt-1.5">Email cannot be changed</p>
            </div>
          </div>
        </div>
        <div className="card p-6 lg:p-8">
          <h2 className="text-sm font-semibold text-[#5A6275] uppercase tracking-wider mb-6">Social Links</h2>
          <div className="space-y-5">
            <div><label className="label">Discord</label><input type="text" value={discord} onChange={e => setDiscord(e.target.value)} className="input" placeholder="username#0000" /></div>
            <div><label className="label">GitHub</label><input type="text" value={github} onChange={e => setGithub(e.target.value)} className="input" placeholder="https://github.com/username" /></div>
            <div><label className="label">Twitter / X</label><input type="text" value={twitter} onChange={e => setTwitter(e.target.value)} className="input" placeholder="https://x.com/username" /></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={saving} className="btn-primary px-6 py-2.5 text-sm">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {msg && <span className={`text-xs ${msg === 'Profile saved' ? 'text-[#54E58A]' : 'text-[#E55454]'}`}>{msg}</span>}
        </div>
      </div>
    </div>
  );
}
