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
  Calendar,
  Phone,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Receipt
} from 'lucide-react';
import {
  getCRMStore,
  subscribeToCRM,
  updateRoomBooking,
  updateVehicleBooking,
  updateDiningBooking,
  hasPermission
} from '@/lib/crmStore';
import { CRMStoreData } from '@/lib/types';
import AccessRestricted from '@/components/AccessRestricted';

export default function ExecutiveDashboard() {
  const [store, setStore] = useState<CRMStoreData>(getCRMStore());
  const [allowed, setAllowed] = useState<boolean>(true);

  useEffect(() => {
    const update = () => {
      setAllowed(hasPermission('dashboard'));
      setStore(getCRMStore());
    };
    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  if (!allowed) {
    return (
      <AccessRestricted
        moduleName="Executive KPI Dashboard"
        requiredPermission="dashboard (Executive Overview Access)"
        description="Viewing revenue KPIs, operational summaries, and real-time hotel performance dashboards requires Executive Dashboard access."
      />
    );
  }

  // Calculate Metrics
  const roomRevenue = store.roomBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const vehicleRevenue = store.vehicleBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const diningRevenue = store.diningBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.estimatedBill || 1500), 0);

  const totalRevenue = roomRevenue + vehicleRevenue + diningRevenue;

  const totalRooms = store.rooms.length || 18;
  const occupiedRooms = store.rooms.filter(r => r.isOccupied).length;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  const pendingRooms = store.roomBookings.filter(b => b.status === 'pending');
  const pendingVehicles = store.vehicleBookings.filter(b => b.status === 'pending');
  const pendingDining = store.diningBookings.filter(b => b.status === 'pending');
  const totalPending = pendingRooms.length + pendingVehicles.length + pendingDining.length;

  const dirtyRooms = store.rooms.filter(r => r.cleanliness === 'dirty' || r.cleanliness === 'cleaning_in_progress');
  const rentedVehicles = store.vehicles.filter(v => v.status === 'rented').length;
  const activeDining = store.diningBookings.filter(b => b.status === 'seated' || b.status === 'confirmed').length;

  const handleQuickCheckIn = (id: string, roomNum?: string) => {
    updateRoomBooking(id, {
      status: 'checked_in',
      paymentStatus: 'paid',
      roomNumber: roomNum || '101'
    });
  };

  const handleApproveVehicle = (id: string) => {
    updateVehicleBooking(id, { status: 'confirmed' });
  };

  const handleApproveDining = (id: string) => {
    updateDiningBooking(id, { status: 'confirmed', tableNumber: 'T-1' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Executive Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0B1D3A 0%, #1E3A8A 50%, #064E3B 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.3)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                backgroundColor: 'rgba(52, 211, 153, 0.2)',
                color: '#34D399',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              Executive Console · Altinho Hill
            </span>
            <span style={{ fontSize: '12px', color: '#93C5FD' }}>Panaji, Goa</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFF', margin: 0 }}>
            Front Desk & Operations Overview
          </h1>
          <p style={{ color: '#BFDBFE', fontSize: '13px', margin: '4px 0 0 0' }}>
            Live sync across guest reservations, scooter/car dispatch, in-house dining & housekeeping.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/calendar" className="crm-btn crm-btn-secondary" style={{ padding: '9px 16px' }}>
            <Calendar size={16} />
            <span>Open Tape Chart</span>
          </Link>
          <Link href="/rooms" className="crm-btn crm-btn-primary" style={{ padding: '9px 16px' }}>
            <BedDouble size={16} />
            <span>Manage Stays</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="crm-metrics-grid">
        <div className="crm-metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="crm-metric-label">Total Revenue</span>
            <div style={{ padding: '6px', backgroundColor: 'rgba(5, 150, 105, 0.2)', borderRadius: 'var(--radius-md)' }}>
              <TrendingUp size={18} color="#34D399" />
            </div>
          </div>
          <div className="crm-metric-value" style={{ color: '#34D399' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', justifyContent: 'space-between' }}>
            <span>Rooms: ₹{roomRevenue.toLocaleString('en-IN')}</span>
            <span>Fleet: ₹{vehicleRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="crm-metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="crm-metric-label">Occupancy Rate</span>
            <div style={{ padding: '6px', backgroundColor: 'rgba(14, 165, 233, 0.2)', borderRadius: 'var(--radius-md)' }}>
              <BedDouble size={18} color="#38BDF8" />
            </div>
          </div>
          <div className="crm-metric-value" style={{ color: '#38BDF8' }}>
            {occupancyRate}%
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>
            {occupiedRooms} of {totalRooms} Suites Active
          </div>
        </div>

        <div className="crm-metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="crm-metric-label">Fleet on Rent</span>
            <div style={{ padding: '6px', backgroundColor: 'rgba(217, 119, 6, 0.2)', borderRadius: 'var(--radius-md)' }}>
              <Car size={18} color="#FBBF24" />
            </div>
          </div>
          <div className="crm-metric-value" style={{ color: '#FBBF24' }}>
            {rentedVehicles} / {store.vehicles.length}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>
            Scooters & Self-Drive Cars
          </div>
        </div>

        <div className="crm-metric-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="crm-metric-label">Housekeeping Pending</span>
            <div style={{ padding: '6px', backgroundColor: 'rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)' }}>
              <Sparkles size={18} color="#F87171" />
            </div>
          </div>
          <div className="crm-metric-value" style={{ color: dirtyRooms.length > 0 ? '#F87171' : '#34D399' }}>
            {dirtyRooms.length}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>
            {dirtyRooms.length === 0 ? 'All Suites Inspected & Clean' : 'Rooms requiring turn-down service'}
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Action Queue & Live Stay Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Pending Action Queue */}
        <div className="crm-card">
          <div className="crm-card-header">
            <div className="crm-card-title">
              <AlertCircle size={18} color="#D97706" />
              <span>Pending Action Queue ({totalPending})</span>
            </div>
            <Link href="/rooms" style={{ fontSize: '12.5px', color: '#0284C7', fontWeight: 700, textDecoration: 'none' }}>
              View All
            </Link>
          </div>

          {totalPending === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>All caught up!</div>
              <p style={{ fontSize: '12.5px', marginTop: '4px' }}>
                There are no pending room, vehicle, or table requests awaiting manager approval.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Pending Rooms */}
              {pendingRooms.map(b => (
                <div
                  key={b.id}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="crm-badge crm-badge-pending">Room Request</span>
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{b.guestName}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      {b.roomTitle} · {b.nights}N ({b.checkIn} to {b.checkOut}) · ₹{b.totalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuickCheckIn(b.id, '101')}
                    className="crm-btn crm-btn-primary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    Quick Check-In
                  </button>
                </div>
              ))}

              {/* Pending Vehicles */}
              {pendingVehicles.map(v => (
                <div
                  key={v.id}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="crm-badge crm-badge-confirmed">Vehicle Rental</span>
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{v.guestName}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      {v.vehicleName} · {v.days} Days · ₹{v.totalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button
                    onClick={() => handleApproveVehicle(v.id)}
                    className="crm-btn crm-btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px', color: '#0284C7' }}
                  >
                    Approve Dispatch
                  </button>
                </div>
              ))}

              {/* Pending Dining */}
              {pendingDining.map(d => (
                <div
                  key={d.id}
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="crm-badge crm-badge-pending">Table Booking</span>
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{d.guestName}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      Party of {d.partySize} · {d.date} ({d.timeSlot.split('(')[0]})
                    </div>
                  </div>
                  <button
                    onClick={() => handleApproveDining(d.id)}
                    className="crm-btn crm-btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px', color: '#D97706' }}
                  >
                    Assign Table
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* In-House & Arriving Guests */}
        <div className="crm-card">
          <div className="crm-card-header">
            <div className="crm-card-title">
              <Users size={18} color="#059669" />
              <span>Current Stays & Arriving Guests</span>
            </div>
            <Link href="/rooms" style={{ fontSize: '12.5px', color: '#0284C7', fontWeight: 700, textDecoration: 'none' }}>
              Front Desk
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {store.roomBookings.slice(0, 5).map(b => (
              <div
                key={b.id}
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{b.guestName}</strong>
                    {b.roomNumber && (
                      <span
                        style={{
                          backgroundColor: '#059669',
                          color: '#FFF',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        Room {b.roomNumber}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {b.roomTitle} · {b.checkIn} to {b.checkOut}
                  </div>
                </div>

                <div>
                  <span
                    className={`crm-badge ${
                      b.status === 'checked_in'
                        ? 'crm-badge-active'
                        : b.status === 'confirmed'
                        ? 'crm-badge-confirmed'
                        : 'crm-badge-pending'
                    }`}
                  >
                    {b.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="crm-card">
        <div className="crm-card-header">
          <div className="crm-card-title">
            <Clock size={18} color="#0284C7" />
            <span>Chronological Operations Audit Log</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Live Event Stream</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {store.activityLogs.slice(0, 6).map(log => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '10px 0',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor:
                    log.type === 'room'
                      ? '#059669'
                      : log.type === 'vehicle'
                      ? '#0284C7'
                      : log.type === 'dining'
                      ? '#D97706'
                      : '#E11D48',
                  marginTop: '6px'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {log.title}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  {log.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
