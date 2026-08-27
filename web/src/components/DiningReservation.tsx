'use client';

import React, { useState, useEffect } from 'react';
import { Utensils, Users, Calendar, Clock, Sparkles, Check } from 'lucide-react';
import { createDiningBooking } from '@/lib/crmStore';
import BookingConfirmationModal, { BookingConfirmationProps } from './BookingConfirmationModal';

export default function DiningReservation() {
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Dinner (7:30 PM - 11:00 PM)');
  const [partySize, setPartySize] = useState(2);
  const [dietary, setDietary] = useState('Vegetarian (Veg)');
  const [specialRequests, setSpecialRequests] = useState('');
  const [minDate, setMinDate] = useState('');

  const [confirmationData, setConfirmationData] = useState<BookingConfirmationProps['booking']>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone || !date) {
      alert('Please fill in your name, phone number, and reservation date.');
      return;
    }

    const newBooking = createDiningBooking({
      guestName,
      guestPhone,
      guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '')}@guest.casaparadiso.in`,
      date,
      timeSlot,
      partySize,
      dietaryPreferences: dietary,
      specialRequests
    });

    setConfirmationData({
      id: newBooking.id,
      type: 'Dining Reservation',
      title: `Table for ${partySize} (${timeSlot.split('(')[0].trim()})`,
      guestName,
      guestPhone,
      guestEmail: newBooking.guestEmail,
      dateSummary: `${date} at ${timeSlot}`,
      detailsList: [
        { label: 'Party Size', value: `${partySize} Guest${partySize > 1 ? 's' : ''}` },
        { label: 'Meal Slot', value: timeSlot },
        { label: 'Dietary Preference', value: dietary },
        ...(specialRequests ? [{ label: 'Special Occasion / Notes', value: specialRequests }] : [])
      ]
    });

    setIsConfirmationOpen(true);
    // Reset fields
    setSpecialRequests('');
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)',
        padding: '32px',
        marginTop: '36px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#92400E'
          }}
        >
          <Utensils size={22} />
        </div>
        <div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#059669',
              letterSpacing: '1px'
            }}
          >
            Table Reservations
          </span>
          <h3 style={{ margin: 0, fontSize: '22px', color: '#0B1D3A', fontWeight: 700 }}>
            Reserve a Table at Casa Paradiso Dining
          </h3>
        </div>
      </div>
      <p style={{ color: '#4B5563', fontSize: '14px', margin: '0 0 24px 0', lineHeight: 1.6 }}>
        Experience fresh Mandovi seafood catches, authentic Goan fish curry, wood-fired culinary specials, and craft cocktails. Reserved tables are held for 20 minutes.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {/* Date */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Reservation Date *
            </label>
            <input
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontSize: '14px',
                background: '#F9FAFB'
              }}
            />
          </div>

          {/* Time Slot */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Dining Meal Slot *
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontSize: '14px',
                background: '#F9FAFB'
              }}
            >
              <option value="Breakfast (8:00 AM - 10:30 AM)">Breakfast (8:00 AM - 10:30 AM)</option>
              <option value="Lunch (12:30 PM - 3:30 PM)">Lunch (12:30 PM - 3:30 PM)</option>
              <option value="Sunset & Hi-Tea (4:30 PM - 6:30 PM)">Sunset & Hi-Tea (4:30 PM - 6:30 PM)</option>
              <option value="Dinner (7:30 PM - 11:00 PM)">Dinner (7:30 PM - 11:00 PM)</option>
            </select>
          </div>

          {/* Party Size */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Number of Guests *
            </label>
            <select
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontSize: '14px',
                background: '#F9FAFB'
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest (Solo Table)' : `Guests`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {/* Guest Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Guest Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Ananya Sharma"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontSize: '14px',
                background: '#F9FAFB'
              }}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Phone / WhatsApp *
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontSize: '14px',
                background: '#F9FAFB'
              }}
            />
          </div>

          {/* Dietary Preference */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Culinary & Dietary Preference *
            </label>
            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontSize: '14px',
                background: '#F9FAFB'
              }}
            >
              <option value="Vegetarian (Veg)">🌱 Vegetarian (Veg)</option>
              <option value="Non-Vegetarian (Non-Veg)">🍗 Non-Vegetarian (Non-Veg)</option>
            </select>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            Special Occasion / Table Preference (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Birthday celebration, Candlelight table, Courtyard garden seating, or High chair needed"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '14px',
              background: '#F9FAFB'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#0B1D3A',
              color: '#FFFFFF',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(11, 29, 58, 0.25)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} color="#34D399" />
            Reserve Table Now
          </button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <BookingConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        booking={confirmationData}
      />
    </div>
  );
}
