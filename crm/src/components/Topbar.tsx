'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Search,
  Clock,
  Sparkles,
  BedDouble,
  Car,
  UtensilsCrossed,
  Wrench
} from 'lucide-react';
import { getCRMStore, subscribeToCRM } from '@/lib/crmStore';

interface TopbarProps {
  onOpenQuickModal: (type: 'room' | 'vehicle' | 'dining' | 'maintenance') => void;
}

export default function Topbar({ onOpenQuickModal }: TopbarProps) {
  const [timeStr, setTimeStr] = useState('');
  const [totalPending, setTotalPending] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      const store = getCRMStore();
      const pending =
        store.roomBookings.filter(b => b.status === 'pending').length +
        store.vehicleBookings.filter(b => b.status === 'pending').length +
        store.diningBookings.filter(b => b.status === 'pending').length;
      setTotalPending(pending);
    };

    updateStats();
    const unsubscribe = subscribeToCRM(updateStats);

    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  return (
    <header className="crm-topbar">
      {/* Left side info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="crm-sync-pill">
          <span className="crm-sync-dot" />
          <span>Real-Time Cloud Sync Active</span>
        </div>

        {timeStr && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 600 }}>
            <Clock size={14} color="var(--text-muted)" />
            <span>{timeStr}</span>
          </div>
        )}
      </div>

      {/* Right side controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        {/* Quick Action Button */}
        <div style={{ position: 'relative' }}>
          <button
            className="crm-btn crm-btn-primary"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ padding: '7px 14px', fontSize: '13px' }}
          >
            <Plus size={16} />
            <span>Quick Action</span>
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '230px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 60
              }}
            >
              <button
                onClick={() => { setIsDropdownOpen(false); onOpenQuickModal('room'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <BedDouble size={16} color="#059669" />
                <span>New Room Walk-In</span>
              </button>

              <button
                onClick={() => { setIsDropdownOpen(false); onOpenQuickModal('vehicle'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Car size={16} color="#0284C7" />
                <span>New Vehicle Rental</span>
              </button>

              <button
                onClick={() => { setIsDropdownOpen(false); onOpenQuickModal('dining'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <UtensilsCrossed size={16} color="#D97706" />
                <span>New Table Reservation</span>
              </button>

              <button
                onClick={() => { setIsDropdownOpen(false); onOpenQuickModal('maintenance'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Wrench size={16} color="#E11D48" />
                <span>Log Maintenance Ticket</span>
              </button>
            </div>
          )}
        </div>

        {/* Pending Badge */}
        {totalPending > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            <Bell size={14} />
            <span>{totalPending} Action{totalPending > 1 ? 's' : ''} Needed</span>
          </div>
        )}

        {/* Manager User Profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '5px 12px',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#FFF'
            }}
          >
            CP
          </div>
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>Front Desk Manager</div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Altinho Hill Desk</div>
          </div>
        </div>
      </div>
    </header>
  );
}
