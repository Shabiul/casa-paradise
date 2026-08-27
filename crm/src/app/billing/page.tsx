'use client';

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Search,
  Plus,
  CreditCard,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import {
  getCRMStore,
  subscribeToCRM,
  getOrCreateFolioForGuest,
  recordFolioPayment,
  hasPermission
} from '@/lib/crmStore';
import { GuestFolio, CRMStoreData } from '@/lib/types';
import InvoiceModal from '@/components/InvoiceModal';
import AccessRestricted from '@/components/AccessRestricted';

export default function BillingAdminPage() {
  const [store, setStore] = useState<CRMStoreData>(getCRMStore());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allowed, setAllowed] = useState<boolean>(true);

  // Selected Folio Modal
  const [selectedFolio, setSelectedFolio] = useState<GuestFolio | null>(null);

  useEffect(() => {
    const update = () => {
      setAllowed(hasPermission('billing'));
      const s = getCRMStore();
      // Ensure folios exist for all guests who have bookings
      s.guests.forEach(g => {
        getOrCreateFolioForGuest(g.id);
      });
      setStore(getCRMStore());
    };

    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  if (!allowed) {
    return (
      <AccessRestricted
        moduleName="Billing & Guest Folios"
        requiredPermission="billing (Financial & Invoicing Access)"
        description="Viewing financial folios, guest invoices, tax ledgers, and payment collection requires Finance/Admin clearance."
      />
    );
  }

  const totalInvoiced = store.folios.reduce((sum, f) => sum + f.grandTotal, 0);
  const totalCollected = store.folios.reduce((sum, f) => sum + f.amountPaid, 0);
  const totalDue = store.folios.reduce((sum, f) => sum + f.balanceDue, 0);

  const filteredFolios = store.folios.filter(f => {
    const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      f.id.toLowerCase().includes(q) ||
      f.guestName.toLowerCase().includes(q) ||
      f.guestPhone.includes(q) ||
      (f.roomNumber && f.roomNumber.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt size={22} color="#059669" />
            <span>Consolidated Invoicing & Guest Folios</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Multi-service billing ledgers, GST tax breakdowns, printable receipts & settlement tracking.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="crm-metrics-grid">
        <div className="crm-metric-card">
          <span className="crm-metric-label">Total Invoiced (Gross)</span>
          <div className="crm-metric-value" style={{ color: '#0284C7' }}>
            ₹{totalInvoiced.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Rooms + Fleet + Gastronomy + GST</div>
        </div>

        <div className="crm-metric-card">
          <span className="crm-metric-label">Payments Collected</span>
          <div className="crm-metric-value" style={{ color: '#059669' }}>
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Settled at Reception & Online</div>
        </div>

        <div className="crm-metric-card">
          <span className="crm-metric-label">Pending Balances Due</span>
          <div className="crm-metric-value" style={{ color: totalDue > 0 ? '#DC2626' : '#059669' }}>
            ₹{totalDue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Payable upon checkout</div>
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
            { key: 'all', label: 'All Folios' },
            { key: 'open', label: 'Open / Due' },
            { key: 'settled', label: 'Paid & Settled' }
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

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search folio, guest, room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="crm-input"
            style={{ paddingLeft: '34px', width: '100%', fontSize: '12.5px' }}
          />
        </div>
      </div>

      {/* Folios Table */}
      <div className="crm-table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Folio # / Date</th>
              <th>Guest Name</th>
              <th>Suite</th>
              <th>Net Subtotal</th>
              <th>GST Tax</th>
              <th>Grand Total</th>
              <th>Amount Paid</th>
              <th>Balance Due</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFolios.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                  No guest folios found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredFolios.map(f => (
                <tr key={f.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{f.id}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {new Date(f.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{f.guestName}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{f.guestPhone}</div>
                  </td>

                  <td>
                    {f.roomNumber ? (
                      <span style={{ backgroundColor: '#059669', color: '#FFF', fontWeight: 800, fontSize: '11.5px', padding: '2px 7px', borderRadius: '4px' }}>
                        Room {f.roomNumber}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Day Visit</span>
                    )}
                  </td>

                  <td>₹{f.subtotal.toLocaleString('en-IN')}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>₹{f.taxAmount.toLocaleString('en-IN')}</td>

                  <td>
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      ₹{f.grandTotal.toLocaleString('en-IN')}
                    </strong>
                  </td>

                  <td style={{ color: '#059669', fontWeight: 700 }}>
                    ₹{f.amountPaid.toLocaleString('en-IN')}
                  </td>

                  <td>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '13.5px',
                        color: f.balanceDue > 0 ? '#DC2626' : '#059669'
                      }}
                    >
                      ₹{f.balanceDue.toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        backgroundColor: f.status === 'settled' ? '#DCFCE7' : '#FEE2E2',
                        color: f.status === 'settled' ? '#15803D' : '#B91C1C'
                      }}
                    >
                      {f.status}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedFolio(f)}
                      className="crm-btn crm-btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <Printer size={13} />
                      <span>View Invoice</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {selectedFolio && (
        <InvoiceModal
          folio={selectedFolio}
          onClose={() => setSelectedFolio(null)}
          onPaymentRecorded={() => {
            const updated = store.folios.find(x => x.id === selectedFolio.id);
            if (updated) setSelectedFolio(updated);
          }}
        />
      )}
    </div>
  );
}
