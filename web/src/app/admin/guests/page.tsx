'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  X,
  Phone,
  Mail,
  MessageCircle,
  Tag,
  Star,
  BedDouble,
  Car,
  UtensilsCrossed,
  FileText,
  Clock,
  Sparkles,
  Edit
} from 'lucide-react';
import { getCRMStore, subscribeToCRM, updateGuest } from '@/lib/crmStore';
import { Guest, GuestTag, RoomBooking, VehicleBooking, DiningBooking } from '@/lib/types';

export default function GuestsAdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
  const [vehicleBookings, setVehicleBookings] = useState<VehicleBooking[]>([]);
  const [diningBookings, setDiningBookings] = useState<DiningBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Guest Profile Modal
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Edit fields
  const [editNotes, setEditNotes] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editTags, setEditTags] = useState<GuestTag[]>([]);

  useEffect(() => {
    const refresh = () => {
      const store = getCRMStore();
      setGuests(store.guests);
      setRoomBookings(store.roomBookings);
      setVehicleBookings(store.vehicleBookings);
      setDiningBookings(store.diningBookings);
    };
    refresh();
    const unsubscribe = subscribeToCRM(refresh);
    return () => unsubscribe();
  }, []);

  const filteredGuests = guests.filter((g) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      g.name.toLowerCase().includes(q) ||
      g.phone.includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const handleOpenProfile = (guest: Guest) => {
    setSelectedGuest(guest);
    setEditNotes(guest.notes || '');
    setEditAddress(guest.address || '');
    setEditTags(guest.tags || []);
    setIsProfileOpen(true);
  };

  const handleToggleTag = (tag: GuestTag) => {
    if (editTags.includes(tag)) {
      setEditTags(editTags.filter(t => t !== tag));
    } else {
      setEditTags([...editTags, tag]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;
    updateGuest(selectedGuest.id, {
      notes: editNotes,
      address: editAddress,
      tags: editTags
    });
    setIsProfileOpen(false);
  };

  const guestRooms = selectedGuest
    ? roomBookings.filter(b => b.guestId === selectedGuest.id || b.guestPhone === selectedGuest.phone)
    : [];

  const guestVehicles = selectedGuest
    ? vehicleBookings.filter(b => b.guestId === selectedGuest.id || b.guestPhone === selectedGuest.phone)
    : [];

  const guestDining = selectedGuest
    ? diningBookings.filter(b => b.guestId === selectedGuest.id || b.guestPhone === selectedGuest.phone)
    : [];

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#FFF', fontWeight: 700 }}>
            Guest CRM & Profiles Directory
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
            Comprehensive guest profiles, lifetime spend, booking histories across all services, and VIP preferences.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="crm-kpi-grid">
        <div className="crm-kpi-card">
          <div className="crm-kpi-header">
            <div className="crm-kpi-icon" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
              <Users size={22} />
            </div>
            <span style={{ fontSize: '11px', color: '#38BDF8' }}>Total Database</span>
          </div>
          <div className="crm-kpi-value">{guests.length}</div>
          <div className="crm-kpi-label">Registered Guests</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-header">
            <div className="crm-kpi-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
              <Star size={22} />
            </div>
            <span style={{ fontSize: '11px', color: '#F59E0B' }}>Tagged VIP</span>
          </div>
          <div className="crm-kpi-value">{guests.filter(g => g.tags.includes('VIP')).length}</div>
          <div className="crm-kpi-label">VIP Guests</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-header">
            <div className="crm-kpi-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <Sparkles size={22} />
            </div>
            <span style={{ fontSize: '11px', color: '#10B981' }}>Loyalty</span>
          </div>
          <div className="crm-kpi-value">{guests.filter(g => g.totalBookings > 1).length}</div>
          <div className="crm-kpi-label">Repeat Guests (2+ Bookings)</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="crm-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search guest by name, phone, email, VIP tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="crm-search-input"
              style={{ width: '100%', paddingLeft: '34px' }}
            />
            <Search size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          </div>
        </div>
      </div>

      {/* Guests Table */}
      <div className="crm-panel">
        <div className="crm-table-container">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Guest ID & Name</th>
                <th>Contact Info</th>
                <th>Tags & Status</th>
                <th>Total Bookings</th>
                <th>Lifetime Spend</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                    No guests found matching search query.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((g) => (
                  <tr key={g.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#1E3A8A',
                            color: '#93C5FD',
                            fontWeight: 700,
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {g.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ color: '#F8FAFC', display: 'block', fontSize: '13px' }}>{g.name}</strong>
                          <span style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>{g.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: '#CBD5E1', display: 'block', fontSize: '12px' }}>{g.phone}</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{g.email}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {g.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`crm-badge ${tag === 'VIP' ? 'crm-badge--vip' : 'crm-badge--confirmed'}`}
                            style={{ fontSize: '10px', padding: '2px 7px' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span style={{ color: '#E2E8F0', fontWeight: 600 }}>
                        {g.totalBookings} Booking{g.totalBookings > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#34D399', fontSize: '14px' }}>
                        ₹{g.totalSpent.toLocaleString('en-IN')}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                        {g.lastVisit || new Date(g.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleOpenProfile(g)}
                          className="crm-action-btn crm-action-btn--primary"
                          style={{ fontSize: '11px', padding: '4px 10px' }}
                        >
                          View Profile
                        </button>
                        <a
                          href={`https://wa.me/${g.phone.replace(/[^0-9]/g, '')}`}
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

      {/* Full Guest Profile Modal */}
      {isProfileOpen && selectedGuest && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '20px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              color: '#FFF',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsProfileOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {/* Profile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#059669',
                  color: '#FFF',
                  fontWeight: 800,
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {selectedGuest.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  GUEST PROFILE • {selectedGuest.id}
                </span>
                <h2 style={{ margin: '2px 0 0 0', fontSize: '22px', color: '#FFF' }}>
                  {selectedGuest.name}
                </h2>
                <div style={{ display: 'flex', gap: '14px', marginTop: '4px', fontSize: '12px', color: '#94A3B8' }}>
                  <span>📞 {selectedGuest.phone}</span>
                  <span>✉️ {selectedGuest.email}</span>
                </div>
              </div>
            </div>

            {/* Lifetime Stats Card */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                backgroundColor: '#0F172A',
                padding: '14px',
                borderRadius: '12px',
                marginBottom: '20px'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Total Spend</span>
                <strong style={{ fontSize: '18px', color: '#34D399' }}>₹{selectedGuest.totalSpent.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Total Bookings</span>
                <strong style={{ fontSize: '18px', color: '#38BDF8' }}>{selectedGuest.totalBookings}</strong>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Registered Since</span>
                <strong style={{ fontSize: '13px', color: '#E2E8F0' }}>{new Date(selectedGuest.createdAt).toLocaleDateString()}</strong>
              </div>
            </div>

            {/* Booking History Tabs & Summary */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#CBD5E1', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Complete Booking History
              </h3>

              {/* Rooms */}
              {guestRooms.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <BedDouble size={14} /> Suites ({guestRooms.length})
                  </span>
                  {guestRooms.map(r => (
                    <div key={r.id} style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '8px 12px', borderRadius: '8px', marginBottom: '6px', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong>{r.roomTitle}</strong> ({r.checkIn} to {r.checkOut})</span>
                      <strong style={{ color: '#34D399' }}>₹{r.totalPrice.toLocaleString('en-IN')}</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Vehicles */}
              {guestVehicles.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#FACC15', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Car size={14} /> Vehicles ({guestVehicles.length})
                  </span>
                  {guestVehicles.map(v => (
                    <div key={v.id} style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '8px 12px', borderRadius: '8px', marginBottom: '6px', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong>{v.vehicleName}</strong> ({v.pickupDate} to {v.returnDate})</span>
                      <strong style={{ color: '#34D399' }}>₹{v.totalPrice.toLocaleString('en-IN')}</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* Dining */}
              {guestDining.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#FB7185', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <UtensilsCrossed size={14} /> Dining ({guestDining.length})
                  </span>
                  {guestDining.map(d => (
                    <div key={d.id} style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '8px 12px', borderRadius: '8px', marginBottom: '6px', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong>Table for {d.partySize}</strong> on {d.date} ({d.timeSlot.split('(')[0].trim()})</span>
                      <span style={{ color: '#34D399' }}>Reserved</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Editable Profile Information */}
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Tags Toggle */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>
                  Guest Loyalty & Segment Tags
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(['VIP', 'Repeat Guest', 'Honeymoon', 'Corporate', 'Family', 'Long Stay'] as GuestTag[]).map((tag) => {
                    const isSelected = editTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#059669' : '#0F172A',
                          color: isSelected ? '#FFF' : '#94A3B8',
                          border: isSelected ? '1px solid #10B981' : '1px solid #334155'
                        }}
                      >
                        {tag} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                  Address / City of Origin
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                  VIP Preferences & Concierge Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Prefers upper floor, feather pillows, black coffee in morning."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsProfileOpen(false)} className="crm-action-btn">
                  Close
                </button>
                <button type="submit" className="crm-action-btn crm-action-btn--primary" style={{ padding: '8px 18px' }}>
                  Save Profile Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
