'use client';

import React, { useState } from 'react';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import QuickBookingModal from '@/components/QuickBookingModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [quickModalType, setQuickModalType] = useState<'room' | 'vehicle' | 'dining' | 'maintenance' | null>(null);

  return (
    <html lang="en">
      <head>
        <title>Casa Paradiso — Operations & Management CRM</title>
        <meta name="description" content="Boutique Luxury Heritage Hotel Management CRM & Operations Suite" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="crm-layout">
          <Sidebar />
          <div className="crm-main-viewport">
            <Topbar onOpenQuickModal={(type) => setQuickModalType(type)} />
            <main className="crm-content">
              {children}
            </main>
          </div>
        </div>

        {quickModalType && (
          <QuickBookingModal
            initialTab={quickModalType}
            onClose={() => setQuickModalType(null)}
          />
        )}
      </body>
    </html>
  );
}
