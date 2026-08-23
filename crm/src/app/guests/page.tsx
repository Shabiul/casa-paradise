'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  X,
  Phone,
  Mail,
  MessageSquare,
  Tag,
  Star,
  BedDouble,
  Car,
  UtensilsCrossed,
  Receipt,
  Edit,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  getCRMStore,
  subscribeToCRM,
  updateGuestProfile,
  getOrCreateFolioForGuest
} from '@/lib/crmStore';
import { Guest, GuestTag, CRMStoreData } from '@/lib/types';
import InvoiceModal from '@/components/InvoiceModal';

export default function GuestsAdminPage() {
  const [store, setStore] = useState<CRMStoreData>(getCRMStore());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('all');

  // Selected Guest Dossier Modal
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Edit fields
  const [editAddress, setEditAddress] = useState('');
  const [editIdType, setEditIdType] = useState<any>('Aadhaar');
  const [editIdNum, setEditIdNum] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editTags, setEditTags] = useState<GuestTag[]>([]);

  // Folio
  const [viewFolioGuestId, setViewFolioGuestId] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setStore(getCRMStore());
    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  const filteredGuests = store.guests.filter(g => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      g.name.toLowerCase().includes(q) ||
      g.phone.includes(q) ||
      g.email.toLowerCase().includes(q) ||
      (g.idProofNumber && g.idProofNumber.toLowerCase().includes(q));
    const matchesTag = filterTag === 'all' || g.tags.includes(filterTag as any);
    return matchesSearch && matchesTag;
  });

  const vipCount = store.guests.filter(g => g.tags.includes('VIP')).length;
  const repeatCount = store.guests.filter(g => g.totalBookings >= 2).length;

  const handleOpenDossier = (g: Guest) => {
    setSelectedGuest(g);
    setEditAddress(g.address || '');
    setEditIdType(g.idProofType || 'Aadhaar');
    setEditIdNum(g.idProofNumber || '');
    setEditNotes(g.notes || '');
    setEditTags(g.tags || []);
    setIsDossierOpen(true);
  };

  const handleSaveDossier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;

    updateGuestProfile(selectedGuest.id, {
      address: editAddress,
      idProofType: editIdType,
      idProofNumber: editIdNum,
      notes: editNotes,
      tags: editTags
    });

    setIsDossierOpen(false);
  };

  const toggleTag = (tag: GuestTag) => {
    if (editTags.includes(tag)) {
      setEditTags(editTags.filter(t => t !== tag));
    } else {
      setEditTags([...editTags, tag]);
    }
  };

  const handleWhatsApp = (g: Guest) => {
    const text = encodeURIComponent(
      `Dear ${g.name}, greetings from Casa Paradiso Panaji! How may our front desk team assist you today?`
    );
    const cleanPhone = g.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={22} color="#059669" />
            <span>Guest 360 CRM & Lifetime Profiles</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Cross-service guest tracking, KYC identification, stay histories, VIP preferences & lifetime ledger.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="crm-metrics-grid">
        <div className="crm-metric-card">
          <span className="crm-metric-label">Total Registered Profiles</span>
          <div className="crm-metric-value" style={{ color: '#0284C7' }}>{store.guests.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Verified phone & email identities</div>
        </div>

        <div className="crm-metric-card">
          <span className="crm-metric-label">VIP Guests</span>
          <div className="crm-metric-value" style={{ color: '#D97706' }}>{vipCount}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>High-value patrons & suites</div>
        </div>

        <div className="crm-metric-card">
          <span className="crm-metric-label">Repeat Stay Rate</span>
          <div className="crm-metric-value" style={{ color: '#059669' }}>
            {store.guests.length > 0 ? Math.round((repeatCount / store.guests.length) * 100) : 0}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{repeatCount} multi-stay guests</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
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
            { key: 'all', label: 'All Guests' },
            { key: 'VIP', label: 'VIP' },
            { key: 'Repeat Guest', label: 'Repeat' },
            { key: 'Honeymoon', label: 'Honeymoon' },
            { key: 'Corporate', label: 'Corporate' },
            { key: 'Long Stay', label: 'Long Stay' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterTag(tab.key)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: filterTag === tab.key ? 'var(--accent-emerald)' : 'var(--bg-elevated)',
                color: filterTag === tab.key ? '#FFF' : 'var(--text-secondary)',
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

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search guest, phone, Aadhaar/Passport..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="crm-input"
            style={{ paddingLeft: '34px', width: '100%', fontSize: '12.5px' }}
          />
        </div>
      </div>

      {/* Guests Table */}
      <div className="crm-table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Guest Name & ID</th>
              <th>Contact Details</th>
              <th>Tags & Loyalty</th>
              <th>Total Stays</th>
              <th>Lifetime Spend</th>
              <th>Last Visit</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                  No guest profiles found matching your search.
                </td>
              </tr>
            ) : (
              filteredGuests.map(g => (
                <tr key={g.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '14px' }}>{g.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{g.id} {g.address ? `· ${g.address}` : ''}</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{g.phone}</div>
                    <div style={{ fontSize: '11.5px', color: '#0284C7' }}>{g.email}</div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {g.tags.map(t => (
                        <span
                          key={t}
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor:
                              t === 'VIP'
                                ? '#FEF3C7'
                                : t === 'Honeymoon'
                                ? '#FCE7F3'
                                : '#DCFCE7',
                            color:
                              t === 'VIP'
                                ? '#92400E'
                                : t === 'Honeymoon'
                                ? '#BE185D'
                                : '#15803D'
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td>
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{g.totalBookings}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '4px' }}>bookings</span>
                  </td>

                  <td>
                    <div style={{ fontWeight: 800, color: '#059669' }}>
                      ₹{g.totalSpent.toLocaleString('en-IN')}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>{g.lastVisit || 'Recent'}</div>
                    {g.idProofNumber && (
                      <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                        {g.idProofType}: {g.idProofNumber}
                      </div>
                    )}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => handleWhatsApp(g)}
                        className="crm-btn"
                        style={{ padding: '5px 8px', backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0' }}
                        title="WhatsApp Concierge Message"
                      >
                        <MessageSquare size={14} />
                      </button>

                      <button
                        onClick={() => setViewFolioGuestId(g.id)}
                        className="crm-btn crm-btn-secondary"
                        style={{ padding: '5px 8px' }}
                        title="View Invoicing Folio"
                      >
                        <Receipt size={14} color="#059669" />
                      </button>

                      <button
                        onClick={() => handleOpenDossier(g)}
                        className="crm-btn crm-btn-primary"
                        style={{ padding: '5px 9px', fontSize: '11.5px' }}
                        title="Open Full 360 Dossier"
                      >
                        <span>Dossier</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Guest 360 Dossier Modal */}
      {isDossierOpen && selectedGuest && (
        <div className="crm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setIsDossierOpen(false)}>
          <div className="crm-modal" style={{ maxWidth: '680px' }}>
            <div className="crm-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={20} color="#059669" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Guest 360 Dossier: {selectedGuest.name} ({selectedGuest.id})
                </h3>
              </div>
              <button onClick={() => setIsDossierOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDossier} className="crm-modal-body">
              {/* KYC & Identity Section */}
              <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  KYC & Identity Proof
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="crm-form-group">
                    <label className="crm-label">ID Proof Document Type</label>
                    <select
                      value={editIdType}
                      onChange={(e) => setEditIdType(e.target.value as any)}
                      className="crm-select"
                    >
                      <option value="Aadhaar">Aadhaar Card (India)</option>
                      <option value="Passport">International Passport</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Other">Other Official ID</option>
                    </select>
                  </div>

                  <div className="crm-form-group">
                    <label className="crm-label">Document Number</label>
                    <input
                      type="text"
                      value={editIdNum}
                      onChange={(e) => setEditIdNum(e.target.value)}
                      placeholder="e.g. XXXX-XXXX-9912 or Z981249"
                      className="crm-input"
                    />
                  </div>
                </div>

                <div className="crm-form-group">
                  <label className="crm-label">Home City & Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="e.g. Bandra West, Mumbai, Maharashtra"
                    className="crm-input"
                  />
                </div>
              </div>

              {/* Tag Editor */}
              <div className="crm-form-group">
                <label className="crm-label">Segmentation Tags</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(['VIP', 'Repeat Guest', 'Honeymoon', 'Corporate', 'Family', 'Long Stay'] as GuestTag[]).map(t => {
                    const isSelected = editTags.includes(t);
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => toggleTag(t)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-full)',
                          border: isSelected ? '1px solid #059669' : '1px solid var(--border-medium)',
                          backgroundColor: isSelected ? '#DCFCE7' : 'var(--bg-elevated)',
                          color: isSelected ? '#15803D' : 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {t} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Internal Staff Notes */}
              <div className="crm-form-group">
                <label className="crm-label">Guest Preferences & Concierge Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="crm-textarea"
                  placeholder="e.g. Prefers top floor suites, vegetarian breakfast, early morning taxi to airport"
                />
              </div>

              {/* Historical Stays Summary */}
              <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                    Lifetime Revenue: ₹{selectedGuest.totalSpent.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {selectedGuest.totalBookings} Total Reservations
                  </span>
                </div>
              </div>

              <div className="crm-modal-footer" style={{ padding: '12px 0 0 0', background: 'none' }}>
                <button type="button" onClick={() => setIsDossierOpen(false)} className="crm-btn crm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="crm-btn crm-btn-primary">
                  Save Dossier Updates
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
    </div>
  );
}
