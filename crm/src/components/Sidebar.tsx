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
  UserCheck,
  KeyRound,
  X
} from 'lucide-react';
import { getCRMStore, getCurrentUser, hasPermission, subscribeToCRM } from '@/lib/crmStore';
import { StaffPermissions, CRMUser } from '@/lib/types';
import UserSwitcherModal from './UserSwitcherModal';

interface NavItemConfig {
  href: string;
  label: string;
  icon: any;
  permissionKey: keyof StaffPermissions;
  exact?: boolean;
  badge?: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<CRMUser | null>(null);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pendingRooms, setPendingRooms] = useState(0);
  const [pendingVehicles, setPendingVehicles] = useState(0);
  const [pendingDining, setPendingDining] = useState(0);
  const [dirtyRooms, setDirtyRooms] = useState(0);

  // Close sidebar on route change (mobile)
  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    const update = () => {
      const store = getCRMStore();
      const user = getCurrentUser();
      setCurrentUser(user);
      setPendingRooms(store.roomBookings.filter(b => b.status === 'pending').length);
      setPendingVehicles(store.vehicleBookings.filter(b => b.status === 'pending').length);
      setPendingDining(store.diningBookings.filter(b => b.status === 'pending').length);
      setDirtyRooms(store.rooms.filter(r => r.cleanliness === 'dirty' || r.cleanliness === 'cleaning_in_progress').length);
    };

    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  const allNavItems: NavItemConfig[] = [
    { href: '/', label: 'Executive Dashboard', icon: LayoutDashboard, permissionKey: 'dashboard', exact: true },
    { href: '/calendar', label: 'Tape Chart Grid', icon: CalendarDays, permissionKey: 'calendar' },
    { href: '/rooms', label: 'Rooms & Front Desk', icon: BedDouble, permissionKey: 'rooms', badge: pendingRooms },
    { href: '/vehicles', label: 'Fleet & Rentals', icon: Car, permissionKey: 'vehicles', badge: pendingVehicles },
    { href: '/dining', label: 'Dining & Tables', icon: UtensilsCrossed, permissionKey: 'dining', badge: pendingDining },
    { href: '/housekeeping', label: 'Housekeeping & Maint.', icon: Sparkles, permissionKey: 'housekeeping', badge: dirtyRooms },
    { href: '/guests', label: 'Guest 360 CRM', icon: Users, permissionKey: 'guests' },
    { href: '/billing', label: 'Billing & Folios', icon: Receipt, permissionKey: 'billing' },
    { href: '/analytics', label: 'Financial Analytics', icon: BarChart3, permissionKey: 'analytics' },
    { href: '/settings', label: 'Rates & Staff Control', icon: Settings, permissionKey: 'settings' }
  ];

  // Filter allowed navigation items
  const allowedNavItems = allNavItems.filter((item) => {
    if (!currentUser) return true;
    if (currentUser.role === 'admin') return true;
    return Boolean(currentUser.permissions?.[item.permissionKey]);
  });

  const isAdmin = currentUser?.role === 'admin';

  // Expose open/close for Topbar hamburger via custom event
  useEffect(() => {
    const handler = () => setIsOpen(v => !v);
    window.addEventListener('crm-sidebar-toggle', handler);
    return () => window.removeEventListener('crm-sidebar-toggle', handler);
  }, []);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`crm-sidebar-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <aside className={`crm-sidebar${isOpen ? ' is-open' : ''}`}>
        {/* Brand Header */}
        <div className="crm-sidebar-brand" style={{ justifyContent: 'space-between' }}>
          <div className="crm-brand-badge">CP</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.4px' }}>
              Casa Paradiso
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700 }}>
                Operations & CRM
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  backgroundColor: isAdmin ? '#FEF3C7' : '#F1F5F9',
                  color: isAdmin ? '#92400E' : '#475569',
                  border: isAdmin ? '1px solid #FDE68A' : '1px solid #CBD5E1'
                }}
              >
                {isAdmin ? 'ADMIN' : 'STAFF'}
              </span>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              display: 'none', // shown via .crm-hamburger media query reuse
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: '4px'
            }}
            className="crm-sidebar-close"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav List */}
        <nav className="crm-nav-list">
          {allowedNavItems.map((item) => {
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

        {/* User Account & Shift Footer */}
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          {/* Active User Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <span style={{ fontSize: '18px' }}>{currentUser?.avatar || (isAdmin ? '👑' : '👤')}</span>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {currentUser?.name || 'Loading...'}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                  {currentUser?.designation || (isAdmin ? 'Hotel Administrator' : 'Front Desk')}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSwitcherOpen(true)}
              title="Switch user shift / PIN"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <KeyRound size={13} />
            </button>
          </div>

          {/* Website Link */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-secondary)',
                fontSize: '11.5px',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              <ExternalLink size={13} />
              <span>Guest Site</span>
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: 'var(--text-muted)' }}>
              <ShieldCheck size={12} color="#059669" />
              <span>RBAC v2</span>
            </div>
          </div>
        </div>
      </aside>

      <UserSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </>
  );
}
