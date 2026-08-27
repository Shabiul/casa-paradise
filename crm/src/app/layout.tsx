'use client';

import React, { useState } from 'react';
import './globals.css';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import QuickBookingModal from '@/components/QuickBookingModal';
import { usePathname } from 'next/navigation';

// Inner shell — only renders Sidebar/Topbar when authenticated
function CRMShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [quickModalType, setQuickModalType] = useState<'room' | 'vehicle' | 'dining' | 'maintenance' | null>(null);

  if (isLoginPage || !user) {
    // Render login page without chrome
    return <>{children}</>;
  }

  return (
    <div className="crm-layout">
      <Sidebar />
      <div className="crm-main-viewport">
        <Topbar onOpenQuickModal={(type) => setQuickModalType(type)} />
        <main className="crm-content">
          {children}
        </main>
      </div>
      {quickModalType && (
        <QuickBookingModal
          initialTab={quickModalType}
          onClose={() => setQuickModalType(null)}
        />
      )}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Casa Paradiso — Operations &amp; Management CRM</title>
        <meta name="description" content="Boutique Luxury Heritage Hotel Management CRM &amp; Operations Suite" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <AuthGuard>
            <CRMShell>
              {children}
            </CRMShell>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
