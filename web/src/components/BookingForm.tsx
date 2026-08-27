'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, User, Phone, Mail, MessageSquare, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';
import { getCRMStore, subscribeToCRM, createRoomBooking } from '@/lib/crmStore';
import { RoomPriceConfig } from '@/lib/types';
import BookingConfirmationModal, { BookingConfirmationProps } from './BookingConfirmationModal';

const defaultPrices: RoomPriceConfig = {
  ac: { single: 1200, double: 1800, triple: 2000 },
  nonac: { single: 1200, double: 1500, triple: 800 }
};

export default function BookingForm() {
  const [prices, setPrices] = useState<RoomPriceConfig>(defaultPrices);
  const [roomType, setRoomType] = useState<'ac' | 'nonac'>('ac');
  const [occupancy, setOccupancy] = useState<'single' | 'double' | 'triple'>('double');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [minDate, setMinDate] = useState('');

  const [confirmationData, setConfirmationData] = useState<BookingConfirmationProps['booking']>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);

    const loadPrices = () => {
      const store = getCRMStore();
      if (store.settings?.roomPrices) {
        setPrices(store.settings.roomPrices);
      }
    };
    loadPrices();
    const unsubscribe = subscribeToCRM(loadPrices);
    return () => unsubscribe();
  }, []);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const inD = new Date(checkIn);
    const outD = new Date(checkOut);
    if (outD <= inD) return 0;
    const diff = Math.abs(outD.getTime() - inD.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const baseRate = prices[roomType]?.[occupancy] || 1800;
  const totalPrice = baseRate * (nights || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !name || !phone) {
      alert('Please fill in all required fields.');
      return;
    }
    if (nights <= 0) {
      alert('Check-out date must be after check-in date.');
      return;
    }

    const roomLabel = roomType === 'ac' ? 'Paradise AC Suite' : 'Heritage Non-AC Room';
    const guestEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@guest.casaparadiso.in`;

    // Save to CRM database
    const newBooking = createRoomBooking({
      guestName: name,
      guestPhone: phone,
      guestEmail,
      roomType,
      occupancy,
      checkIn,
      checkOut,
      nights,
      baseRate,
      totalPrice,
      specialRequests
    });

    setConfirmationData({
      id: newBooking.id,
      type: 'Room',
      title: roomLabel,
      guestName: name,
      guestPhone: phone,
      guestEmail,
      dateSummary: `${checkIn} to ${checkOut} (${nights} Night${nights > 1 ? 's' : ''})`,
      totalPrice,
      detailsList: [
        { label: 'Room Category', value: roomLabel },
        { label: 'Occupancy', value: `${occupancy.charAt(0).toUpperCase() + occupancy.slice(1)} Occupancy` },
        { label: 'Nightly Rate', value: `₹${baseRate.toLocaleString('en-IN')}/night` },
        { label: 'Total Duration', value: `${nights} Night${nights > 1 ? 's' : ''}` },
        ...(specialRequests ? [{ label: 'Special Requests', value: specialRequests }] : [])
      ]
    });

    setIsConfirmationOpen(true);
    setSpecialRequests('');
  };

  return (
    <section id="contact" className="contact">
      <div className="container contact__container">
        {/* Booking Form */}
        <div id="booking">
          <span className="section-label">Direct Reservations</span>
          <h2 className="section-title">Book Your Stay at Casa Paradiso</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '28px', fontSize: '15px' }}>
            Instant reservation confirmation, zero booking fees, and live front desk synchronization.
          </p>

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="booking-form__row">
              <div className="form-group">
                <label>Room Category</label>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value as any)}>
                  <option value="ac">Paradise AC Suite</option>
                  <option value="nonac">Heritage Non-AC Room</option>
                </select>
              </div>
              <div className="form-group">
                <label>Occupancy</label>
                <select value={occupancy} onChange={(e) => setOccupancy(e.target.value as any)}>
                  <option value="single">Single Occupancy</option>
                  <option value="double">Double Occupancy</option>
                  <option value="triple">Triple Occupancy</option>
                </select>
              </div>
            </div>

            <div className="booking-form__row">
              <div className="form-group">
                <label>Check-In Date *</label>
                <input 
                  type="date" 
                  min={minDate} 
                  value={checkIn} 
                  onChange={(e) => setCheckIn(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Check-Out Date *</label>
                <input 
                  type="date" 
                  min={checkIn || minDate} 
                  value={checkOut} 
                  onChange={(e) => setCheckOut(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="booking-form__row">
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rahul Verma" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone / WhatsApp *</label>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="booking-form__row">
              <div className="form-group">
                <label>Email Address (Optional)</label>
                <input 
                  type="email" 
                  placeholder="rahul@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Special Requests (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Quiet floor, early arrival, extra bed" 
                  value={specialRequests} 
                  onChange={(e) => setSpecialRequests(e.target.value)} 
                />
              </div>
            </div>

            <div className="price-summary">
              <div>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', display: 'block' }}>
                  {nights > 0 ? `${nights} Night(s) • ₹${baseRate.toLocaleString('en-IN')}/night` : 'Estimated Total'}
                </span>
                <span className="price-summary__total">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <button type="submit" className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} />
                Reserve Suite Now
              </button>
            </div>
          </form>
        </div>

        {/* Location & Contact Info */}
        <div className="contact__info" style={{ marginTop: '0' }}>
          <div className="contact__detail">
            <h4>Location & Address</h4>
            <p>Ghanekar Building, Rua José Falcão, Altinho, Panaji, Goa 403001</p>
          </div>

          {/* Embedded Google Map */}
          <div className="contact__map-wrapper" style={{ marginTop: '4px', marginBottom: '8px' }}>
            <iframe
              title="Casa Paradiso Google Map Location"
              src="https://maps.google.com/maps?q=Casa+Paradiso,+Ghanekar+Building,+Rua+Jos%C3%A9+Falc%C3%A3o,+Altinho,+Panaji,+Goa+403001&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="220"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                display: 'block',
                filter: 'contrast(1.02) brightness(0.95)'
              }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <a
              href="https://maps.app.goo.gl/iKyFhnt8Q5JwUMD46"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '12px',
                fontSize: '13px',
                padding: '10px 18px',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <MapPin size={15} color="#34D399" />
              Open in Google Maps
              <ExternalLink size={14} style={{ opacity: 0.7 }} />
            </a>
          </div>

          <div className="contact__detail">
            <h4>Direct Phone & Enquiries</h4>
            <p>
              <a href="tel:+919881247847" style={{ color: 'var(--color-champagne)', textDecoration: 'none', fontWeight: 600 }}>
                +91 98812 47847
              </a>
            </p>
          </div>
          <div className="contact__detail">
            <h4>Email</h4>
            <p>
              <a href="mailto:Paradisepanjim@gmail.com" style={{ color: 'rgba(255, 255, 255, 0.9)', textDecoration: 'none' }}>
                Paradisepanjim@gmail.com
              </a>
            </p>
          </div>
          <div className="contact__detail">
            <h4>Check-in / Check-out</h4>
            <p>Check-in: 1:00 PM | Check-out: 11:00 AM</p>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <BookingConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        booking={confirmationData}
      />
    </section>
  );
}
