'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Car,
  UtensilsCrossed,
  Sparkles,
  Users,
  Receipt,
  BarChart3,
  Settings,
  ExternalLink,
  ShieldCheck,
  BellRing
} from 'lucide-react';
import { getCRMStore, subscribeToCRM } from '@/lib/crmStore';

export default function Sidebar() {
  const pathname = usePathname();
  const [pendingRooms, setPendingRooms] = useState(0);
  const [pendingVehicles, setPendingVehicles] = useState(0);
  const [pendingDining, setPendingDining] = useState(0);
  const [dirtyRooms, setDirtyRooms] = useState(0);

  useEffect(() => {
    const update = () => {
      const store = getCRMStore();
      setPendingRooms(store.roomBookings.filter(b => b.status === 'pending').length);
      setPendingVehicles(store.vehicleBookings.filter(b => b.status === 'pending').length);
      setPendingDining(store.diningBookings.filter(b => b.status === 'pending').length);
      setDirtyRooms(store.rooms.filter(r => r.cleanliness === 'dirty' || r.cleanliness === 'cleaning_in_progress').length);
    };

    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  const navItems = [
    { href: '/', label: 'Executive Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/calendar', label: 'Tape Chart Grid', icon: CalendarDays },
    { href: '/rooms', label: 'Rooms & Front Desk', icon: BedDouble, badge: pendingRooms },
    { href: '/vehicles', label: 'Fleet & Rentals', icon: Car, badge: pendingVehicles },
    { href: '/dining', label: 'Dining & Tables', icon: UtensilsCrossed, badge: pendingDining },
    { href: '/housekeeping', label: 'Housekeeping & Maint.', icon: Sparkles, badge: dirtyRooms },
    { href: '/guests', label: 'Guest 360 CRM', icon: Users },
    { href: '/billing', label: 'Billing & Folios', icon: Receipt },
    { href: '/analytics', label: 'Financial Analytics', icon: BarChart3 },
    { href: '/settings', label: 'Rates & Settings', icon: Settings }
  ];

  return (
    <aside className="crm-sidebar">
      {/* Brand Header */}
      <div className="crm-sidebar-brand">
        <div className="crm-brand-badge">CP</div>
        <div>
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.4px' }}>
            Casa Paradiso
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>
            Operations & CRM
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="crm-nav-list">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`crm-nav-item ${isActive ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="crm-nav-badge">{item.badge}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Footer Link */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '12.5px',
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <ExternalLink size={15} />
          <span>Launch Guest Website</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <ShieldCheck size={13} color="#059669" />
          <span>Panaji Hotel Desk · v2.0</span>
        </div>
      </div>
    </aside>
  );
}
