'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, ShieldCheck, Check, Sparkles, MapPin } from 'lucide-react';
import { createVehicleBooking } from '@/lib/crmStore';
import BookingConfirmationModal, { BookingConfirmationProps } from './BookingConfirmationModal';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    id: string;
    name: string;
    category: '2-wheeler' | '4-wheeler';
    categoryLabel: string;
    price: number;
    image: string;
    features: string[];
  } | null;
}

export default function VehicleBookingModal({ isOpen, onClose, vehicle }: VehicleModalProps) {
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [helmetCount, setHelmetCount] = useState(2);
  const [hotelDelivery, setHotelDelivery] = useState(true);
  const [specialRequests, setSpecialRequests] = useState('');
  const [minDate, setMinDate] = useState('');

  const [confirmationData, setConfirmationData] = useState<BookingConfirmationProps['booking']>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
  }, []);

  if (!isOpen || !vehicle) return null;

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);
    if (rDate <= pDate) return 1;
    const diff = Math.abs(rDate.getTime() - pDate.getTime());
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const days = calculateDays();
  const totalPrice = vehicle.price * days;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone || !pickupDate || !returnDate) {
      alert('Please fill in all required fields.');
      return;
    }

    const newBooking = createVehicleBooking({
      guestName,
      guestPhone,
      guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '')}@guest.casaparadiso.in`,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleCategory: vehicle.category,
      vehicleImage: vehicle.image,
      pickupDate,
      returnDate,
      days,
      dailyRate: vehicle.price,
      totalPrice,
      helmetCount: vehicle.category === '2-wheeler' ? helmetCount : 0,
      hotelDelivery,
      specialRequests
    });

    setConfirmationData({
      id: newBooking.id,
      type: 'Vehicle Rental',
      title: vehicle.name,
      guestName,
      guestPhone,
      guestEmail: newBooking.guestEmail,
      dateSummary: `${pickupDate} to ${returnDate} (${days} Day${days > 1 ? 's' : ''})`,
      totalPrice,
      detailsList: [
        { label: 'Vehicle Type', value: vehicle.categoryLabel },
        { label: 'Daily Rental Rate', value: `₹${vehicle.price.toLocaleString('en-IN')}/day` },
        { label: 'Hotel Doorstep Drop', value: hotelDelivery ? 'Yes (Complimentary)' : 'Self Pickup' },
        ...(vehicle.category === '2-wheeler' ? [{ label: 'Helmets Included', value: `${helmetCount} Sanitized Helmet(s)` }] : []),
        ...(specialRequests ? [{ label: 'Special Requests', value: specialRequests }] : [])
      ]
    });

    setIsConfirmationOpen(true);
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 29, 58, 0.8)',
          backdropFilter: 'blur(6px)',
          zIndex: 9990,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '540px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: '#F3F4F6',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#4B5563'
            }}
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '12px',
                backgroundColor: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              <img
                src={vehicle.image}
                alt={vehicle.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
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
                {vehicle.categoryLabel}
              </span>
              <h2 style={{ margin: '2px 0 0 0', fontSize: '22px', color: '#0B1D3A', fontWeight: 700 }}>
                Reserve {vehicle.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#0B1D3A' }}>
                  ₹{vehicle.price.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>/ day</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Pickup Date *
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    fontSize: '13px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Return Date *
                </label>
                <input
                  type="date"
                  min={pickupDate || minDate}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            {/* Guest Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sameer Kapoor"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    fontSize: '13px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
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
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '13px'
                }}
              />
            </div>

            {/* 2-wheeler specific options */}
            {vehicle.category === '2-wheeler' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', padding: '10px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>Sanitized Helmets Needed</span>
                <select
                  value={helmetCount}
                  onChange={(e) => setHelmetCount(Number(e.target.value))}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', background: '#FFF' }}
                >
                  <option value={1}>1 Helmet</option>
                  <option value={2}>2 Helmets (Included)</option>
                </select>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="deliveryCheck"
                checked={hotelDelivery}
                onChange={(e) => setHotelDelivery(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#059669' }}
              />
              <label htmlFor="deliveryCheck" style={{ fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
                Deliver vehicle directly to <strong>Casa Paradiso Reception / Portico</strong>
              </label>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                Special Notes / Flight Arrival Time (Optional)
              </label>
              <textarea
                placeholder="e.g. Arriving 4:00 PM at hotel. Need automatic transmission."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '13px',
                  resize: 'none'
                }}
              />
            </div>

            {/* Pricing Summary Footer */}
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '4px'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#065F46', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  {days} Day{days > 1 ? 's' : ''} Rental Total
                </span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#065F46' }}>
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#0B1D3A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(11, 29, 58, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                Confirm Reservation
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <BookingConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        booking={confirmationData}
      />
    </>
  );
}
