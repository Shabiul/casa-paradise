'use client';

import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  Search,
  Filter,
  Plus,
  X,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText,
  Trash2,
  Edit,
  Sparkles
} from 'lucide-react';
import { getCRMStore, subscribeToCRM, updateRoomBooking, createRoomBooking, deleteBooking } from '@/lib/crmStore';
import { RoomBooking, BookingStatus, PaymentStatus } from '@/lib/types';

export default function RoomsAdminPage() {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Booking for Edit Modal
  const [selectedBooking, setSelectedBooking] = useState<RoomBooking | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // New Walk-in Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRoomType, setNewRoomType] = useState<'ac' | 'nonac'>('ac');
  const [newOccupancy, setNewOccupancy] = useState<'single' | 'double' | 'triple'>('double');
  const [newCheckIn, setNewCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [newCheckOut, setNewCheckOut] = useState('');
  const [newSpecialRequests, setNewSpecialRequests] = useState('');

  // Edit fields
  const [editStatus, setEditStatus] = useState<BookingStatus>('pending');
  const [editPayment, setEditPayment] = useState<PaymentStatus>('unpaid');
  const [editRoomNumber, setEditRoomNumber] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    const refresh = () => {
      const store = getCRMStore();
      setBookings(store.roomBookings);
    };
    refresh();
    const unsubscribe = subscribeToCRM(refresh);
    return () => unsubscribe();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.id.toLowerCase().includes(q) ||
      b.guestName.toLowerCase().includes(q) ||
      b.guestPhone.includes(q) ||
      (b.roomNumber && b.roomNumber.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleOpenEdit = (b: RoomBooking) => {
    setSelectedBooking(b);
    setEditStatus(b.status);
    setEditPayment(b.paymentStatus);
    setEditRoomNumber(b.roomNumber || '');
    setEditNotes(b.staffNotes || '');
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    updateRoomBooking(selectedBooking.id, {
      status: editStatus,
      paymentStatus: editPayment,
      roomNumber: editRoomNumber,
      staffNotes: editNotes
    });
    setIsEditOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete room booking ${id}?`)) {
      deleteBooking('room', id);
      setIsEditOpen(false);
    }
  };

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newCheckIn || !newCheckOut) {
      alert('Please fill in required fields.');
      return;
    }

    const inD = new Date(newCheckIn);
    const outD = new Date(newCheckOut);
    const diff = Math.abs(outD.getTime() - inD.getTime());
    const nights = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));

    const store = getCRMStore();
    const rate = store.settings.roomPrices[newRoomType][newOccupancy];
    const total = rate * nights;

    createRoomBooking({
      guestName: newName,
      guestPhone: newPhone,
      guestEmail: newEmail,
      roomType: newRoomType,
      occupancy: newOccupancy,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      nights,
      baseRate: rate,
      totalPrice: total,
      specialRequests: newSpecialRequests
    });

    setIsNewModalOpen(false);
    // Reset form
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewCheckOut('');
    setNewSpecialRequests('');
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#FFF', fontWeight: 700 }}>
            Room Bookings Management
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
            Manage room reservations, check-ins, key room assignments, and payments.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="crm-action-btn crm-action-btn--primary"
          style={{ padding: '10px 18px', fontSize: '14px' }}
        >
          <Plus size={16} /> New Walk-In Booking
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="crm-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {/* Status Filter Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Bookings' },
              { id: 'pending', label: 'Pending' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'checked_in', label: 'Checked In' },
              { id: 'checked_out', label: 'Checked Out' },
              { id: 'cancelled', label: 'Cancelled' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`crm-filter-btn ${filterStatus === st.id ? 'active' : ''}`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search guest, phone, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="crm-search-input"
              style={{ paddingLeft: '34px' }}
            />
            <Search size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="crm-panel">
        <div className="crm-table-container">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Details</th>
                <th>Room & Occupancy</th>
                <th>Dates & Nights</th>
                <th>Total & Payment</th>
                <th>Status</th>
                <th>Assigned Room</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                    No room bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ color: '#FACC15', fontFamily: 'monospace', fontSize: '13px' }}>
                        {b.id}
                      </strong>
                      <span style={{ display: 'block', fontSize: '10px', color: '#64748B' }}>
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#F8FAFC', display: 'block' }}>{b.guestName}</strong>
                      <span style={{ fontSize: '12px', color: '#94A3B8' }}>{b.guestPhone}</span>
                    </td>
                    <td>
                      <span style={{ color: '#E2E8F0', fontWeight: 500 }}>{b.roomTitle}</span>
                      <span style={{ display: 'block', fontSize: '11px', color: '#64748B', textTransform: 'capitalize' }}>
                        {b.occupancy} Occupancy
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                        {b.checkIn} → {b.checkOut}
                      </span>
                      <span style={{ display: 'block', fontSize: '11px', color: '#64748B' }}>
                        {b.nights} Night{b.nights > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#34D399', fontSize: '14px' }}>
                        ₹{b.totalPrice.toLocaleString('en-IN')}
                      </strong>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '10px',
                          color: b.paymentStatus === 'paid' ? '#34D399' : '#FACC15',
                          textTransform: 'uppercase',
                          fontWeight: 700
                        }}
                      >
                        {b.paymentStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`crm-badge crm-badge--${b.status}`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {b.roomNumber ? (
                        <span style={{ color: '#38BDF8', fontWeight: 600, fontSize: '12px' }}>
                          {b.roomNumber}
                        </span>
                      ) : (
                        <span style={{ color: '#64748B', fontStyle: 'italic', fontSize: '12px' }}>
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="crm-action-btn"
                          title="Edit Booking & Assign Room"
                        >
                          <Edit size={14} />
                        </button>
                        <a
                          href={`https://wa.me/${b.guestPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="crm-action-btn"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle size={14} color="#25D366" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Details Modal */}
      {isEditOpen && selectedBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsEditOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              color: '#FFF',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsEditOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#FFF' }}>
              Booking: {selectedBooking.id}
            </h2>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#94A3B8' }}>
              {selectedBooking.guestName} • {selectedBooking.roomTitle}
            </p>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Booking Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as BookingStatus)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#0F172A',
                      color: '#FFF',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}
                  >
                    <option value="pending">Pending Confirmation</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Payment Status
                  </label>
                  <select
                    value={editPayment}
                    onChange={(e) => setEditPayment(e.target.value as PaymentStatus)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#0F172A',
                      color: '#FFF',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '13px'
                    }}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="advance_paid">Advance Paid</option>
                    <option value="paid">Fully Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                  Assign Physical Room Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Suite 204 / Room 102"
                  value={editRoomNumber}
                  onChange={(e) => setEditRoomNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#0F172A',
                    color: '#FFF',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                  Front Desk & Staff Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Extra key given. Late checkout requested."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#0F172A',
                    color: '#FFF',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '13px',
                    resize: 'none'
                  }}
                />
              </div>

              {selectedBooking.specialRequests && (
                <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                  <span style={{ fontSize: '11px', color: '#FACC15', fontWeight: 700, textTransform: 'uppercase' }}>
                    Guest Special Request:
                  </span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#FEF08A' }}>
                    {selectedBooking.specialRequests}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleDelete(selectedBooking.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} /> Delete Booking
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="crm-action-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="crm-action-btn crm-action-btn--primary"
                    style={{ padding: '8px 18px' }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Walk-in Booking Modal */}
      {isNewModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsNewModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              color: '#FFF',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsNewModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#FFF' }}>
              Create New Room Booking
            </h2>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#94A3B8' }}>
              Manually add a walk-in guest or phone reservation.
            </p>

            <form onSubmit={handleCreateWalkIn} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Guest Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="guest@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Room Category
                  </label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  >
                    <option value="ac">Paradise AC Suite</option>
                    <option value="nonac">Heritage Non-AC Room</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Occupancy
                  </label>
                  <select
                    value={newOccupancy}
                    onChange={(e) => setNewOccupancy(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Check-In Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newCheckIn}
                    onChange={(e) => setNewCheckIn(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Check-Out Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newCheckOut}
                    onChange={(e) => setNewCheckOut(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                  Special Requests / Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arrived by Goa Express. Early breakfast."
                  value={newSpecialRequests}
                  onChange={(e) => setNewSpecialRequests(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="crm-action-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="crm-action-btn crm-action-btn--primary"
                  style={{ padding: '8px 18px' }}
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
