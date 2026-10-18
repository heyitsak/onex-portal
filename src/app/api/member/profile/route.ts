import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getMemberFromRequest } from '@/lib/member-auth';

export async function GET() {
  const member = await getMemberFromRequest();
  if (!member) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  return NextResponse.json({ member });
}

export async function PATCH(request: Request) {
  const current = await getMemberFromRequest();
  if (!current) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  try {
    const { name, bio, avatar, socialLinks } = await request.json();
    const updates: Record<string, any> = {};
    if (typeof name === 'string' && name.length <= 100) updates.name = name.trim();
    if (typeof bio === 'string' && bio.length <= 500) updates.bio = bio.trim();
    if (typeof avatar === 'string' && avatar.length <= 500) updates.avatar = avatar.trim();
    if (socialLinks && typeof socialLinks === 'object') {
      updates.socialLinks = {
        discord: typeof socialLinks.discord === 'string' ? socialLinks.discord.slice(0, 200) : '',
        github: typeof socialLinks.github === 'string' ? socialLinks.github.slice(0, 200) : '',
        twitter: typeof socialLinks.twitter === 'string' ? socialLinks.twitter.slice(0, 200) : '',
      };
    }
    const updated = db.members.update(current.id, updates);
    if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    const { password, ...profile } = updated;
    return NextResponse.json({ member: profile });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
