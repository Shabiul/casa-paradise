'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  BedDouble,
  Car,
  Download,
  RotateCcw,
  Save,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Percent
} from 'lucide-react';
import { getCRMStore, updateHotelSettings, resetCRMData } from '@/lib/crmStore';
import { HotelSettings } from '@/lib/types';

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<HotelSettings | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  // Room Prices
  const [acSingle, setAcSingle] = useState(1200);
  const [acDouble, setAcDouble] = useState(1800);
  const [acTriple, setAcTriple] = useState(2000);

  const [nonacSingle, setNonacSingle] = useState(1200);
  const [nonacDouble, setNonacDouble] = useState(1500);
  const [nonacTriple, setNonacTriple] = useState(800);

  // Vehicle Prices
  const [activaPrice, setActivaPrice] = useState(400);
  const [dioPrice, setDioPrice] = useState(400);
  const [fascinoPrice, setFascinoPrice] = useState(400);
  const [swiftPrice, setSwiftPrice] = useState(1500);
  const [ertigaPrice, setErtigaPrice] = useState(2500);

  // Hotel Info
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const store = getCRMStore();
    if (store.settings) {
      setSettings(store.settings);
      setAcSingle(store.settings.roomPrices.ac.single);
      setAcDouble(store.settings.roomPrices.ac.double);
      setAcTriple(store.settings.roomPrices.ac.triple);

      setNonacSingle(store.settings.roomPrices.nonac.single);
      setNonacDouble(store.settings.roomPrices.nonac.double);
      setNonacTriple(store.settings.roomPrices.nonac.triple);

      setActivaPrice(store.settings.vehiclePrices.activa);
      setDioPrice(store.settings.vehiclePrices.dio);
      setFascinoPrice(store.settings.vehiclePrices.fascino);
      setSwiftPrice(store.settings.vehiclePrices.swift);
      setErtigaPrice(store.settings.vehiclePrices.ertiga);

      setPhone1(store.settings.phone1);
      setPhone2(store.settings.phone2);
      setEmail(store.settings.email);
      setAddress(store.settings.address);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHotelSettings({
      phone1,
      phone2,
      email,
      address,
      roomPrices: {
        ac: { single: Number(acSingle), double: Number(acDouble), triple: Number(acTriple) },
        nonac: { single: Number(nonacSingle), double: Number(nonacDouble), triple: Number(nonacTriple) }
      },
      vehiclePrices: {
        activa: Number(activaPrice),
        dio: Number(dioPrice),
        fascino: Number(fascinoPrice),
        swift: Number(swiftPrice),
        ertiga: Number(ertigaPrice)
      }
    });

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleExportJSON = () => {
    const store = getCRMStore();
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CasaParadiso_CRM_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportRoomsCSV = () => {
    const store = getCRMStore();
    const headers = ['BookingID', 'GuestName', 'Phone', 'Email', 'RoomType', 'Occupancy', 'CheckIn', 'CheckOut', 'Nights', 'TotalRate', 'Status', 'Payment'];
    const rows = store.roomBookings.map(b => [
      b.id,
      `"${b.guestName}"`,
      `"${b.guestPhone}"`,
      b.guestEmail,
      `"${b.roomTitle}"`,
      b.occupancy,
      b.checkIn,
      b.checkOut,
      b.nights,
      b.totalPrice,
      b.status,
      b.paymentStatus
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CasaParadiso_RoomBookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to restore default sample bookings and prices?')) {
      resetCRMData();
      alert('Default data restored.');
      window.location.reload();
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#FFF', fontWeight: 700 }}>
            Pricing & Hotel Configuration
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
            Live rate configurations update the public website and booking calculators immediately.
          </p>
        </div>

        {successMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '8px 16px', borderRadius: '8px' }}>
            <CheckCircle2 size={16} /> Changes Saved Live!
          </div>
        )}
      </div>

      <form onSubmit={handleSave}>
        {/* Room Pricing Configuration */}
        <div className="crm-panel">
          <div className="crm-panel-header">
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', color: '#FFF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BedDouble size={18} color="#38BDF8" /> Suite & Room Nightly Rates (₹ / Night)
              </h2>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Set base prices for single, double, and triple occupancy</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* AC Suite */}
            <div style={{ backgroundColor: '#0F172A', padding: '18px', borderRadius: '12px', border: '1px solid #334155' }}>
              <strong style={{ color: '#38BDF8', fontSize: '15px', display: 'block', marginBottom: '14px' }}>
                Paradise AC Suite
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Single Occupancy</label>
                  <input type="number" value={acSingle} onChange={(e) => setAcSingle(Number(e.target.value))} className="crm-search-input" style={{ width: '100%' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Double Occupancy</label>
                  <input type="number" value={acDouble} onChange={(e) => setAcDouble(Number(e.target.value))} className="crm-search-input" style={{ width: '100%' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Triple Occupancy</label>
                  <input type="number" value={acTriple} onChange={(e) => setAcTriple(Number(e.target.value))} className="crm-search-input" style={{ width: '100%' }} required />
                </div>
              </div>
            </div>

            {/* Non-AC Room */}
            <div style={{ backgroundColor: '#0F172A', padding: '18px', borderRadius: '12px', border: '1px solid #334155' }}>
              <strong style={{ color: '#FACC15', fontSize: '15px', display: 'block', marginBottom: '14px' }}>
                Heritage Non-AC Room
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Single Occupancy</label>
                  <input type="number" value={nonacSingle} onChange={(e) => setNonacSingle(Number(e.target.value))} className="crm-search-input" style={{ width: '100%' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Double Occupancy</label>
                  <input type="number" value={nonacDouble} onChange={(e) => setNonacDouble(Number(e.target.value))} className="crm-search-input" style={{ width: '100%' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Triple Occupancy</label>
                  <input type="number" value={nonacTriple} onChange={(e) => setNonacTriple(Number(e.target.value))} className="crm-search-input" style={{ width: '100%' }} required />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Rentals Pricing */}
        <div className="crm-panel">
          <div className="crm-panel-header">
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', color: '#FFF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Car size={18} color="#FACC15" /> Vehicle Daily Rental Rates (₹ / Day)
              </h2>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Set daily rate per vehicle model</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#0F172A', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Honda Activa</label>
              <input type="number" value={activaPrice} onChange={(e) => setActivaPrice(Number(e.target.value))} className="crm-search-input" style={{ width: '100%' }} required />
            </div>

            <div style={{ backgroundColor: '#0F172A', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Honda Dio</label>
              <input type="number" value={dioPrice} onChange={(e) => setDioPrice(Number(e.target.value))} className="crm-search-input" style={{ width: '100%' }} required />
            </div>

            <div style={{ backgroundColor: '#0F172A', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Yamaha Fascino</label>
              <input type="number" value={fascinoPrice} onChange={(e) => setFascinoPrice(Number(e.target.value))} className="crm-search-input" style={{ width: '100%' }} required />
            </div>

            <div style={{ backgroundColor: '#0F172A', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Maruti Swift Car</label>
              <input type="number" value={swiftPrice} onChange={(e) => setSwiftPrice(Number(e.target.value))} className="crm-search-input" style={{ width: '100%' }} required />
            </div>

            <div style={{ backgroundColor: '#0F172A', padding: '14px', borderRadius: '10px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Maruti Ertiga 7-Seater</label>
              <input type="number" value={ertigaPrice} onChange={(e) => setErtigaPrice(Number(e.target.value))} className="crm-search-input" style={{ width: '100%' }} required />
            </div>
          </div>
        </div>

        {/* Hotel Details */}
        <div className="crm-panel">
          <div className="crm-panel-header">
            <div>
              <h2 style={{ margin: 0, fontSize: '17px', color: '#FFF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="#34D399" /> Hotel Public Contact Details
              </h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Primary Phone</label>
              <input type="text" value={phone1} onChange={(e) => setPhone1(e.target.value)} className="crm-search-input" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Direct Desk Phone</label>
              <input type="text" value={phone2} onChange={(e) => setPhone2(e.target.value)} className="crm-search-input" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="crm-search-input" style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="crm-search-input" style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="submit"
              className="crm-action-btn crm-action-btn--primary"
              style={{ padding: '12px 28px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={16} /> Save Settings Live
            </button>
          </div>
        </div>
      </form>

      {/* Data Export & Backup Tools */}
      <div className="crm-panel">
        <div className="crm-panel-header">
          <div>
            <h2 style={{ margin: 0, fontSize: '17px', color: '#FFF', fontWeight: 600 }}>
              Data Export & Maintenance
            </h2>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Download backup files or reset to initial demo state</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportJSON}
            className="crm-action-btn"
            style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} /> Export Full Database (JSON)
          </button>

          <button
            type="button"
            onClick={handleExportRoomsCSV}
            className="crm-action-btn"
            style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} /> Export Room Bookings (CSV)
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="crm-action-btn"
            style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            <RotateCcw size={16} /> Restore Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}
