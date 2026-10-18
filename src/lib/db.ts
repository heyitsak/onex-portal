import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(process.cwd(), 'data');

function ensureDir() {
  if (!fs.existsSync(DB_PATH)) {
    try { fs.mkdirSync(DB_PATH, { recursive: true }); } catch {}
  }
}

function readTable<T>(name: string): T[] {
  ensureDir();
  const file = path.join(DB_PATH, `${name}.json`);
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {}
  return [];
}

function writeSilent<T>(name: string, data: T[]): void {
  try {
    ensureDir();
    const file = path.join(DB_PATH, `${name}.json`);
    const tmp = file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmp, file);
  } catch {}
}

export interface Member {
  id: number; email: string; password: string; name: string; bio: string;
  avatar: string; role: string; joinedAt: number;
  socialLinks: { discord: string; github: string; twitter: string };
}
export interface ServiceRequest {
  id: number; memberId: number; serviceId: number; serviceTitle: string;
  description: string; status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: number; updatedAt: number;
}
export interface Ticket {
  id: number; memberId: number; subject: string; description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: number; updatedAt: number;
}
export interface TicketComment {
  id: number; ticketId: number; memberId: number; authorName: string;
  content: string; createdAt: number;
}

let autoId = Date.now();
function nextId(): number { return autoId++; }

export const db = {
  members: {
    all: (): Member[] => readTable<Member>('members'),
    find: (predicate: (m: Member) => boolean): Member | undefined => readTable<Member>('members').find(predicate),
    findById: (id: number): Member | undefined => readTable<Member>('members').find(m => m.id === id),
    findByEmail: (email: string): Member | undefined => readTable<Member>('members').find(m => m.email === email),
    create: (data: Omit<Member, 'id'>): Member => {
      const items = readTable<Member>('members');
      const item: Member = { ...data, id: nextId() };
      items.push(item); writeSilent('members', items); return item;
    },
    update: (id: number, data: Partial<Member>): Member | undefined => {
      const items = readTable<Member>('members');
      const idx = items.findIndex(m => m.id === id);
      if (idx === -1) return;
      items[idx] = { ...items[idx], ...data };
      writeSilent('members', items); return items[idx];
    },
    count: (): number => readTable<Member>('members').length,
  },
  serviceRequests: {
    all: (): ServiceRequest[] => readTable<ServiceRequest>('service_requests'),
    findByMember: (memberId: number): ServiceRequest[] =>
      readTable<ServiceRequest>('service_requests').filter(r => r.memberId === memberId),
    findById: (id: number): ServiceRequest | undefined =>
      readTable<ServiceRequest>('service_requests').find(r => r.id === id),
    create: (data: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): ServiceRequest => {
      const items = readTable<ServiceRequest>('service_requests');
      const now = Date.now();
      const item: ServiceRequest = { ...data, id: nextId(), createdAt: now, updatedAt: now };
      items.push(item); writeSilent('service_requests', items); return item;
    },
  },
  tickets: {
    all: (): Ticket[] => readTable<Ticket>('tickets'),
    findByMember: (memberId: number): Ticket[] =>
      readTable<Ticket>('tickets').filter(t => t.memberId === memberId),
    findById: (id: number): Ticket | undefined =>
      readTable<Ticket>('tickets').find(t => t.id === id),
    create: (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Ticket => {
      const items = readTable<Ticket>('tickets');
      const now = Date.now();
      const item: Ticket = { ...data, id: nextId(), createdAt: now, updatedAt: now };
      items.push(item); writeSilent('tickets', items); return item;
    },
    update: (id: number, data: Partial<Ticket>): Ticket | undefined => {
      const items = readTable<Ticket>('tickets');
      const idx = items.findIndex(t => t.id === id);
      if (idx === -1) return;
      items[idx] = { ...items[idx], ...data, updatedAt: Date.now() };
      writeSilent('tickets', items); return items[idx];
    },
  },
  ticketComments: {
    all: (): TicketComment[] => readTable<TicketComment>('ticket_comments'),
    findByTicket: (ticketId: number): TicketComment[] =>
      readTable<TicketComment>('ticket_comments').filter(c => c.ticketId === ticketId),
    create: (data: Omit<TicketComment, 'id' | 'createdAt'>): TicketComment => {
      const items = readTable<TicketComment>('ticket_comments');
      const item: TicketComment = { ...data, id: nextId(), createdAt: Date.now() };
      items.push(item); writeSilent('ticket_comments', items); return item;
    },
  },
};
