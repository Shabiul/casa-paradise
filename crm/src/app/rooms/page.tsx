'use client';

import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  Search,
  Filter,
  Plus,
  X,
  Edit,
  Trash2,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  Calendar,
  ShieldCheck,
  Receipt,
  Sparkles
} from 'lucide-react';
import {
  getCRMStore,
  subscribeToCRM,
  updateRoomBooking,
  createRoomBooking,
  deleteBooking,
  getOrCreateFolioForGuest,
  hasPermission
} from '@/lib/crmStore';
import { RoomBooking, BookingStatus, PaymentStatus, CRMStoreData } from '@/lib/types';
import QuickBookingModal from '@/components/QuickBookingModal';
import InvoiceModal from '@/components/InvoiceModal';
import AccessRestricted from '@/components/AccessRestricted';

export default function RoomsAdminPage() {
  const [store, setStore] = useState<CRMStoreData>(getCRMStore());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allowed, setAllowed] = useState<boolean>(true);

  // Selected Booking for Edit Modal
  const [selectedBooking, setSelectedBooking] = useState<RoomBooking | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<BookingStatus>('pending');
  const [editPayment, setEditPayment] = useState<PaymentStatus>('unpaid');
  const [editRoomNumber, setEditRoomNumber] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Modals
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [viewFolioGuestId, setViewFolioGuestId] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setAllowed(hasPermission('rooms'));
      setStore(getCRMStore());
    };
    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  if (!allowed) {
    return (
      <AccessRestricted
        moduleName="Rooms & Front Desk Operations"
        requiredPermission="rooms (Front Desk, Check-In/Out Access)"
        description="Managing guest room bookings, assignations, and front desk check-in / check-out requires Room Management permissions."
      />
    );
  }

  const filteredBookings = store.roomBookings.filter(b => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.id.toLowerCase().includes(q) ||
      b.guestName.toLowerCase().includes(q) ||
      b.guestPhone.includes(q) ||
      b.guestEmail.toLowerCase().includes(q) ||
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
      roomNumber: editRoomNumber || undefined,
      staffNotes: editNotes
    });

    setIsEditOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete room booking ${id} for ${name}?`)) {
      deleteBooking('room', id);
    }
  };

  const handleWhatsAppAlert = (b: RoomBooking) => {
    const text = encodeURIComponent(
      `Hello ${b.guestName}, greetings from Casa Paradiso Panaji!\nYour stay reservation (${b.id}) for ${b.roomTitle} is confirmed.\nCheck-in: ${b.checkIn} | Check-out: ${b.checkOut}\nAssigned Suite: Room ${b.roomNumber || 'At Reception'}\nWe look forward to hosting you!`
    );
    const cleanPhone = b.guestPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="crm-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BedDouble size={22} color="#059669" />
            <span>Room Reservations &amp; Front Desk Pipeline</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Manage guest check-ins, allocate suites 101–210, track payment folios and WhatsApp dispatch.
          </p>
        </div>

        <button onClick={() => setIsQuickOpen(true)} className="crm-btn crm-btn-primary" style={{ padding: '8px 16px' }}>
          <Plus size={16} />
          <span>New Walk-in Reservation</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="crm-filter-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: 'var(--bg-card)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Stays' },
            { key: 'pending', label: 'Pending' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'checked_in', label: 'In-House' },
            { key: 'checked_out', label: 'Checked Out' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: filterStatus === tab.key ? 'var(--accent-emerald)' : 'var(--bg-elevated)',
                color: filterStatus === tab.key ? '#FFF' : 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="crm-filter-search" style={{ position: 'relative', flex: '1', minWidth: '160px', maxWidth: '280px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by name, phone, room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="crm-input"
            style={{ paddingLeft: '34px', width: '100%', fontSize: '12.5px' }}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="crm-table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>ID / Guest</th>
              <th>Suite & Occupancy</th>
              <th>Assigned Room</th>
              <th>Stay Dates</th>
              <th>Total & Payment</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                  No room bookings match the selected criteria.
                </td>
              </tr>
            ) : (
              filteredBookings.map(b => (
                <tr key={b.id}>
                  {/* Guest Info */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.guestName}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{b.id} · {b.guestPhone}</div>
                  </td>

                  {/* Room Category */}
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.roomTitle}</div>
                    <div style={{ fontSize: '11px', color: '#0284C7', textTransform: 'uppercase', fontWeight: 700 }}>
                      {b.occupancy} Occupancy
                    </div>
                  </td>

                  {/* Room Number */}
                  <td>
                    {b.roomNumber ? (
                      <span
                        style={{
                          backgroundColor: '#059669',
                          color: '#FFF',
                          fontWeight: 800,
                          fontSize: '11.5px',
                          padding: '3px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        Room {b.roomNumber}
                      </span>
                    ) : (
                      <span style={{ color: '#D97706', fontSize: '12px', fontWeight: 700 }}>
                        Unassigned
                      </span>
                    )}
                  </td>

                  {/* Dates */}
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                      {b.checkIn} → {b.checkOut}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {b.nights} Night{b.nights > 1 ? 's' : ''}
                    </div>
                  </td>

                  {/* Price & Payment */}
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{b.totalPrice.toLocaleString('en-IN')}
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color:
                          b.paymentStatus === 'paid'
                            ? '#059669'
                            : b.paymentStatus === 'advance_paid'
                            ? '#0284C7'
                            : '#E11D48'
                      }}
                    >
                      {b.paymentStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`crm-badge ${
                        b.status === 'checked_in'
                          ? 'crm-badge-active'
                          : b.status === 'confirmed'
                          ? 'crm-badge-confirmed'
                          : b.status === 'cancelled'
                          ? 'crm-badge-cancelled'
                          : 'crm-badge-pending'
                      }`}
                    >
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => handleWhatsAppAlert(b)}
                        className="crm-btn"
                        style={{ padding: '5px 8px', backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0' }}
                        title="Send WhatsApp Confirmation"
                      >
                        <MessageSquare size={14} />
                      </button>

                      <button
                        onClick={() => setViewFolioGuestId(b.guestId)}
                        className="crm-btn crm-btn-secondary"
                        style={{ padding: '5px 8px' }}
                        title="View Guest Folio & Invoice"
                      >
                        <Receipt size={14} color="#059669" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="crm-btn crm-btn-secondary"
                        style={{ padding: '5px 8px' }}
                        title="Edit Details & Room Allocation"
                      >
                        <Edit size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(b.id, b.guestName)}
                        className="crm-btn crm-btn-danger"
                        style={{ padding: '5px 8px' }}
                        title="Delete Booking"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Booking Modal */}
      {isEditOpen && selectedBooking && (
        <div className="crm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setIsEditOpen(false)}>
          <div className="crm-modal" style={{ maxWidth: '560px' }}>
            <div className="crm-modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Edit Stay #{selectedBooking.id} ({selectedBooking.guestName})
              </h3>
              <button onClick={() => setIsEditOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="crm-modal-body">
              <div className="crm-rooms-edit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Stay Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="crm-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In (In-House)</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="crm-form-group">
                  <label className="crm-label">Payment Status</label>
                  <select
                    value={editPayment}
                    onChange={(e) => setEditPayment(e.target.value as any)}
                    className="crm-select"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="advance_paid">Advance Paid</option>
                    <option value="paid">Fully Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Assign Suite Number (18 Rooms)</label>
                <select
                  value={editRoomNumber}
                  onChange={(e) => setEditRoomNumber(e.target.value)}
                  className="crm-select"
                >
                  <option value="">Unassigned</option>
                  {store.rooms.map(r => (
                    <option key={r.roomNumber} value={r.roomNumber}>
                      Room {r.roomNumber} · {r.title} (Floor {r.floor}) {r.isOccupied && r.roomNumber !== selectedBooking.roomNumber ? '· Currently Occupied' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Internal Staff & Front Desk Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="crm-textarea"
                  placeholder="e.g. VIP guest, key card 104 handed over, early breakfast requested"
                />
              </div>

              <div className="crm-modal-footer" style={{ padding: '12px 0 0 0', background: 'none' }}>
                <button type="button" onClick={() => setIsEditOpen(false)} className="crm-btn crm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="crm-btn crm-btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Folio Modal */}
      {viewFolioGuestId && (
        <InvoiceModal
          folio={getOrCreateFolioForGuest(viewFolioGuestId)}
          onClose={() => setViewFolioGuestId(null)}
        />
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
