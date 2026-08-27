'use client';

import React, { useState, useEffect } from 'react';
import {
  Car,
  Search,
  Plus,
  X,
  Edit,
  Trash2,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  KeyRound,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import {
  getCRMStore,
  subscribeToCRM,
  updateVehicleBooking,
  createVehicleBooking,
  deleteBooking,
  hasPermission
} from '@/lib/crmStore';
import { VehicleBooking, VehicleBookingStatus, PaymentStatus, CRMStoreData } from '@/lib/types';
import QuickBookingModal from '@/components/QuickBookingModal';
import AccessRestricted from '@/components/AccessRestricted';

export default function VehiclesAdminPage() {
  const [store, setStore] = useState<CRMStoreData>(getCRMStore());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allowed, setAllowed] = useState<boolean>(true);

  // Edit / Handover / Return Modal
  const [selectedBooking, setSelectedBooking] = useState<VehicleBooking | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<VehicleBookingStatus>('pending');
  const [editPayment, setEditPayment] = useState<PaymentStatus>('unpaid');
  const [editLicense, setEditLicense] = useState('');
  const [editDeposit, setEditDeposit] = useState<number>(1000);
  const [editHelmets, setEditHelmets] = useState<number>(2);
  const [editNotes, setEditNotes] = useState('');

  const [isQuickOpen, setIsQuickOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setAllowed(hasPermission('vehicles'));
      setStore(getCRMStore());
    };
    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  if (!allowed) {
    return (
      <AccessRestricted
        moduleName="Fleet & Rental Management"
        requiredPermission="vehicles (Car & Bike Rental Access)"
        description="Managing scooter and car rentals, customer vehicle dispatch, handover contracts, and security deposits requires Vehicle Management clearance."
      />
    );
  }

  const filteredBookings = store.vehicleBookings.filter(b => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || b.vehicleCategory === filterCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.id.toLowerCase().includes(q) ||
      b.guestName.toLowerCase().includes(q) ||
      b.guestPhone.includes(q) ||
      b.vehicleName.toLowerCase().includes(q) ||
      (b.licenseNumber && b.licenseNumber.toLowerCase().includes(q));
    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleOpenEdit = (b: VehicleBooking) => {
    setSelectedBooking(b);
    setEditStatus(b.status);
    setEditPayment(b.paymentStatus);
    setEditLicense(b.licenseNumber || '');
    setEditDeposit(b.depositAmount || (b.vehicleCategory === '2-wheeler' ? 1000 : 3000));
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

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete vehicle rental ${id} for ${name}?`)) {
      deleteBooking('vehicle', id);
    }
  };

  const handleQuickHandover = (b: VehicleBooking) => {
    updateVehicleBooking(b.id, {
      status: 'handed_over',
      paymentStatus: 'paid'
    });
  };

  const handleQuickReturn = (b: VehicleBooking) => {
    updateVehicleBooking(b.id, {
      status: 'returned'
    });
  };

  const handleWhatsApp = (b: VehicleBooking) => {
    const text = encodeURIComponent(
      `Hello ${b.guestName}, your vehicle rental for ${b.vehicleName} (${b.days} Days) is confirmed at Casa Paradiso Panaji.\nPickup Date: ${b.pickupDate} | Return: ${b.returnDate}\nSecurity Deposit: ₹${b.depositAmount || 1000} (Refundable on return)\nHelmets: ${b.helmetCount || 2} Included.\nHappy Riding across Goa!`
    );
    const cleanPhone = b.guestPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Car size={22} color="#0284C7" />
            <span>Vehicle Fleet & Rental Operations</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Track self-drive scooters & cars, handovers, driver licenses, helmet inventories and security deposits.
          </p>
        </div>

        <button onClick={() => setIsQuickOpen(true)} className="crm-btn crm-btn-primary" style={{ padding: '8px 16px' }}>
          <Plus size={16} />
          <span>New Vehicle Rental</span>
        </button>
      </div>

      {/* Fleet Inventory Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        {store.vehicles.map(veh => (
          <div
            key={veh.id}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                {veh.category}
              </span>
              <span
                style={{
                  backgroundColor: veh.status === 'available' ? '#DCFCE7' : '#FEF3C7',
                  color: veh.status === 'available' ? '#15803D' : '#92400E',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}
              >
                {veh.status}
              </span>
            </div>

            <div style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--text-primary)' }}>
              {veh.name}
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Reg: {veh.registrationNumber}</span>
              <span style={{ color: '#0284C7', fontWeight: 700 }}>₹{veh.dailyRate}/day</span>
            </div>
          </div>
        ))}
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
            { key: 'all', label: 'All Rentals' },
            { key: 'pending', label: 'Pending' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'handed_over', label: 'On Road / Handed Over' },
            { key: 'returned', label: 'Returned' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: filterStatus === tab.key ? 'var(--accent-cyan)' : 'var(--bg-elevated)',
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

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search renter, phone, car..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="crm-input"
            style={{ paddingLeft: '34px', width: '100%', fontSize: '12.5px' }}
          />
        </div>
      </div>

      {/* Rentals Table */}
      <div className="crm-table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>ID / Guest</th>
              <th>Vehicle Model</th>
              <th>Rental Period</th>
              <th>Deposit & Helmets</th>
              <th>Total (₹)</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                  No vehicle rentals match the selected filter.
                </td>
              </tr>
            ) : (
              filteredBookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.guestName}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{b.id} · {b.guestPhone}</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600 }}>{b.vehicleName}</div>
                    <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: 600 }}>
                      {b.vehicleCategory} {b.hotelDelivery ? '· Doorstep Delivery' : ''}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>
                      {b.pickupDate} → {b.returnDate}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {b.days} Day{b.days > 1 ? 's' : ''} (@ ₹{b.dailyRate}/day)
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: 600 }}>
                      Deposit: ₹{b.depositAmount || 1000}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {b.helmetCount || 2} Helmets · {b.licenseNumber ? `DL: ${b.licenseNumber}` : 'DL Pending'}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{b.totalPrice.toLocaleString('en-IN')}
                    </div>
                    <span style={{ fontSize: '11px', color: b.paymentStatus === 'paid' ? '#059669' : '#E11D48', fontWeight: 700 }}>
                      {b.paymentStatus.toUpperCase()}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`crm-badge ${
                        b.status === 'handed_over'
                          ? 'crm-badge-active'
                          : b.status === 'confirmed'
                          ? 'crm-badge-confirmed'
                          : b.status === 'returned'
                          ? 'crm-badge-confirmed'
                          : 'crm-badge-pending'
                      }`}
                    >
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleQuickHandover(b)}
                          className="crm-btn crm-btn-primary"
                          style={{ padding: '5px 9px', fontSize: '11.5px' }}
                          title="Key Handover & Dispatch"
                        >
                          <KeyRound size={13} />
                          <span>Handover</span>
                        </button>
                      )}

                      {b.status === 'handed_over' && (
                        <button
                          onClick={() => handleQuickReturn(b)}
                          className="crm-btn crm-btn-secondary"
                          style={{ padding: '5px 9px', fontSize: '11.5px', color: '#0284C7' }}
                          title="Return Vehicle & Settle Deposit"
                        >
                          <RotateCcw size={13} />
                          <span>Return</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleWhatsApp(b)}
                        className="crm-btn"
                        style={{ padding: '5px 8px', backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0' }}
                        title="Send WhatsApp Voucher"
                      >
                        <MessageSquare size={14} />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="crm-btn crm-btn-secondary"
                        style={{ padding: '5px 8px' }}
                        title="Edit Rental"
                      >
                        <Edit size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(b.id, b.guestName)}
                        className="crm-btn crm-btn-danger"
                        style={{ padding: '5px 8px' }}
                        title="Delete Rental"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditOpen && selectedBooking && (
        <div className="crm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setIsEditOpen(false)}>
          <div className="crm-modal" style={{ maxWidth: '540px' }}>
            <div className="crm-modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Vehicle Rental #{selectedBooking.id}
              </h3>
              <button onClick={() => setIsEditOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="crm-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Rental Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="crm-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="handed_over">Handed Over (Active)</option>
                    <option value="returned">Returned & Inspected</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="crm-form-group">
                  <label className="crm-label">Payment Status</label>
                  <select
                    value={editPayment}
                    onChange={(e) => setEditPayment(e.target.value as any)}
                    className="crm-select"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Fully Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Driver License Number</label>
                  <input
                    type="text"
                    value={editLicense}
                    onChange={(e) => setEditLicense(e.target.value)}
                    placeholder="e.g. DL-04-2018-99128"
                    className="crm-input"
                  />
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={editDeposit}
                    onChange={(e) => setEditDeposit(Number(e.target.value))}
                    className="crm-input"
                  />
                </div>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Staff Handover Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="crm-textarea"
                  placeholder="e.g. Scratches verified, full tank confirmed, deposit collected in cash"
                />
              </div>

              <div className="crm-modal-footer" style={{ padding: '12px 0 0 0', background: 'none' }}>
                <button type="button" onClick={() => setIsEditOpen(false)} className="crm-btn crm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="crm-btn crm-btn-primary">
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isQuickOpen && (
        <QuickBookingModal
          initialTab="vehicle"
          onClose={() => setIsQuickOpen(false)}
        />
      )}
    </div>
  );
}
