'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  CreditCard,
  CheckCircle2,
  Download,
  Building2,
  Phone,
  Mail,
  Receipt
} from 'lucide-react';
import { GuestFolio } from '@/lib/types';
import { recordFolioPayment } from '@/lib/crmStore';

interface InvoiceModalProps {
  folio: GuestFolio;
  onClose: () => void;
  onPaymentRecorded?: () => void;
}

export default function InvoiceModal({ folio, onClose, onPaymentRecorded }: InvoiceModalProps) {
  const [currentFolio, setCurrentFolio] = useState<GuestFolio>(folio);
  const [payAmount, setPayAmount] = useState<number | string>(folio.balanceDue);
  const [payMethod, setPayMethod] = useState('UPI / GPay');
  const [showPayBox, setShowPayBox] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setCurrentFolio(folio);
    setPayAmount(folio.balanceDue);
  }, [folio]);

  const handlePrint = () => {
    window.print();
  };

  const handleRecordPay = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(payAmount);
    if (amt <= 0) return;
    const updated = recordFolioPayment(currentFolio.id, amt, payMethod);
    if (updated) {
      setCurrentFolio(updated);
      setPayAmount(updated.balanceDue);
    }
    setIsSuccess(true);
    if (onPaymentRecorded) onPaymentRecorded();
    setTimeout(() => {
      setIsSuccess(false);
      setShowPayBox(false);
    }, 1200);
  };

  return (
    <div className="crm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="crm-modal" style={{ maxWidth: '780px' }}>
        {/* Controls header (hidden on print) */}
        <div className="crm-modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={20} color="#059669" />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Guest Folio &amp; Tax Invoice ({currentFolio.id})
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrint}
              className="crm-btn crm-btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12.5px' }}
            >
              <Printer size={15} />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Area */}
        <div className="crm-modal-body print-invoice" style={{ backgroundColor: '#FFF', color: '#0F172A', padding: '36px', borderRadius: 'var(--radius-lg)' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #059669', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '0.5px' }}>
                CASA PARADISO
              </h1>
              <p style={{ fontSize: '12px', color: '#059669', fontWeight: 700, textTransform: 'uppercase', margin: '2px 0 6px 0' }}>
                Boutique Heritage Hotel · Panaji, Goa
              </p>
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                Ghanekar Building, Rua José Falcão, Altinho, Panaji, Goa 403001<br />
                Phone: +91 98812 47847 · GSTIN: 30AAAAA0000A1Z5
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: currentFolio.balanceDue === 0 ? '#DCFCE7' : '#FEF3C7',
                  color: currentFolio.balanceDue === 0 ? '#166534' : '#92400E',
                  fontWeight: 800,
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}
              >
                {currentFolio.balanceDue === 0 ? 'PAID & SETTLED' : 'PAYMENT DUE'}
              </span>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748B' }}>
                <strong>Invoice:</strong> {currentFolio.id}<br />
                <strong>Date:</strong> {new Date(currentFolio.createdAt).toLocaleDateString('en-IN')}<br />
                {currentFolio.roomNumber && <span><strong>Room:</strong> Suite {currentFolio.roomNumber}</span>}
              </div>
            </div>
          </div>

          {/* Guest Dossier Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Billed To:</span>
              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '15px', marginTop: '2px' }}>{currentFolio.guestName}</div>
              <div style={{ color: '#475569' }}>{currentFolio.guestPhone}</div>
              <div style={{ color: '#475569' }}>{currentFolio.guestEmail}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>Stay Itinerary:</span>
              {currentFolio.checkIn && currentFolio.checkOut ? (
                <div style={{ color: '#334155', marginTop: '2px', fontWeight: 600 }}>
                  Check-In: {currentFolio.checkIn}<br />
                  Check-Out: {currentFolio.checkOut}
                </div>
              ) : (
                <div style={{ color: '#64748B', marginTop: '2px' }}>Non-room / Day Guest</div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '24px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: '#334155', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '10px 12px', color: '#334155', fontWeight: 700 }}>Description</th>
                <th style={{ padding: '10px 12px', color: '#334155', fontWeight: 700, textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '10px 12px', color: '#334155', fontWeight: 700, textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ padding: '10px 12px', color: '#334155', fontWeight: 700, textAlign: 'right' }}>GST</th>
                <th style={{ padding: '10px 12px', color: '#334155', fontWeight: 700, textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {currentFolio.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px 12px', color: '#64748B', fontSize: '12px' }}>{item.date}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1E293B' }}>{item.description}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748B' }}>{item.taxRatePercent}%</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>
                    ₹{item.totalPrice.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Calculation Box */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Subtotal (Net):</span>
                <span>₹{currentFolio.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>GST Tax (CGST + SGST):</span>
                <span>₹{currentFolio.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              {currentFolio.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>Promotional Discount:</span>
                  <span>-₹{currentFolio.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '16px', color: '#0F172A', borderTop: '2px solid #059669', paddingTop: '8px' }}>
                <span>Grand Total:</span>
                <span>₹{currentFolio.grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534', fontWeight: 700 }}>
                <span>Amount Paid:</span>
                <span>₹{currentFolio.amountPaid.toLocaleString('en-IN')}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '15px',
                  color: currentFolio.balanceDue > 0 ? '#DC2626' : '#166534',
                  backgroundColor: currentFolio.balanceDue > 0 ? '#FEE2E2' : '#DCFCE7',
                  padding: '6px 10px',
                  borderRadius: '4px'
                }}
              >
                <span>Balance Due:</span>
                <span>₹{currentFolio.balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>
            Thank you for staying with us at Casa Paradiso Panaji. We hope to welcome you back soon!<br />
            This is a computer generated tax invoice.
          </div>
        </div>

        {/* Record Payment Section (no-print) */}
        {currentFolio.balanceDue > 0 && (
          <div className="crm-modal-footer no-print" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
            {!showPayBox ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowPayBox(true)}
                  className="crm-btn crm-btn-primary"
                >
                  <CreditCard size={16} />
                  <span>Collect Payment (₹{currentFolio.balanceDue.toLocaleString('en-IN')})</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecordPay} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="number"
                    min="1"
                    max={currentFolio.balanceDue}
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="crm-input"
                    placeholder="Amount to collect"
                  />
                </div>
                <div style={{ width: '160px' }}>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="crm-select"
                  >
                    <option value="UPI / GPay">UPI / GPay</option>
                    <option value="Credit / Debit Card">Card POS</option>
                    <option value="Cash at Desk">Cash Desk</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <button type="submit" className="crm-btn crm-btn-primary">
                  Confirm Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayBox(false)}
                  className="crm-btn crm-btn-secondary"
                >
                  Cancel
                </button>
              </form>
            )}

            {isSuccess && (
              <div style={{ color: '#34D399', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} />
                <span>Payment recorded and folio updated!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
