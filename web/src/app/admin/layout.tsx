import type { Metadata } from 'next';
import AdminShell from './AdminShell';

// Admin/CRM area must never be indexed, cached, or surfaced by search or AI
// crawlers — it is a private operational dashboard, not public hotel content.
export const metadata: Metadata = {
  title: 'Admin — Casa Paradiso',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
