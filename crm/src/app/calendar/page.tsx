'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  BedDouble,
  Sparkles,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { getCRMStore, subscribeToCRM, updateRoomBooking, hasPermission } from '@/lib/crmStore';
import { RoomBooking, RoomDefinition, CRMStoreData } from '@/lib/types';
import QuickBookingModal from '@/components/QuickBookingModal';
import AccessRestricted from '@/components/AccessRestricted';

export default function TapeChartCalendarPage() {
  const [store, setStore] = useState<CRMStoreData>(getCRMStore());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<RoomBooking | null>(null);
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [allowed, setAllowed] = useState<boolean>(true);

  useEffect(() => {
    const update = () => {
      setAllowed(hasPermission('calendar'));
      setStore(getCRMStore());
    };
    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  if (!allowed) {
    return (
      <AccessRestricted
        moduleName="Tape Chart Grid & Visual Booking Calendar"
        requiredPermission="calendar (Tape Chart & Booking Schedule Access)"
        description="Viewing the 14-day multi-room visual tape chart and drag-and-drop booking timeline requires Calendar access."
      />
    );
  }

  // Generate 14-day array starting from startDate
  const daysToShow = 14;
  const dateList: { date: Date; dateStr: string; label: string; isToday: boolean }[] = [];
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < daysToShow; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    dateList.push({
      date: d,
      dateStr,
      label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      isToday: dateStr === todayStr
    });
  }

  const handlePrev = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() - 7);
    setStartDate(d);
  };

  const handleNext = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + 7);
    setStartDate(d);
  };

  const handleToday = () => {
    setStartDate(new Date());
  };

  // Helper to find booking occupying room on specific date
  const getBookingForRoomDate = (roomNum: string, dateStr: string) => {
    return store.roomBookings.find(b => {
      if (b.status === 'cancelled') return false;
      if (b.roomNumber !== roomNum) return false;
      return dateStr >= b.checkIn && dateStr < b.checkOut;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarDays size={22} color="#34D399" />
            <span>Interactive Tape Chart & Room Timeline</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
            Visual 14-day availability chart across all 18 boutique suites (Floors 1 & 2).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '2px'
            }}
          >
            <button
              onClick={handlePrev}
              className="crm-btn"
              style={{ background: 'none', padding: '6px 10px', color: 'var(--text-secondary)' }}
              title="Previous 7 Days"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleToday}
              className="crm-btn"
              style={{ background: 'none', padding: '6px 12px', fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: 700 }}
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="crm-btn"
              style={{ background: 'none', padding: '6px 10px', color: 'var(--text-secondary)' }}
              title="Next 7 Days"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => setIsQuickOpen(true)}
            className="crm-btn crm-btn-primary"
            style={{ padding: '8px 16px' }}
          >
            <Plus size={16} />
            <span>Reserve Suite</span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          flexWrap: 'wrap',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 16px',
          fontSize: '12px'
        }}
      >
        <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Legend:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#059669' }} />
          <span>Checked In</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#0284C7' }} />
          <span>Confirmed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#D97706' }} />
          <span>Pending Request</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#DC2626' }} />
          <span>Out of Order</span>
        </div>
      </div>

      {/* Tape Chart Grid */}
      <div className="crm-tapechart-container">
        {/* Timeline Header Row */}
        <div className="crm-tapechart-header-row">
          <div
            style={{
              padding: '12px 16px',
              fontWeight: 800,
              fontSize: '13px',
              color: 'var(--text-primary)',
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Suite Number
          </div>
          {dateList.map(col => (
            <div
              key={col.dateStr}
              style={{
                padding: '8px 4px',
                textAlign: 'center',
                borderRight: '1px solid var(--border-subtle)',
                backgroundColor: col.isToday ? 'rgba(5, 150, 105, 0.1)' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '11px', color: col.isToday ? '#059669' : 'var(--text-secondary)', fontWeight: 700 }}>
                {col.label.split(' ')[0]}
              </span>
              <span style={{ fontSize: '12.5px', color: col.isToday ? '#059669' : 'var(--text-primary)', fontWeight: 800 }}>
                {col.label.split(' ')[1]} {col.label.split(' ')[2]}
              </span>
            </div>
          ))}
        </div>

        {/* Room Rows */}
        {store.rooms.map(room => (
          <div key={room.roomNumber} className="crm-tapechart-row">
            {/* Left Header */}
            <div
              style={{
                padding: '8px 14px',
                borderRight: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-subtle)'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Suite {room.roomNumber}
                </div>
                <div style={{ fontSize: '10.5px', color: room.roomType === 'ac' ? '#059669' : 'var(--text-secondary)', fontWeight: 600 }}>
                  {room.roomType.toUpperCase()} · Fl {room.floor}
                </div>
              </div>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor:
                    room.cleanliness === 'clean'
                      ? '#059669'
                      : room.cleanliness === 'dirty'
                      ? '#DC2626'
                      : room.cleanliness === 'cleaning_in_progress'
                      ? '#D97706'
                      : '#64748B'
                }}
                title={`Housekeeping: ${room.cleanliness}`}
              />
            </div>

            {/* Date Cells */}
            {dateList.map(col => {
              const booking = getBookingForRoomDate(room.roomNumber, col.dateStr);
              const isStart = booking && booking.checkIn === col.dateStr;

              return (
                <div
                  key={col.dateStr}
                  className="crm-tapechart-cell"
                  style={{
                    backgroundColor: col.isToday ? 'rgba(5, 150, 105, 0.04)' : 'transparent',
                    cursor: booking ? 'pointer' : 'default'
                  }}
                  onClick={() => booking && setSelectedBooking(booking)}
                >
                  {booking && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: '4px 2px',
                        borderRadius: '4px',
                        backgroundColor:
                          booking.status === 'checked_in'
                            ? '#059669'
                            : booking.status === 'confirmed'
                            ? '#0284C7'
                            : '#D97706',
                        color: '#FFF',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title={`${booking.guestName} (${booking.checkIn} to ${booking.checkOut})`}
                    >
                      {isStart ? booking.guestName : ''}
                    </div>
                  )}

                  {!booking && room.cleanliness === 'out_of_order' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: '4px 2px',
                        borderRadius: '4px',
                        backgroundColor: '#FEE2E2',
                        color: '#B91C1C',
                        fontSize: '10px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #FECACA'
                      }}
                    >
                      OOO
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Booking Inspector Modal */}
      {selectedBooking && (
        <div className="crm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}>
          <div className="crm-modal" style={{ maxWidth: '520px' }}>
            <div className="crm-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BedDouble size={18} color="#059669" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Reservation #{selectedBooking.id}
                </h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div className="crm-modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {selectedBooking.guestName}
                  </h4>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {selectedBooking.guestPhone} · {selectedBooking.guestEmail}
                  </div>
                </div>
                <span
                  className={`crm-badge ${
                    selectedBooking.status === 'checked_in'
                      ? 'crm-badge-active'
                      : selectedBooking.status === 'confirmed'
                      ? 'crm-badge-confirmed'
                      : 'crm-badge-pending'
                  }`}
                >
                  {selectedBooking.status.replace('_', ' ')}
                </span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: '8px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Suite Category:</strong> {selectedBooking.roomTitle} (Room {selectedBooking.roomNumber || 'Unassigned'})</div>
                <div><strong>Stay Dates:</strong> {selectedBooking.checkIn} to {selectedBooking.checkOut} ({selectedBooking.nights} Nights)</div>
                <div><strong>Occupancy:</strong> {selectedBooking.occupancy.toUpperCase()}</div>
                <div><strong>Total Amount:</strong> ₹{selectedBooking.totalPrice.toLocaleString('en-IN')} ({selectedBooking.paymentStatus.toUpperCase()})</div>
                {selectedBooking.specialRequests && (
                  <div style={{ color: '#D97706', marginTop: '4px' }}>
                    <strong>Special Requests:</strong> {selectedBooking.specialRequests}
                  </div>
                )}
              </div>
            </div>

            <div className="crm-modal-footer">
              {selectedBooking.status !== 'checked_in' && (
                <button
                  onClick={() => {
                    updateRoomBooking(selectedBooking.id, { status: 'checked_in', paymentStatus: 'paid' });
                    setSelectedBooking(null);
                  }}
                  className="crm-btn crm-btn-primary"
                >
                  Check In Guest
                </button>
              )}
              {selectedBooking.status === 'checked_in' && (
                <button
                  onClick={() => {
                    updateRoomBooking(selectedBooking.id, { status: 'checked_out' });
                    setSelectedBooking(null);
                  }}
                  className="crm-btn crm-btn-danger"
                >
                  Check Out Guest
                </button>
              )}
              <button onClick={() => setSelectedBooking(null)} className="crm-btn crm-btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isQuickOpen && (
        <QuickBookingModal
          initialTab="room"
          onClose={() => setIsQuickOpen(false)}
        />
      )}
    </div>
  );
}
