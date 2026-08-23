'use client';

import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Search,
  Plus,
  X,
  Edit,
  Trash2,
  MessageCircle,
  Clock,
  Users,
  CheckCircle2
} from 'lucide-react';
import { getCRMStore, subscribeToCRM, updateDiningBooking, createDiningBooking, deleteBooking } from '@/lib/crmStore';
import { DiningBooking, DiningBookingStatus } from '@/lib/types';

export default function DiningAdminPage() {
  const [bookings, setBookings] = useState<DiningBooking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Edit Modal
  const [selectedBooking, setSelectedBooking] = useState<DiningBooking | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<DiningBookingStatus>('pending');
  const [editTable, setEditTable] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // New Reservation Modal
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSlot, setNewSlot] = useState('Dinner (7:30 PM - 11:00 PM)');
  const [newParty, setNewParty] = useState(2);
  const [newDietary, setNewDietary] = useState('Goan Seafood & Authentic Flavors');
  const [newRequests, setNewRequests] = useState('');

  useEffect(() => {
    const refresh = () => {
      const store = getCRMStore();
      setBookings(store.diningBookings);
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
      (b.tableNumber && b.tableNumber.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleOpenEdit = (b: DiningBooking) => {
    setSelectedBooking(b);
    setEditStatus(b.status);
    setEditTable(b.tableNumber || '');
    setEditNotes(b.staffNotes || '');
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    updateDiningBooking(selectedBooking.id, {
      status: editStatus,
      tableNumber: editTable,
      staffNotes: editNotes
    });
    setIsEditOpen(false);
  };

  const handleQuickSeat = (id: string) => {
    updateDiningBooking(id, { status: 'seated' });
  };

  const handleDelete = (id: string) => {
    if (confirm(`Delete dining reservation ${id}?`)) {
      deleteBooking('dining', id);
      setIsEditOpen(false);
    }
  };

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newDate) {
      alert('Please fill in all required fields.');
      return;
    }

    createDiningBooking({
      guestName: newName,
      guestPhone: newPhone,
      guestEmail: newEmail,
      date: newDate,
      timeSlot: newSlot,
      partySize: newParty,
      dietaryPreferences: newDietary,
      specialRequests: newRequests
    });

    setIsNewOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewRequests('');
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#FFF', fontWeight: 700 }}>
            Dining & Table Reservations
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
            Manage table seatings, meal slot schedules, dietary preferences, and special occasion requests.
          </p>
        </div>

        <button
          onClick={() => setIsNewOpen(true)}
          className="crm-action-btn crm-action-btn--primary"
          style={{ padding: '10px 18px', fontSize: '14px' }}
        >
          <Plus size={16} /> New Table Reservation
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="crm-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {/* Status Filter Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Tables' },
              { id: 'pending', label: 'Pending' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'seated', label: 'Seated' },
              { id: 'completed', label: 'Completed' },
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
              placeholder="Search guest, phone, table..."
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
                <th>Date & Meal Slot</th>
                <th>Party Size</th>
                <th>Dietary & Special Notes</th>
                <th>Assigned Table</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                    No dining reservations found matching current filters.
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
                      <strong style={{ color: '#E2E8F0', fontSize: '13px' }}>{b.date}</strong>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8' }}>{b.timeSlot}</span>
                    </td>
                    <td>
                      <span style={{ color: '#34D399', fontWeight: 700, fontSize: '14px' }}>
                        {b.partySize} Guest{b.partySize > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#CBD5E1', fontSize: '12px' }}>{b.dietaryPreferences || 'Standard'}</span>
                      {b.specialRequests && (
                        <span style={{ display: 'block', fontSize: '11px', color: '#FACC15', fontStyle: 'italic' }}>
                          "{b.specialRequests}"
                        </span>
                      )}
                    </td>
                    <td>
                      {b.tableNumber ? (
                        <span style={{ color: '#38BDF8', fontWeight: 600, fontSize: '12px' }}>
                          {b.tableNumber}
                        </span>
                      ) : (
                        <span style={{ color: '#64748B', fontStyle: 'italic', fontSize: '12px' }}>
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`crm-badge crm-badge--${b.status}`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {b.status === 'confirmed' || b.status === 'pending' ? (
                          <button
                            onClick={() => handleQuickSeat(b.id)}
                            className="crm-action-btn crm-action-btn--primary"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                            title="Seat guests at table"
                          >
                            Seat
                          </button>
                        ) : null}

                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="crm-action-btn"
                          title="Edit & Assign Table"
                        >
                          <Edit size={14} />
                        </button>
                        <a
                          href={`https://wa.me/${b.guestPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="crm-action-btn"
                          title="WhatsApp Guest"
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

      {/* Edit Dining Modal */}
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
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#FFF' }}>
              Table Reservation: {selectedBooking.id}
            </h2>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#94A3B8' }}>
              {selectedBooking.guestName} • {selectedBooking.date} ({selectedBooking.timeSlot})
            </p>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Reservation Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as DiningBookingStatus)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="seated">Seated</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Assign Table Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Table T-4 (Courtyard)"
                    value={editTable}
                    onChange={(e) => setEditTable(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                  Kitchen & Host Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Candlelight arranged. Prepare chef tasting menu."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleDelete(selectedBooking.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: '#EF4444', fontSize: '12px', cursor: 'pointer' }}
                >
                  <Trash2 size={14} /> Delete Reservation
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setIsEditOpen(false)} className="crm-action-btn">
                    Cancel
                  </button>
                  <button type="submit" className="crm-action-btn crm-action-btn--primary" style={{ padding: '8px 18px' }}>
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Reservation Modal */}
      {isNewOpen && (
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
          onClick={() => setIsNewOpen(false)}
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
              onClick={() => setIsNewOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#FFF' }}>
              New Table Reservation
            </h2>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#94A3B8' }}>
              Add a direct table booking for dining guests.
            </p>

            <form onSubmit={handleCreateReservation} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Guest Name *
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newParty}
                    onChange={(e) => setNewParty(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                  Meal Slot
                </label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                >
                  <option value="Breakfast (8:00 AM - 10:30 AM)">Breakfast (8:00 AM - 10:30 AM)</option>
                  <option value="Lunch (12:30 PM - 3:30 PM)">Lunch (12:30 PM - 3:30 PM)</option>
                  <option value="Sunset & Hi-Tea (4:30 PM - 6:30 PM)">Sunset & Hi-Tea (4:30 PM - 6:30 PM)</option>
                  <option value="Dinner (7:30 PM - 11:00 PM)">Dinner (7:30 PM - 11:00 PM)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                  Special Requests / Dietary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian, Anniversary candle"
                  value={newRequests}
                  onChange={(e) => setNewRequests(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsNewOpen(false)} className="crm-action-btn">
                  Cancel
                </button>
                <button type="submit" className="crm-action-btn crm-action-btn--primary" style={{ padding: '8px 18px' }}>
                  Book Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
