'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Calendar, Download, X, Clock, MapPin } from 'lucide-react';

export interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    type: 'Room' | 'Vehicle Rental' | 'Dining Reservation';
    title: string;
    guestName: string;
    guestPhone: string;
    guestEmail: string;
    dateSummary: string;
    totalPrice?: number;
    detailsList: { label: string; value: string }[];
  } | null;
}

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  booking
}: BookingConfirmationProps) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10B981', '#34D399', '#0B1D3A', '#D4AF37']
        });
      } catch (e) {
        console.warn('Confetti effect failed', e);
      }
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello Casa Paradiso! 👋\nI have just booked ${booking.title} on your website.\n\n` +
    `🔖 Booking Reference: ${booking.id}\n` +
    `👤 Guest: ${booking.guestName}\n` +
    `📅 Details: ${booking.dateSummary}\n` +
    (booking.totalPrice ? `💰 Total: ₹${booking.totalPrice.toLocaleString('en-IN')}\n` : '') +
    `\nPlease confirm my reservation. Thank you!`
  );

  const handleDownloadSummary = () => {
    const content =
      `=================================================\n` +
      `       CASA PARADISO — LUXURY BOUTIQUE HOTEL     \n` +
      `        Panaji, Altinho Hill, Goa 403001         \n` +
      `=================================================\n\n` +
      `BOOKING CONFIRMATION & RECEIPT\n` +
      `-------------------------------------------------\n` +
      `Reference ID  : ${booking.id}\n` +
      `Service       : ${booking.type} — ${booking.title}\n` +
      `Guest Name    : ${booking.guestName}\n` +
      `Contact Phone : ${booking.guestPhone}\n` +
      `Email         : ${booking.guestEmail}\n` +
      `Schedule      : ${booking.dateSummary}\n` +
      (booking.totalPrice ? `Estimated Total : ₹${booking.totalPrice.toLocaleString('en-IN')}\n` : '') +
      `Status        : Instant Received (Synced with Front Desk)\n\n` +
      `ADDITIONAL DETAILS:\n` +
      booking.detailsList.map(d => `• ${d.label}: ${d.value}`).join('\n') +
      `\n\n-------------------------------------------------\n` +
      `HOTEL CONTACT:\n` +
      `Phone: +91 98812 47847\n` +
      `Email: Paradisepanjim@gmail.com\n` +
      `Address: Ghanekar Building, Rua José Falcão, Altinho, Panaji, Goa\n` +
      `=================================================\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${booking.id}_CasaParadiso_Receipt.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 29, 58, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F3F4F6',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#4B5563',
            transition: 'all 0.2s'
          }}
        >
          <X size={18} />
        </button>

        {/* Success Icon & Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)'
            }}
          >
            <CheckCircle2 size={40} color="#059669" />
          </div>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              fontWeight: 700,
              fontSize: '12px',
              borderRadius: '999px',
              marginBottom: '8px',
              letterSpacing: '0.5px'
            }}
          >
            REFERENCE: {booking.id}
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display, serif)',
              fontSize: '28px',
              color: '#0B1D3A',
              margin: '0 0 6px 0'
            }}
          >
            Booking Received!
          </h2>
          <p style={{ color: '#4B5563', fontSize: '14px', margin: 0 }}>
            Your reservation has been recorded and synced with our front desk.
          </p>
        </div>

        {/* Booking Card Summary */}
        <div
          style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            padding: '20px',
            marginBottom: '24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid #E5E7EB',
              paddingBottom: '12px',
              marginBottom: '14px'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#059669',
                  letterSpacing: '1px',
                  display: 'block',
                  marginBottom: '2px'
                }}
              >
                {booking.type}
              </span>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#111827', fontWeight: 600 }}>
                {booking.title}
              </h3>
            </div>
            {booking.totalPrice !== undefined && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', display: 'block' }}>Total Amount</span>
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#0B1D3A',
                    fontFamily: 'var(--font-display, serif)'
                  }}
                >
                  ₹{booking.totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
            <div>
              <span style={{ color: '#6B7280', display: 'block', fontSize: '11px' }}>Guest Name</span>
              <strong style={{ color: '#1F2937' }}>{booking.guestName}</strong>
            </div>
            <div>
              <span style={{ color: '#6B7280', display: 'block', fontSize: '11px' }}>Phone / WhatsApp</span>
              <strong style={{ color: '#1F2937' }}>{booking.guestPhone}</strong>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: '#6B7280', display: 'block', fontSize: '11px' }}>Schedule / Dates</span>
              <strong style={{ color: '#1F2937' }}>{booking.dateSummary}</strong>
            </div>
            {booking.detailsList.map((item, i) => (
              <div key={i} style={{ gridColumn: item.label === 'Special Requests' ? 'span 2' : 'auto' }}>
                <span style={{ color: '#6B7280', display: 'block', fontSize: '11px' }}>{item.label}</span>
                <strong style={{ color: '#1F2937' }}>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a
            href={`https://wa.me/919881247847?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              padding: '14px 20px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            <MessageCircle size={20} />
            Chat / Confirm on WhatsApp
          </a>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleDownloadSummary}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#F3F4F6',
                border: '1px solid #D1D5DB',
                color: '#374151',
                padding: '12px 16px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Download size={16} />
              Save Receipt
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: '#0B1D3A',
                border: 'none',
                color: '#FFFFFF',
                padding: '12px 16px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Done & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
