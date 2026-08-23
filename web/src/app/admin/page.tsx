'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BedDouble,
  Car,
  UtensilsCrossed,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Phone,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { getCRMStore, subscribeToCRM, updateRoomBooking, updateVehicleBooking } from '@/lib/crmStore';
import { CRMStoreData } from '@/lib/types';

export default function AdminDashboardPage() {
  const [store, setStore] = useState<CRMStoreData>(getCRMStore());

  useEffect(() => {
    const update = () => setStore(getCRMStore());
    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  // Calculate Metrics
  const roomRevenue = store.roomBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const vehicleRevenue = store.vehicleBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const totalRevenue = roomRevenue + vehicleRevenue;

  const activeRooms = store.roomBookings.filter(b => b.status === 'checked_in').length;
  const pendingRooms = store.roomBookings.filter(b => b.status === 'pending').length;
  const activeVehicles = store.vehicleBookings.filter(b => b.status === 'handed_over' || b.status === 'confirmed').length;
  const todayDining = store.diningBookings.filter(b => b.status !== 'cancelled').length;

  const todayStr = new Date().toISOString().split('T')[0];

  const recentRoomBookings = store.roomBookings.slice(0, 5);
  const recentActivities = store.activityLogs.slice(0, 8);

  const handleQuickCheckIn = (id: string) => {
    updateRoomBooking(id, { status: 'checked_in', paymentStatus: 'paid' });
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0B1D3A 0%, #1E3A8A 100%)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#34D399',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} /> Casa Paradiso Executive Console
          </span>
          <h1 style={{ margin: '4px 0 0 0', fontSize: '26px', color: '#FFF', fontWeight: 700 }}>
            Front Desk & Operations Overview
          </h1>
          <p style={{ color: '#93C5FD', margin: '4px 0 0 0', fontSize: '13px' }}>
            All guest bookings, vehicle rentals, and table reservations are synced in real time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            href="/admin/rooms"
            className="crm-action-btn crm-action-btn--primary"
            style={{ padding: '10px 16px', fontSize: '13px' }}
          >
            <BedDouble size={16} /> Manage Rooms
          </Link>
          <Link
            href="/admin/vehicles"
            className="crm-action-btn"
            style={{ padding: '10px 16px', fontSize: '13px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF' }}
          >
            <Car size={16} /> Vehicle Desk
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="crm-kpi-grid">
        {/* Total Revenue */}
        <div className="crm-kpi-card">
          <div className="crm-kpi-header">
            <div className="crm-kpi-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
              <TrendingUp size={22} />
            </div>
            <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 600 }}>All Services</span>
          </div>
          <div className="crm-kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="crm-kpi-label">Total Booking Revenue</div>
        </div>

        {/* Active Suites */}
        <div className="crm-kpi-card">
          <div className="crm-kpi-header">
            <div className="crm-kpi-icon" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
              <BedDouble size={22} />
            </div>
            {pendingRooms > 0 && (
              <span className="crm-badge crm-badge--pending">{pendingRooms} Pending</span>
            )}
          </div>
          <div className="crm-kpi-value">{activeRooms} Occupied</div>
          <div className="crm-kpi-label">Active Suites Checked In</div>
        </div>

        {/* Vehicle Rentals */}
        <div className="crm-kpi-card">
          <div className="crm-kpi-header">
            <div className="crm-kpi-icon" style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#FACC15' }}>
              <Car size={22} />
            </div>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>{store.vehicleBookings.length} Total</span>
          </div>
          <div className="crm-kpi-value">{activeVehicles} Active</div>
          <div className="crm-kpi-label">Vehicles on Road / Handed Over</div>
        </div>

        {/* Dining Reservations */}
        <div className="crm-kpi-card">
          <div className="crm-kpi-header">
            <div className="crm-kpi-icon" style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#FB7185' }}>
              <UtensilsCrossed size={22} />
            </div>
            <span style={{ fontSize: '11px', color: '#34D399' }}>Live Synced</span>
          </div>
          <div className="crm-kpi-value">{todayDining} Tables</div>
          <div className="crm-kpi-label">Dining Reservations Booked</div>
        </div>
      </div>

      {/* Main Grid: Recent Bookings & Live Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Column: Recent Room Bookings */}
        <div className="crm-panel">
          <div className="crm-panel-header">
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', color: '#FFF', fontWeight: 600 }}>
                Recent Room Reservations
              </h2>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Latest guest check-ins & requests</span>
            </div>
            <Link
              href="/admin/rooms"
              style={{ fontSize: '12px', color: '#38BDF8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="crm-table-container">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Ref & Guest</th>
                  <th>Room</th>
                  <th>Dates</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentRoomBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ color: '#F8FAFC', display: 'block', fontSize: '13px' }}>{b.guestName}</strong>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{b.id}</span>
                    </td>
                    <td>
                      <span style={{ color: '#CBD5E1', fontSize: '12px' }}>{b.roomTitle}</span>
                      <span style={{ display: 'block', fontSize: '11px', color: '#64748B' }}>
                        {b.occupancy} • {b.roomNumber || 'Unassigned'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#CBD5E1' }}>{b.checkIn}</span>
                      <span style={{ display: 'block', fontSize: '11px', color: '#64748B' }}>{b.nights}N</span>
                    </td>
                    <td>
                      <strong style={{ color: '#34D399' }}>₹{b.totalPrice.toLocaleString('en-IN')}</strong>
                    </td>
                    <td>
                      <span className={`crm-badge crm-badge--${b.status}`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {b.status === 'pending' || b.status === 'confirmed' ? (
                        <button
                          onClick={() => handleQuickCheckIn(b.id)}
                          className="crm-action-btn crm-action-btn--primary"
                          style={{ fontSize: '11px', padding: '4px 8px' }}
                          title="Quick Check-in"
                        >
                          Check-In
                        </button>
                      ) : (
                        <a
                          href={`https://wa.me/${b.guestPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="crm-action-btn"
                          style={{ fontSize: '11px', padding: '4px 8px' }}
                          title="WhatsApp Guest"
                        >
                          <MessageCircle size={13} color="#25D366" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Live Activity Feed */}
        <div className="crm-panel">
          <div className="crm-panel-header">
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', color: '#FFF', fontWeight: 600 }}>
                Live Front Desk Timeline
              </h2>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Automated event & status log</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentActivities.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '10px',
                  border: '1px solid rgba(51, 65, 85, 0.4)'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor:
                      log.type === 'room'
                        ? 'rgba(56, 189, 248, 0.15)'
                        : log.type === 'vehicle'
                        ? 'rgba(234, 179, 8, 0.15)'
                        : 'rgba(244, 63, 94, 0.15)',
                    color:
                      log.type === 'room'
                        ? '#38BDF8'
                        : log.type === 'vehicle'
                        ? '#FACC15'
                        : '#FB7185',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {log.type === 'room' ? (
                    <BedDouble size={16} />
                  ) : log.type === 'vehicle' ? (
                    <Car size={16} />
                  ) : (
                    <UtensilsCrossed size={16} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <strong style={{ fontSize: '13px', color: '#F1F5F9' }}>{log.title}</strong>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94A3B8', lineHeight: 1.4 }}>
                    {log.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
