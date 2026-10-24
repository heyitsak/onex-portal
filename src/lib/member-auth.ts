import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { db, type Member } from './db';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is missing.');
    }
    return 'dev-secret-do-not-use-in-production';
  }
  return secret;
}

const COOKIE_NAME = 'onex_member_token';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export function signMemberToken(memberId: number): string {
  return jwt.sign({ memberId, type: 'member' }, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyMemberToken(token: string): { memberId: number } | null {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as { memberId: number; type: string };
    if (payload.type !== 'member') return null;
    return { memberId: payload.memberId };
  } catch { return null; }
}

export async function setMemberCookie(memberId: number) {
  const token = signMemberToken(memberId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', maxAge: 604800, path: '/',
  });
}

export async function clearMemberCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getMemberFromRequest(): Promise<Omit<Member, 'password'> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyMemberToken(token);
  if (!payload) return null;
  const member = db.members.findById(payload.memberId);
  if (!member) return null;
  const { password, ...profile } = member;
  return profile;
}
