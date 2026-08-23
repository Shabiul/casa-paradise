'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './admin.css';
import {
  LayoutDashboard,
  BedDouble,
  Car,
  UtensilsCrossed,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  PlusCircle,
  Bell,
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';
import { getCRMStore, subscribeToCRM } from '@/lib/crmStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingRooms, setPendingRooms] = useState(0);
  const [pendingVehicles, setPendingVehicles] = useState(0);
  const [pendingDining, setPendingDining] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  // Authentication check (sessionStorage)
  const [isAuth, setIsAuth] = useState(true);

  useEffect(() => {
    // If not logged in, we allow admin demo access or redirect
    const updateStats = () => {
      const store = getCRMStore();
      setPendingRooms(store.roomBookings.filter(b => b.status === 'pending').length);
      setPendingVehicles(store.vehicleBookings.filter(b => b.status === 'pending').length);
      setPendingDining(store.diningBookings.filter(b => b.status === 'pending').length);
    };

    updateStats();
    const unsubscribe = subscribeToCRM(updateStats);

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  const totalPending = pendingRooms + pendingVehicles + pendingDining;

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/rooms', label: 'Room Bookings', icon: BedDouble, badge: pendingRooms },
    { href: '/admin/vehicles', label: 'Vehicle Rentals', icon: Car, badge: pendingVehicles },
    { href: '/admin/dining', label: 'Dining Reservations', icon: UtensilsCrossed, badge: pendingDining },
    { href: '/admin/guests', label: 'Guest CRM', icon: Users },
    { href: '/admin/settings', label: 'Pricing & Settings', icon: Settings }
  ];

  return (
    <div className="crm-wrapper">
      {/* Sidebar */}
      <aside className="crm-sidebar">
        <div className="crm-sidebar-header">
          <div className="crm-brand-icon">CP</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#FFF', letterSpacing: '0.5px' }}>
              Casa Paradiso
            </h2>
            <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Hotel Management CRM
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="crm-nav">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`crm-nav-link ${isActive ? 'active' : ''}`}
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

        {/* Sidebar Footer */}
        <div className="crm-sidebar-footer">
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94A3B8',
              fontSize: '12px',
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={14} />
            <span>View Live Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="crm-main">
        {/* Topbar */}
        <header className="crm-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="crm-sync-pill">
              <span className="crm-sync-dot" />
              <span>Real-Time Sync Active</span>
            </div>
            {currentTime && (
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                {currentTime}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {totalPending > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#F87171',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <Bell size={14} />
                <span>{totalPending} Action Needed</span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                backgroundColor: '#1E293B',
                borderRadius: '8px',
                border: '1px solid #334155'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#FFF'
                }}
              >
                AD
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC' }}>Manager Desk</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="crm-content">{children}</main>
      </div>
    </div>
  );
}
