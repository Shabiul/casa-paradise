'use client';

import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed,
  Search,
  Plus,
  X,
  Edit,
  Trash2,
  Phone,
  MessageSquare,
  Clock,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import {
  getCRMStore,
  subscribeToCRM,
  updateDiningBooking,
  createDiningBooking,
  deleteBooking,
  hasPermission
} from '@/lib/crmStore';
import { DiningBooking, DiningBookingStatus, CRMStoreData } from '@/lib/types';
import QuickBookingModal from '@/components/QuickBookingModal';
import AccessRestricted from '@/components/AccessRestricted';

export default function DiningAdminPage() {
  const [store, setStore] = useState<CRMStoreData>(getCRMStore());
  const [filterSlot, setFilterSlot] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allowed, setAllowed] = useState<boolean>(true);

  // Edit / Seat Modal
  const [selectedBooking, setSelectedBooking] = useState<DiningBooking | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<DiningBookingStatus>('pending');
  const [editTable, setEditTable] = useState('T-1');
  const [editBill, setEditBill] = useState<number>(1800);
  const [editNotes, setEditNotes] = useState('');

  const [isQuickOpen, setIsQuickOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setAllowed(hasPermission('dining'));
      setStore(getCRMStore());
    };
    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  if (!allowed) {
    return (
      <AccessRestricted
        moduleName="Dining & Restaurant Management"
        requiredPermission="dining (Table Reservations & F&B Access)"
        description="Managing restaurant table reservations, guest seating plans, and meal slots requires Dining Management permissions."
      />
    );
  }

  const filteredBookings = store.diningBookings.filter(b => {
    const matchesSlot = filterSlot === 'all' || b.timeSlot.toLowerCase().includes(filterSlot.toLowerCase());
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.id.toLowerCase().includes(q) ||
      b.guestName.toLowerCase().includes(q) ||
      b.guestPhone.includes(q) ||
      (b.tableNumber && b.tableNumber.toLowerCase().includes(q));
    return matchesSlot && matchesSearch;
  });

  const handleOpenEdit = (b: DiningBooking) => {
    setSelectedBooking(b);
    setEditStatus(b.status);
    setEditTable(b.tableNumber || 'T-1');
    setEditBill(b.estimatedBill || 1800);
    setEditNotes(b.staffNotes || '');
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    updateDiningBooking(selectedBooking.id, {
      status: editStatus,
      tableNumber: editTable,
      estimatedBill: editBill,
      staffNotes: editNotes
    });

    setIsEditOpen(false);
  };

  const handleQuickSeat = (b: DiningBooking) => {
    updateDiningBooking(b.id, {
      status: 'seated',
      tableNumber: b.tableNumber || 'T-7'
    });
  };

  const handleQuickComplete = (b: DiningBooking) => {
    updateDiningBooking(b.id, {
      status: 'completed'
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete table reservation for ${name}?`)) {
      deleteBooking('dining', id);
    }
  };

  const handleWhatsApp = (b: DiningBooking) => {
    const text = encodeURIComponent(
      `Hello ${b.guestName}, your dining table reservation at Casa Paradiso Restaurant is confirmed!\nDate: ${b.date} | Slot: ${b.timeSlot}\nTable: ${b.tableNumber || 'Reserved Balcony Table'}\nParty Size: ${b.partySize} Guests\nDietary Notes: ${b.dietaryPreferences || 'Standard'}\nWe look forward to serving you gourmet Goan specialties!`
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
            <UtensilsCrossed size={22} color="#D97706" />
            <span>Restaurant Dining & Table Reservations</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Floorplan management, meal periods, table allocations (T-1 to T-10), and culinary requests.
          </p>
        </div>

        <button onClick={() => setIsQuickOpen(true)} className="crm-btn crm-btn-primary" style={{ padding: '8px 16px' }}>
          <Plus size={16} />
          <span>New Table Reservation</span>
        </button>
      </div>

      {/* Visual Table Floorplan Layout */}
      <div className="crm-card">
        <div className="crm-card-header">
          <div className="crm-card-title">
            <Sparkles size={18} color="#D97706" />
            <span>Restaurant Floorplan & Live Seating Status</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>10 Tables (Balcony · Garden · Hall · Lounge)</span>
        </div>

        <div className="crm-dining-floorplan" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
          {store.diningTables.map(t => (
            <div
              key={t.id}
              style={{
                backgroundColor: 'var(--bg-subtle)',
                border: t.isOccupied ? '1px solid #FDE68A' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{t.name}</strong>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: t.isOccupied ? '#FEF3C7' : '#DCFCE7',
                    color: t.isOccupied ? '#92400E' : '#15803D',
                    textTransform: 'uppercase'
                  }}
                >
                  {t.isOccupied ? 'SEATED' : 'OPEN'}
                </span>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {t.section} · Cap: {t.capacity} Pax
              </div>
            </div>
          ))}
        </div>
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
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Slots' },
            { key: 'breakfast', label: 'Breakfast' },
            { key: 'lunch', label: 'Lunch' },
            { key: 'high tea', label: 'High Tea' },
            { key: 'dinner', label: 'Dinner' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterSlot(tab.key)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: filterSlot === tab.key ? 'var(--accent-gold)' : 'var(--bg-elevated)',
                color: filterSlot === tab.key ? '#FFF' : 'var(--text-secondary)',
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

        <div className="crm-filter-search" style={{ position: 'relative', flex: '1', minWidth: '160px', maxWidth: '260px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search guest, phone, table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="crm-input"
            style={{ paddingLeft: '34px', width: '100%', fontSize: '12.5px' }}
          />
        </div>
      </div>

      {/* Reservations Table */}
      <div className="crm-table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>ID / Guest</th>
              <th>Date & Meal Slot</th>
              <th>Party & Table</th>
              <th>Dietary & Occasion</th>
              <th>Est. Bill</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                  No dining reservations found for this filter.
                </td>
              </tr>
            ) : (
              filteredBookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.guestName}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{b.id} · {b.guestPhone}</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600 }}>{b.date}</div>
                    <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 600 }}>{b.timeSlot}</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {b.partySize} Guest{b.partySize > 1 ? 's' : ''}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#0284C7', fontWeight: 600 }}>
                      {b.tableNumber ? `Table ${b.tableNumber}` : 'Table Pending'}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>{b.dietaryPreferences || 'Authentic Goan'}</div>
                    {b.specialRequests && (
                      <div style={{ fontSize: '11px', color: '#D97706', fontWeight: 600 }}>{b.specialRequests}</div>
                    )}
                  </td>

                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{(b.estimatedBill || 1800).toLocaleString('en-IN')}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`crm-badge ${
                        b.status === 'seated'
                          ? 'crm-badge-active'
                          : b.status === 'confirmed'
                          ? 'crm-badge-confirmed'
                          : b.status === 'completed'
                          ? 'crm-badge-confirmed'
                          : 'crm-badge-pending'
                      }`}
                    >
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleQuickSeat(b)}
                          className="crm-btn crm-btn-primary"
                          style={{ padding: '5px 9px', fontSize: '11.5px' }}
                          title="Seat Guests"
                        >
                          Seat Table
                        </button>
                      )}

                      {b.status === 'seated' && (
                        <button
                          onClick={() => handleQuickComplete(b)}
                          className="crm-btn crm-btn-secondary"
                          style={{ padding: '5px 9px', fontSize: '11.5px', color: '#059669' }}
                          title="Complete Meal"
                        >
                          Complete
                        </button>
                      )}

                      <button
                        onClick={() => handleWhatsApp(b)}
                        className="crm-btn"
                        style={{ padding: '5px 8px', backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0' }}
                        title="Send WhatsApp Confirmation"
                      >
                        <MessageSquare size={14} />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="crm-btn crm-btn-secondary"
                        style={{ padding: '5px 8px' }}
                        title="Edit Reservation"
                      >
                        <Edit size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(b.id, b.guestName)}
                        className="crm-btn crm-btn-danger"
                        style={{ padding: '5px 8px' }}
                        title="Delete Reservation"
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

      {/* Edit Modal */}
      {isEditOpen && selectedBooking && (
        <div className="crm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setIsEditOpen(false)}>
          <div className="crm-modal" style={{ maxWidth: '520px' }}>
            <div className="crm-modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Table Reservation #{selectedBooking.id}
              </h3>
              <button onClick={() => setIsEditOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="crm-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="crm-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="seated">Seated (Active Dining)</option>
                    <option value="completed">Completed & Billed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="crm-form-group">
                  <label className="crm-label">Table Number</label>
                  <select
                    value={editTable}
                    onChange={(e) => setEditTable(e.target.value)}
                    className="crm-select"
                  >
                    {store.diningTables.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.section})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Estimated / Actual Bill (₹)</label>
                <input
                  type="number"
                  value={editBill}
                  onChange={(e) => setEditBill(Number(e.target.value))}
                  className="crm-input"
                />
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Staff & Chef Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="crm-textarea"
                  placeholder="e.g. Complimentary champagne glass served, spice level medium"
                />
              </div>

              <div className="crm-modal-footer" style={{ padding: '12px 0 0 0', background: 'none' }}>
                <button type="button" onClick={() => setIsEditOpen(false)} className="crm-btn crm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="crm-btn crm-btn-primary">
                  Update Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isQuickOpen && (
        <QuickBookingModal
          initialTab="dining"
          onClose={() => setIsQuickOpen(false)}
        />
      )}
    </div>
  );
}
