import MemberGuard from '@/components/MemberGuard';
import Sidebar from '@/components/Sidebar';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MemberGuard>
      <div className="min-h-screen bg-[#0A0C10] flex">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 lg:p-8 pt-16 lg:pt-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </MemberGuard>
  );
}
