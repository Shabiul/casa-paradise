'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  BedDouble,
  Car,
  UtensilsCrossed,
  Wrench,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import {
  getCRMStore,
  createRoomBooking,
  createVehicleBooking,
  createDiningBooking,
  createMaintenanceTicket
} from '@/lib/crmStore';
import { RoomPriceConfig, VehiclePriceConfig } from '@/lib/types';

interface QuickModalProps {
  initialTab?: 'room' | 'vehicle' | 'dining' | 'maintenance';
  onClose: () => void;
}

export default function QuickBookingModal({ initialTab = 'room', onClose }: QuickModalProps) {
  const [activeTab, setActiveTab] = useState<'room' | 'vehicle' | 'dining' | 'maintenance'>(initialTab);
  const [successMsg, setSuccessMsg] = useState('');

  // Room Form State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [roomType, setRoomType] = useState<'ac' | 'nonac'>('ac');
  const [occupancy, setOccupancy] = useState<'single' | 'double' | 'triple'>('double');
  const [checkIn, setCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState('');
  const [assignedRoom, setAssignedRoom] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Vehicle Form State
  const [vehicleId, setVehicleId] = useState('activa');
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Dining Form State
  const [diningDate, setDiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [diningSlot, setDiningSlot] = useState('Dinner (7:30 PM - 11:00 PM)');
  const [partySize, setPartySize] = useState(2);
  const [dietary, setDietary] = useState('Goan Seafood Special');
  const [tableNumber, setTableNumber] = useState('T-1');

  // Maintenance Form State
  const [maintArea, setMaintArea] = useState<'Room' | 'Restaurant' | 'Lobby' | 'Vehicles' | 'General'>('Room');
  const [maintRoom, setMaintRoom] = useState('101');
  const [maintTitle, setMaintTitle] = useState('');
  const [maintDesc, setMaintDesc] = useState('');
  const [maintPriority, setMaintPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [maintAssignee, setMaintAssignee] = useState('Duty Electrician');

  // Prices
  const [roomPrices, setRoomPrices] = useState<RoomPriceConfig>({
    ac: { single: 1200, double: 1800, triple: 2000 },
    nonac: { single: 1200, double: 1500, triple: 800 }
  });
  const [availableRooms, setAvailableRooms] = useState<{ roomNumber: string; title: string }[]>([]);

  useEffect(() => {
    const store = getCRMStore();
    if (store.settings?.roomPrices) {
      setRoomPrices(store.settings.roomPrices);
    }
    const cleanAvailable = store.rooms
      .filter(r => !r.isOccupied && r.cleanliness !== 'out_of_order')
      .map(r => ({ roomNumber: r.roomNumber, title: `Room ${r.roomNumber} (${r.title})` }));
    setAvailableRooms(cleanAvailable);
    if (cleanAvailable.length > 0) {
      setAssignedRoom(cleanAvailable[0].roomNumber);
    }
  }, []);

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone || !checkIn || !checkOut) {
      alert('Please fill all required guest details and dates.');
      return;
    }
    const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));
    const baseRate = roomPrices[roomType]?.[occupancy] || 1800;
    const totalPrice = baseRate * nights;

    createRoomBooking({
      guestName,
      guestPhone,
      guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '')}@casaguest.in`,
      roomType,
      occupancy,
      checkIn,
      checkOut,
      nights,
      baseRate,
      totalPrice,
      roomNumber: assignedRoom || undefined,
      specialRequests
    });

    setSuccessMsg('Room booking created and synced successfully!');
    setTimeout(() => onClose(), 1200);
  };

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone || !pickupDate || !returnDate) {
      alert('Please fill all required vehicle rental fields.');
      return;
    }
    const days = Math.max(1, Math.ceil((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24)));
    const rates: Record<string, { name: string; rate: number; cat: '2-wheeler' | '4-wheeler'; img: string }> = {
      activa: { name: 'Honda Activa 6G', rate: 400, cat: '2-wheeler', img: '/activa.png' },
      dio: { name: 'Honda Dio 110', rate: 400, cat: '2-wheeler', img: '/WhatsApp_Image_2026-08-11_at_6.56.54_PM__2_-removebg-preview.png' },
      fascino: { name: 'Yamaha Fascino 125', rate: 400, cat: '2-wheeler', img: '/fasc.png' },
      swift: { name: 'Maruti Suzuki Swift VXi', rate: 1500, cat: '4-wheeler', img: '/WhatsApp Image 2026-08-11 at 6.56.54 PM.jpeg' },
      ertiga: { name: 'Maruti Suzuki Ertiga 7-Seater', rate: 2500, cat: '4-wheeler', img: '/WhatsApp Image 2026-08-11 at 6.56.53 PM (1).jpeg' }
    };
    const veh = rates[vehicleId] || rates['activa'];
    const totalPrice = veh.rate * days;

    createVehicleBooking({
      guestName,
      guestPhone,
      guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '')}@casaguest.in`,
      vehicleId,
      vehicleName: veh.name,
      vehicleCategory: veh.cat,
      vehicleImage: veh.img,
      pickupDate,
      returnDate,
      days,
      dailyRate: veh.rate,
      totalPrice,
      licenseNumber
    });

    setSuccessMsg('Vehicle rental registered successfully!');
    setTimeout(() => onClose(), 1200);
  };

  const handleDiningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone || !diningDate) {
      alert('Please fill all dining fields.');
      return;
    }
    createDiningBooking({
      guestName,
      guestPhone,
      guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '')}@casaguest.in`,
      date: diningDate,
      timeSlot: diningSlot,
      partySize,
      dietaryPreferences: dietary,
      tableNumber,
      specialRequests
    });

    setSuccessMsg('Table reservation confirmed and assigned!');
    setTimeout(() => onClose(), 1200);
  };

  const handleMaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintTitle || !maintDesc) {
      alert('Please enter issue title and description.');
      return;
    }
    createMaintenanceTicket({
      area: maintArea,
      roomNumber: maintArea === 'Room' ? maintRoom : undefined,
      issueTitle: maintTitle,
      description: maintDesc,
      priority: maintPriority,
      status: 'reported',
      reportedBy: 'Front Desk Walk-in',
      assignedTo: maintAssignee
    });

    setSuccessMsg('Maintenance ticket logged successfully!');
    setTimeout(() => onClose(), 1200);
  };

  return (
    <div className="crm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="crm-modal">
        {/* Header */}
        <div className="crm-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>Quick Front Desk Action</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)'
          }}
        >
          {[
            { key: 'room', label: 'Room Walk-In', icon: BedDouble },
            { key: 'vehicle', label: 'Vehicle Rental', icon: Car },
            { key: 'dining', label: 'Table Booking', icon: UtensilsCrossed },
            { key: 'maintenance', label: 'Maintenance', icon: Wrench }
          ].map(t => {
            const Icon = t.icon;
            const isCurrent = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key as any); setSuccessMsg(''); }}
                style={{
                  flex: 1,
                  padding: '12px 10px',
                  background: isCurrent ? 'var(--bg-secondary)' : 'transparent',
                  border: 'none',
                  borderBottom: isCurrent ? '2px solid var(--accent-emerald)' : 'none',
                  color: isCurrent ? 'var(--accent-emerald-dark)' : 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'var(--transition)'
                }}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="crm-modal-body">
          {successMsg && (
            <div
              style={{
                backgroundColor: '#DCFCE7',
                border: '1px solid #BBF7D0',
                color: '#15803D',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13.5px',
                fontWeight: 700
              }}
            >
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ROOM FORM */}
          {activeTab === 'room' && (
            <form onSubmit={handleRoomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="crm-input"
                  />
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98201 00000"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="crm-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Room Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as any)}
                    className="crm-select"
                  >
                    <option value="ac">Paradise AC Suite</option>
                    <option value="nonac">Heritage Non-AC Room</option>
                  </select>
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Occupancy</label>
                  <select
                    value={occupancy}
                    onChange={(e) => setOccupancy(e.target.value as any)}
                    className="crm-select"
                  >
                    <option value="single">Single Occupancy</option>
                    <option value="double">Double Occupancy</option>
                    <option value="triple">Triple Occupancy</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Check-In Date *</label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="crm-input"
                  />
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Check-Out Date *</label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="crm-input"
                  />
                </div>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Assign Room Number</label>
                <select
                  value={assignedRoom}
                  onChange={(e) => setAssignedRoom(e.target.value)}
                  className="crm-select"
                >
                  <option value="">Unassigned (Assign Later)</option>
                  {availableRooms.map(r => (
                    <option key={r.roomNumber} value={r.roomNumber}>{r.title}</option>
                  ))}
                </select>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Special Requests / Front Desk Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Extra pillows, early breakfast, wine glass setup"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="crm-input"
                />
              </div>

              <div className="crm-modal-footer" style={{ padding: '12px 0 0 0', background: 'none' }}>
                <button type="button" onClick={onClose} className="crm-btn crm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="crm-btn crm-btn-primary">
                  Confirm Room Reservation
                </button>
              </div>
            </form>
          )}

          {/* VEHICLE FORM */}
          {activeTab === 'vehicle' && (
            <form onSubmit={handleVehicleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Guest name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="crm-input"
                  />
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98201 00000"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="crm-input"
                  />
                </div>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Select Vehicle Model *</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="crm-select"
                >
                  <option value="activa">Honda Activa 6G (₹400/day)</option>
                  <option value="dio">Honda Dio 110 (₹400/day)</option>
                  <option value="fascino">Yamaha Fascino 125 (₹400/day)</option>
                  <option value="swift">Maruti Suzuki Swift VXi (₹1,500/day)</option>
                  <option value="ertiga">Maruti Suzuki Ertiga 7-Seater (₹2,500/day)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Pickup Date *</label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="crm-input"
                  />
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Return Date *</label>
                  <input
                    type="date"
                    required
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="crm-input"
                  />
                </div>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Driving License Number</label>
                <input
                  type="text"
                  placeholder="e.g. DL-04-2019-12345"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="crm-input"
                />
              </div>

              <div className="crm-modal-footer" style={{ padding: '12px 0 0 0', background: 'none' }}>
                <button type="button" onClick={onClose} className="crm-btn crm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="crm-btn crm-btn-primary">
                  Dispatch Vehicle Rental
                </button>
              </div>
            </form>
          )}

          {/* DINING FORM */}
          {activeTab === 'dining' && (
            <form onSubmit={handleDiningSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Guest name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="crm-input"
                  />
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98201 00000"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="crm-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Reservation Date *</label>
                  <input
                    type="date"
                    required
                    value={diningDate}
                    onChange={(e) => setDiningDate(e.target.value)}
                    className="crm-input"
                  />
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Party Size</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={partySize}
                    onChange={(e) => setPartySize(parseInt(e.target.value) || 2)}
                    className="crm-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Meal Slot</label>
                  <select
                    value={diningSlot}
                    onChange={(e) => setDiningSlot(e.target.value)}
                    className="crm-select"
                  >
                    <option value="Breakfast (7:30 AM - 10:30 AM)">Breakfast (7:30 AM - 10:30 AM)</option>
                    <option value="Lunch (12:30 PM - 3:30 PM)">Lunch (12:30 PM - 3:30 PM)</option>
                    <option value="High Tea (4:30 PM - 6:30 PM)">High Tea (4:30 PM - 6:30 PM)</option>
                    <option value="Dinner (7:30 PM - 11:00 PM)">Dinner (7:30 PM - 11:00 PM)</option>
                  </select>
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Table Number</label>
                  <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="crm-select"
                  >
                    <option value="T-1">Table T-1 (Main Hall · 4 Pax)</option>
                    <option value="T-2">Table T-2 (Main Hall · 4 Pax)</option>
                    <option value="T-5">Table T-5 (Garden Gazebo · 4 Pax)</option>
                    <option value="T-7">Table T-7 (Balcony Sunset · 2 Pax)</option>
                    <option value="T-8">Table T-8 (Balcony Altinho View · 4 Pax)</option>
                    <option value="T-9">Table T-9 (Private Lounge · 6 Pax)</option>
                  </select>
                </div>
              </div>

              <div className="crm-modal-footer" style={{ padding: '12px 0 0 0', background: 'none' }}>
                <button type="button" onClick={onClose} className="crm-btn crm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="crm-btn crm-btn-primary">
                  Reserve Dining Table
                </button>
              </div>
            </form>
          )}

          {/* MAINTENANCE FORM */}
          {activeTab === 'maintenance' && (
            <form onSubmit={handleMaintSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Area / Location</label>
                  <select
                    value={maintArea}
                    onChange={(e) => setMaintArea(e.target.value as any)}
                    className="crm-select"
                  >
                    <option value="Room">Guest Room</option>
                    <option value="Restaurant">Restaurant / Bar</option>
                    <option value="Lobby">Lobby & Altinho Hill Garden</option>
                    <option value="Vehicles">Vehicle Fleet</option>
                    <option value="General">General Property</option>
                  </select>
                </div>
                {maintArea === 'Room' && (
                  <div className="crm-form-group">
                    <label className="crm-label">Room Number</label>
                    <select
                      value={maintRoom}
                      onChange={(e) => setMaintRoom(e.target.value)}
                      className="crm-select"
                    >
                      {['101', '102', '103', '104', '105', '106', '107', '108', '201', '202', '203', '204', '205', '206', '207', '208', '209', '210'].map(r => (
                        <option key={r} value={r}>Room {r}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Issue Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC cooling gas leak, hot water geyser inspection"
                  value={maintTitle}
                  onChange={(e) => setMaintTitle(e.target.value)}
                  className="crm-input"
                />
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Detailed Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detailed notes for technician or vendor"
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  className="crm-textarea"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Priority</label>
                  <select
                    value={maintPriority}
                    onChange={(e) => setMaintPriority(e.target.value as any)}
                    className="crm-select"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High (Mark Room Alert)</option>
                    <option value="urgent">Urgent (Out of Order)</option>
                  </select>
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Assigned Technician / Staff</label>
                  <input
                    type="text"
                    value={maintAssignee}
                    onChange={(e) => setMaintAssignee(e.target.value)}
                    className="crm-input"
                  />
                </div>
              </div>

              <div className="crm-modal-footer" style={{ padding: '12px 0 0 0', background: 'none' }}>
                <button type="button" onClick={onClose} className="crm-btn crm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="crm-btn crm-btn-primary">
                  Create Maintenance Work Order
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
