'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  BedDouble,
  Car,
  Download,
  Upload,
  RotateCcw,
  Save,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Percent,
  MessageSquare
} from 'lucide-react';
import {
  getCRMStore,
  updateHotelSettings,
  resetCRMData,
  exportCRMDataAsJSON,
  importCRMDataFromJSON
} from '@/lib/crmStore';
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
  const [hotelName, setHotelName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [taxRate, setTaxRate] = useState(12);
  const [whatsappTemplate, setWhatsappTemplate] = useState('');

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

      setHotelName(store.settings.hotelName);
      setTagline(store.settings.tagline);
      setPhone1(store.settings.phone1);
      setPhone2(store.settings.phone2);
      setEmail(store.settings.email);
      setAddress(store.settings.address);
      setGstin(store.settings.gstin || '30AAAAA0000A1Z5');
      setTaxRate(store.settings.taxRatePercent || 12);
      setWhatsappTemplate(store.settings.whatsappMessageTemplate || '');
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    updateHotelSettings({
      hotelName,
      tagline,
      phone1,
      phone2,
      email,
      address,
      gstin,
      taxRatePercent: taxRate,
      whatsappMessageTemplate: whatsappTemplate,
      roomPrices: {
        ac: { single: acSingle, double: acDouble, triple: acTriple },
        nonac: { single: nonacSingle, double: nonacDouble, triple: nonacTriple }
      },
      vehiclePrices: {
        activa: activaPrice,
        dio: dioPrice,
        fascino: fascinoPrice,
        swift: swiftPrice,
        ertiga: ertigaPrice
      }
    });

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all CRM demo data to initial factory state?')) {
      resetCRMData();
      alert('Data reset successfully! Refreshing...');
      window.location.reload();
    }
  };

  const handleExportJSON = () => {
    const data = exportCRMDataAsJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `casa_paradiso_full_crm_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importCRMDataFromJSON(content);
      if (success) {
        alert('Database imported successfully!');
        window.location.reload();
      } else {
        alert('Failed to import database. Invalid JSON format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={22} color="#059669" />
            <span>Rate Master & Property Configuration</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Live rate modifications instantly sync with the public booking engine on the guest website.
          </p>
        </div>

        {successMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 700, fontSize: '13.5px' }}>
            <CheckCircle2 size={18} />
            <span>Rates & Settings Saved Globally!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* ROOM RATE MASTER */}
        <div className="crm-card">
          <div className="crm-card-header">
            <div className="crm-card-title">
              <BedDouble size={18} color="#059669" />
              <span>Room Pricing & Rate Master (₹ / Night)</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Dynamic real-time rate card</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* AC SUITE */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '18px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontWeight: 800, color: '#059669', fontSize: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                Paradise AC Suites
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Single</label>
                  <input
                    type="number"
                    value={acSingle}
                    onChange={(e) => setAcSingle(Number(e.target.value))}
                    className="crm-input"
                  />
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Double</label>
                  <input
                    type="number"
                    value={acDouble}
                    onChange={(e) => setAcDouble(Number(e.target.value))}
                    className="crm-input"
                  />
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Triple</label>
                  <input
                    type="number"
                    value={acTriple}
                    onChange={(e) => setAcTriple(Number(e.target.value))}
                    className="crm-input"
                  />
                </div>
              </div>
            </div>

            {/* NON-AC ROOM */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '18px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontWeight: 800, color: '#0284C7', fontSize: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                Heritage Non-AC Rooms
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Single</label>
                  <input
                    type="number"
                    value={nonacSingle}
                    onChange={(e) => setNonacSingle(Number(e.target.value))}
                    className="crm-input"
                  />
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Double</label>
                  <input
                    type="number"
                    value={nonacDouble}
                    onChange={(e) => setNonacDouble(Number(e.target.value))}
                    className="crm-input"
                  />
                </div>
                <div className="crm-form-group">
                  <label className="crm-label">Triple</label>
                  <input
                    type="number"
                    value={nonacTriple}
                    onChange={(e) => setNonacTriple(Number(e.target.value))}
                    className="crm-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VEHICLE FLEET RATE MASTER */}
        <div className="crm-card">
          <div className="crm-card-header">
            <div className="crm-card-title">
              <Car size={18} color="#0284C7" />
              <span>Vehicle Fleet Rental Rates (₹ / Day)</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div className="crm-form-group">
              <label className="crm-label">Honda Activa 6G</label>
              <input
                type="number"
                value={activaPrice}
                onChange={(e) => setActivaPrice(Number(e.target.value))}
                className="crm-input"
              />
            </div>
            <div className="crm-form-group">
              <label className="crm-label">Honda Dio 110</label>
              <input
                type="number"
                value={dioPrice}
                onChange={(e) => setDioPrice(Number(e.target.value))}
                className="crm-input"
              />
            </div>
            <div className="crm-form-group">
              <label className="crm-label">Yamaha Fascino 125</label>
              <input
                type="number"
                value={fascinoPrice}
                onChange={(e) => setFascinoPrice(Number(e.target.value))}
                className="crm-input"
              />
            </div>
            <div className="crm-form-group">
              <label className="crm-label">Maruti Swift VXi</label>
              <input
                type="number"
                value={swiftPrice}
                onChange={(e) => setSwiftPrice(Number(e.target.value))}
                className="crm-input"
              />
            </div>
            <div className="crm-form-group">
              <label className="crm-label">Maruti Ertiga 7-Str</label>
              <input
                type="number"
                value={ertigaPrice}
                onChange={(e) => setErtigaPrice(Number(e.target.value))}
                className="crm-input"
              />
            </div>
          </div>
        </div>

        {/* HOTEL PROFILE & GST */}
        <div className="crm-card">
          <div className="crm-card-header">
            <div className="crm-card-title">
              <Building2 size={18} color="#D97706" />
              <span>Hotel Identity & Invoicing Profile</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div className="crm-form-group">
              <label className="crm-label">Property Name</label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="crm-input"
              />
            </div>

            <div className="crm-form-group">
              <label className="crm-label">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="crm-input"
              />
            </div>

            <div className="crm-form-group">
              <label className="crm-label">Reception Phone 1</label>
              <input
                type="text"
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                className="crm-input"
              />
            </div>

            <div className="crm-form-group">
              <label className="crm-label">Management Phone 2</label>
              <input
                type="text"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                className="crm-input"
              />
            </div>

            <div className="crm-form-group">
              <label className="crm-label">Front Desk Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="crm-input"
              />
            </div>

            <div className="crm-form-group">
              <label className="crm-label">GSTIN Identification Number</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="crm-input"
              />
            </div>
          </div>

          <div className="crm-form-group" style={{ marginTop: '12px' }}>
            <label className="crm-label">Full Postal Address (Appears on Tax Invoices)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="crm-input"
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="submit" className="crm-btn crm-btn-primary" style={{ padding: '10px 24px', fontSize: '14px' }}>
            <Save size={16} />
            <span>Save All Configuration & Rates</span>
          </button>
        </div>
      </form>

      {/* DATABASE & BACKUP UTILITIES */}
      <div className="crm-card" style={{ borderColor: '#FECACA' }}>
        <div className="crm-card-header">
          <div className="crm-card-title">
            <RotateCcw size={18} color="#E11D48" />
            <span>Database Backup, Import & Factory Reset</span>
          </div>
        </div>

        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
          Export the entire CRM operational database into a single JSON file for offline backups or restore demo data.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={handleExportJSON} className="crm-btn crm-btn-secondary">
            <Download size={15} />
            <span>Export Database JSON</span>
          </button>

          <label className="crm-btn crm-btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={15} />
            <span>Import Database JSON</span>
            <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
          </label>

          <button onClick={handleResetData} className="crm-btn crm-btn-danger">
            <RotateCcw size={15} />
            <span>Reset Demo Data to Initial State</span>
          </button>
        </div>
      </div>
    </div>
  );
}
