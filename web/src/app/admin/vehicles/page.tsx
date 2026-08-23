'use client';

import React, { useState, useEffect } from 'react';
import {
  Car,
  Search,
  Plus,
  X,
  Edit,
  Trash2,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  KeyRound
} from 'lucide-react';
import { getCRMStore, subscribeToCRM, updateVehicleBooking, createVehicleBooking, deleteBooking } from '@/lib/crmStore';
import { VehicleBooking, VehicleBookingStatus, PaymentStatus } from '@/lib/types';

export default function VehiclesAdminPage() {
  const [bookings, setBookings] = useState<VehicleBooking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Edit Modal
  const [selectedBooking, setSelectedBooking] = useState<VehicleBooking | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<VehicleBookingStatus>('pending');
  const [editPayment, setEditPayment] = useState<PaymentStatus>('unpaid');
  const [editLicense, setEditLicense] = useState('');
  const [editDeposit, setEditDeposit] = useState<number>(0);
  const [editHelmets, setEditHelmets] = useState<number>(2);
  const [editNotes, setEditNotes] = useState('');

  // New Rental Modal
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newVehicleId, setNewVehicleId] = useState('activa');
  const [newPickup, setNewPickup] = useState(new Date().toISOString().split('T')[0]);
  const [newReturn, setNewReturn] = useState('');
  const [newDelivery, setNewDelivery] = useState(true);

  useEffect(() => {
    const refresh = () => {
      const store = getCRMStore();
      setBookings(store.vehicleBookings);
    };
    refresh();
    const unsubscribe = subscribeToCRM(refresh);
    return () => unsubscribe();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || b.vehicleCategory === filterCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.id.toLowerCase().includes(q) ||
      b.guestName.toLowerCase().includes(q) ||
      b.vehicleName.toLowerCase().includes(q) ||
      b.guestPhone.includes(q);
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleOpenEdit = (b: VehicleBooking) => {
    setSelectedBooking(b);
    setEditStatus(b.status);
    setEditPayment(b.paymentStatus);
    setEditLicense(b.licenseNumber || '');
    setEditDeposit(b.depositAmount || 0);
    setEditHelmets(b.helmetCount || 2);
    setEditNotes(b.staffNotes || '');
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    updateVehicleBooking(selectedBooking.id, {
      status: editStatus,
      paymentStatus: editPayment,
      licenseNumber: editLicense,
      depositAmount: editDeposit,
      helmetCount: editHelmets,
      staffNotes: editNotes
    });
    setIsEditOpen(false);
  };

  const handleQuickHandover = (id: string) => {
    updateVehicleBooking(id, { status: 'handed_over', paymentStatus: 'paid' });
  };

  const handleQuickReturn = (id: string) => {
    updateVehicleBooking(id, { status: 'returned' });
  };

  const handleDelete = (id: string) => {
    if (confirm(`Delete rental booking ${id}?`)) {
      deleteBooking('vehicle', id);
      setIsEditOpen(false);
    }
  };

  const handleCreateRental = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newPickup || !newReturn) {
      alert('Please fill in required fields.');
      return;
    }

    const pD = new Date(newPickup);
    const rD = new Date(newReturn);
    const diff = Math.abs(rD.getTime() - pD.getTime());
    const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));

    const vehicleMap: Record<string, { name: string; category: '2-wheeler' | '4-wheeler'; image: string; price: number }> = {
      activa: { name: 'Honda Activa', category: '2-wheeler', image: '/activa.png', price: 400 },
      dio: { name: 'Honda Dio', category: '2-wheeler', image: '/WhatsApp_Image_2026-08-11_at_6.56.54_PM__2_-removebg-preview.png', price: 400 },
      fascino: { name: 'Yamaha Fascino', category: '2-wheeler', image: '/fasc.png', price: 400 },
      swift: { name: 'Maruti Suzuki Swift', category: '4-wheeler', image: '/WhatsApp Image 2026-08-11 at 6.56.54 PM.jpeg', price: 1500 },
      ertiga: { name: 'Maruti Suzuki Ertiga', category: '4-wheeler', image: '/WhatsApp Image 2026-08-11 at 6.56.53 PM (1).jpeg', price: 2500 }
    };

    const v = vehicleMap[newVehicleId] || vehicleMap.activa;
    const total = v.price * days;

    createVehicleBooking({
      guestName: newName,
      guestPhone: newPhone,
      guestEmail: newEmail,
      vehicleId: newVehicleId,
      vehicleName: v.name,
      vehicleCategory: v.category,
      vehicleImage: v.image,
      pickupDate: newPickup,
      returnDate: newReturn,
      days,
      dailyRate: v.price,
      totalPrice: total,
      hotelDelivery: newDelivery
    });

    setIsNewOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewReturn('');
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#FFF', fontWeight: 700 }}>
            Scooter & Car Rentals Desk
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
            Track vehicle handovers, security deposits, helmet inventory, and rental returns.
          </p>
        </div>

        <button
          onClick={() => setIsNewOpen(true)}
          className="crm-action-btn crm-action-btn--primary"
          style={{ padding: '10px 18px', fontSize: '14px' }}
        >
          <Plus size={16} /> New Vehicle Rental
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="crm-panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {/* Status Filter Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Status' },
              { id: 'pending', label: 'Pending' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'handed_over', label: 'On Road / Handed Over' },
              { id: 'returned', label: 'Returned' },
              { id: 'cancelled', label: 'Cancelled' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setFilterStatus(st.id)}
                className={`crm-filter-btn ${filterStatus === st.id ? 'active' : ''}`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search vehicle, guest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="crm-search-input"
              style={{ paddingLeft: '34px' }}
            />
            <Search size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="crm-panel">
        <div className="crm-table-container">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Vehicle Model</th>
                <th>Guest Details</th>
                <th>Rental Schedule</th>
                <th>Amount & Deposit</th>
                <th>Status</th>
                <th>Delivery Mode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#94A3B8' }}>
                    No vehicle bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong style={{ color: '#FACC15', fontFamily: 'monospace', fontSize: '13px' }}>
                        {b.id}
                      </strong>
                      <span style={{ display: 'block', fontSize: '10px', color: '#64748B' }}>
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img src={b.vehicleImage} alt={b.vehicleName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <strong style={{ color: '#F8FAFC', display: 'block' }}>{b.vehicleName}</strong>
                          <span style={{ fontSize: '11px', color: '#94A3B8' }}>{b.vehicleCategory}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: '#F8FAFC', display: 'block' }}>{b.guestName}</strong>
                      <span style={{ fontSize: '12px', color: '#94A3B8' }}>{b.guestPhone}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
                        {b.pickupDate} → {b.returnDate}
                      </span>
                      <span style={{ display: 'block', fontSize: '11px', color: '#64748B' }}>
                        {b.days} Day{b.days > 1 ? 's' : ''} (₹{b.dailyRate}/day)
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#34D399', fontSize: '14px' }}>
                        ₹{b.totalPrice.toLocaleString('en-IN')}
                      </strong>
                      {b.depositAmount ? (
                        <span style={{ display: 'block', fontSize: '10px', color: '#FACC15' }}>
                          Deposit: ₹{b.depositAmount}
                        </span>
                      ) : null}
                    </td>
                    <td>
                      <span className={`crm-badge crm-badge--${b.status}`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: b.hotelDelivery ? '#34D399' : '#94A3B8' }}>
                        {b.hotelDelivery ? 'Hotel Portico Drop' : 'Self Pickup'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {b.status === 'confirmed' || b.status === 'pending' ? (
                          <button
                            onClick={() => handleQuickHandover(b.id)}
                            className="crm-action-btn crm-action-btn--primary"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                            title="Hand over vehicle"
                          >
                            Hand Over
                          </button>
                        ) : b.status === 'handed_over' ? (
                          <button
                            onClick={() => handleQuickReturn(b.id)}
                            className="crm-action-btn"
                            style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#38BDF8', color: '#0F172A', fontWeight: 700 }}
                            title="Mark vehicle returned"
                          >
                            Returned
                          </button>
                        ) : null}

                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="crm-action-btn"
                          title="Edit Details"
                        >
                          <Edit size={14} />
                        </button>
                        <a
                          href={`https://wa.me/${b.guestPhone.replace(/[^0-9]/g, '')}`}
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

      {/* Edit Vehicle Booking Modal */}
      {isEditOpen && selectedBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsEditOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              color: '#FFF',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsEditOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#FFF' }}>
              Rental: {selectedBooking.id}
            </h2>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#94A3B8' }}>
              {selectedBooking.guestName} • {selectedBooking.vehicleName}
            </p>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Rental Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as VehicleBookingStatus)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="handed_over">Handed Over (On Road)</option>
                    <option value="returned">Returned & Inspected</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Payment Status
                  </label>
                  <select
                    value={editPayment}
                    onChange={(e) => setEditPayment(e.target.value as PaymentStatus)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="advance_paid">Advance Paid</option>
                    <option value="paid">Fully Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Driving License No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DL-04201100234"
                    value={editLicense}
                    onChange={(e) => setEditLicense(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={editDeposit}
                    onChange={(e) => setEditDeposit(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                  Staff Inspection & Handover Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Odometer 14,200 km. Fuel half tank. Helmets provided."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleDelete(selectedBooking.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: '#EF4444', fontSize: '12px', cursor: 'pointer' }}
                >
                  <Trash2 size={14} /> Delete Rental
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setIsEditOpen(false)} className="crm-action-btn">
                    Cancel
                  </button>
                  <button type="submit" className="crm-action-btn crm-action-btn--primary" style={{ padding: '8px 18px' }}>
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Vehicle Modal */}
      {isNewOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsNewOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              color: '#FFF',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsNewOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#FFF' }}>
              Create New Vehicle Rental
            </h2>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#94A3B8' }}>
              Directly assign a scooter or car rental to a guest.
            </p>

            <form onSubmit={handleCreateRental} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Guest Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                  Select Vehicle *
                </label>
                <select
                  value={newVehicleId}
                  onChange={(e) => setNewVehicleId(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                >
                  <option value="activa">Honda Activa (2-Wheeler • ₹400/day)</option>
                  <option value="dio">Honda Dio (2-Wheeler • ₹400/day)</option>
                  <option value="fascino">Yamaha Fascino (2-Wheeler • ₹400/day)</option>
                  <option value="swift">Maruti Suzuki Swift (5-Seater Car • ₹1,500/day)</option>
                  <option value="ertiga">Maruti Suzuki Ertiga (7-Seater MPV • ₹2,500/day)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newPickup}
                    onChange={(e) => setNewPickup(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
                    Return Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newReturn}
                    onChange={(e) => setNewReturn(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', backgroundColor: '#0F172A', color: '#FFF', border: '1px solid #334155', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsNewOpen(false)} className="crm-action-btn">
                  Cancel
                </button>
                <button type="submit" className="crm-action-btn crm-action-btn--primary" style={{ padding: '8px 18px' }}>
                  Create Rental Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
