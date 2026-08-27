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
  MessageSquare,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Users,
  KeyRound,
  Trash2,
  Edit2,
  Lock,
  Sparkles,
  UtensilsCrossed,
  Receipt,
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  X
} from 'lucide-react';
import {
  getCRMStore,
  subscribeToCRM,
  updateHotelSettings,
  resetCRMData,
  exportCRMDataAsJSON,
  importCRMDataFromJSON,
  getAllUsers,
  createStaffUser,
  updateStaffUser,
  deleteStaffUser,
  getCurrentUser,
  hasPermission
} from '@/lib/crmStore';
import { HotelSettings, CRMUser, StaffPermissions, CRMUserRole } from '@/lib/types';
import AccessRestricted from '@/components/AccessRestricted';

export default function SettingsAdminPage() {
  const [activeTab, setActiveTab] = useState<'rates' | 'staff' | 'system'>('rates');
  const [settings, setSettings] = useState<HotelSettings | null>(null);
  const [users, setUsers] = useState<CRMUser[]>([]);
  const [currentUser, setCurrentUserState] = useState<CRMUser | null>(null);
  const [allowed, setAllowed] = useState<boolean>(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Room Prices
  const [acSingle, setAcSingle] = useState<number | string>(1200);
  const [acDouble, setAcDouble] = useState<number | string>(1800);
  const [acTriple, setAcTriple] = useState<number | string>(2000);

  const [nonacSingle, setNonacSingle] = useState<number | string>(1200);
  const [nonacDouble, setNonacDouble] = useState<number | string>(1500);
  const [nonacTriple, setNonacTriple] = useState<number | string>(800);

  // Vehicle Prices
  const [activaPrice, setActivaPrice] = useState<number | string>(400);
  const [dioPrice, setDioPrice] = useState<number | string>(400);
  const [fascinoPrice, setFascinoPrice] = useState<number | string>(400);
  const [swiftPrice, setSwiftPrice] = useState<number | string>(1500);
  const [ertigaPrice, setErtigaPrice] = useState<number | string>(2500);

  // Hotel Info
  const [hotelName, setHotelName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [taxRate, setTaxRate] = useState<number | string>(12);
  const [whatsappTemplate, setWhatsappTemplate] = useState('');
  const [heroImageOverride, setHeroImageOverride] = useState('');

  // Add User Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<CRMUserRole>('staff');
  const [newUserPin, setNewUserPin] = useState('0000');
  const [newUserDesignation, setNewUserDesignation] = useState('Front Office Associate');
  const [newUserAvatar, setNewUserAvatar] = useState('🏨');

  // Selected User for Editing Permissions
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      setAllowed(hasPermission('settings'));
      const store = getCRMStore();
      const curr = getCurrentUser();
      setCurrentUserState(curr);
      setUsers(getAllUsers());

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
        setHeroImageOverride(store.settings.heroImageOverride || '');
      }
    };

    sync();
    const unsub = subscribeToCRM(sync);
    return () => unsub();
  }, []);

  if (!allowed) {
    return (
      <AccessRestricted
        moduleName="System Settings & Staff Access Control"
        requiredPermission="settings (Master Hotel & Security Configuration)"
        description="Hotel master pricing, tax rate schedules, database backups, and staff permission assignments require Administrator root clearance."
      />
    );
  }

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();

    updateHotelSettings({
      hotelName,
      tagline,
      phone1,
      phone2,
      email,
      address,
      gstin,
      taxRatePercent: Number(taxRate) || 12,
      whatsappMessageTemplate: whatsappTemplate,
      heroImageOverride: heroImageOverride.trim() || undefined,
      roomPrices: {
        ac: { single: Number(acSingle) || 0, double: Number(acDouble) || 0, triple: Number(acTriple) || 0 },
        nonac: { single: Number(nonacSingle) || 0, double: Number(nonacDouble) || 0, triple: Number(nonacTriple) || 0 }
      },
      vehiclePrices: {
        activa: Number(activaPrice) || 0,
        dio: Number(dioPrice) || 0,
        fascino: Number(fascinoPrice) || 0,
        swift: Number(swiftPrice) || 0,
        ertiga: Number(ertigaPrice) || 0
      }
    });

    showNotification('Hotel settings & pricing updated and synced with live website.');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert('Please fill in user name and email.');
      return;
    }

    createStaffUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      pin: newUserPin,
      designation: newUserDesignation,
      avatar: newUserAvatar
    });

    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPin('0000');
    showNotification(`User account created successfully.`);
  };

  const handleTogglePermission = (userId: string, permKey: keyof StaffPermissions) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    const currentPerms = target.permissions || {
      dashboard: true,
      calendar: true,
      rooms: true,
      vehicles: true,
      dining: true,
      housekeeping: true,
      guests: true,
      billing: false,
      analytics: false,
      settings: false
    };

    const updatedPerms: StaffPermissions = {
      ...currentPerms,
      [permKey]: !currentPerms[permKey]
    };

    updateStaffUser(userId, { permissions: updatedPerms });
    showNotification(`Updated permission for ${target.name}.`);
  };

  const handleRoleChange = (userId: string, newRole: CRMUserRole) => {
    updateStaffUser(userId, { role: newRole });
    showNotification(`Role updated to ${newRole.toUpperCase()}.`);
  };

  const handlePinChange = (userId: string, newPin: string) => {
    if (newPin.length > 4) return;
    updateStaffUser(userId, { pin: newPin });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete the user account for ${userName}?`)) {
      const ok = deleteStaffUser(userId);
      if (!ok) {
        alert('Cannot delete the only remaining Administrator account.');
      } else {
        showNotification(`User account deleted.`);
      }
    }
  };

  const permissionModules: { key: keyof StaffPermissions; label: string; icon: any; desc: string }[] = [
    { key: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, desc: 'View revenue totals & occupancy KPIs' },
    { key: 'rooms', label: 'Rooms & Front Desk', icon: BedDouble, desc: 'Manage room bookings & front desk check-in' },
    { key: 'vehicles', label: 'Vehicle Fleet & Rentals', icon: Car, desc: 'Manage scooter/car rental dispatches & returns' },
    { key: 'dining', label: 'Dining & Tables', icon: UtensilsCrossed, desc: 'Manage dining reservations & table seating' },
    { key: 'housekeeping', label: 'Housekeeping & Maint.', icon: Sparkles, desc: 'Update room cleaning & maintenance tickets' },
    { key: 'guests', label: 'Guest 360 CRM', icon: Users, desc: 'Access guest master profiles & stay records' },
    { key: 'billing', label: 'Billing & Folios', icon: Receipt, desc: 'Manage guest invoices, taxes, & payments' },
    { key: 'analytics', label: 'Financial Analytics', icon: BarChart3, desc: 'Confidential RevPAR, ADR & revenue reports' },
    { key: 'settings', label: 'Settings & Rates Control', icon: Settings, desc: 'Configure hotel prices, PINs & staff access' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Hotel Configuration & Access Control
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Manage room rates, vehicle rental pricing, hotel info, and granular staff role permissions.
          </p>
        </div>

        {successMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#D1FAE5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="crm-settings-tabs">
        <button
          onClick={() => setActiveTab('rates')}
          className={`crm-settings-tab-btn ${activeTab === 'rates' ? 'active' : ''}`}
        >
          <Building2 size={17} />
          <span>Rates &amp; Hotel Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`crm-settings-tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
        >
          <ShieldCheck size={17} />
          <span>Staff &amp; Role Control</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`crm-settings-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
        >
          <RotateCcw size={17} />
          <span>Database &amp; Backup</span>
        </button>
      </div>

      {/* TAB 1: RATES & HOTEL PROFILE */}
      {activeTab === 'rates' && (
        <form onSubmit={handleSaveRates}>
          {/* Room Pricing Master */}
          <div className="crm-card" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <BedDouble size={20} color="var(--color-emerald)" />
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Room Category Nightly Rates (INR ₹)
              </h2>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Rates dynamically update both the public website booking engine and the CRM front desk billing.
            </p>

            <div className="crm-rates-grid">
              {/* AC Suite */}
              <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
                <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  Paradise AC Suite (10 Rooms)
                </h3>
                <div className="crm-rate-inputs">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>Single</label>
                    <input
                      type="number"
                      value={acSingle}
                      onChange={(e) => setAcSingle(e.target.value)}
                      className="crm-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>Double</label>
                    <input
                      type="number"
                      value={acDouble}
                      onChange={(e) => setAcDouble(e.target.value)}
                      className="crm-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>Triple</label>
                    <input
                      type="number"
                      value={acTriple}
                      onChange={(e) => setAcTriple(e.target.value)}
                      className="crm-input"
                    />
                  </div>
                </div>
              </div>

              {/* Non-AC Suite */}
              <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
                <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  Heritage Non-AC Room (8 Rooms)
                </h3>
                <div className="crm-rate-inputs">
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>Single</label>
                    <input
                      type="number"
                      value={nonacSingle}
                      onChange={(e) => setNonacSingle(e.target.value)}
                      className="crm-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>Double</label>
                    <input
                      type="number"
                      value={nonacDouble}
                      onChange={(e) => setNonacDouble(e.target.value)}
                      className="crm-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>Triple</label>
                    <input
                      type="number"
                      value={nonacTriple}
                      onChange={(e) => setNonacTriple(e.target.value)}
                      className="crm-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Pricing Master */}
          <div className="crm-card" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Car size={20} color="var(--color-emerald)" />
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Vehicle Fleet Daily Rental Rates (INR ₹/day)
              </h2>
            </div>

            <div className="crm-vehicle-rates-grid">
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Honda Activa 6G</label>
                <input
                  type="number"
                  value={activaPrice}
                  onChange={(e) => setActivaPrice(e.target.value)}
                  className="crm-input"
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Honda Dio 110</label>
                <input
                  type="number"
                  value={dioPrice}
                  onChange={(e) => setDioPrice(e.target.value)}
                  className="crm-input"
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Yamaha Fascino</label>
                <input
                  type="number"
                  value={fascinoPrice}
                  onChange={(e) => setFascinoPrice(e.target.value)}
                  className="crm-input"
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Maruti Swift (Car)</label>
                <input
                  type="number"
                  value={swiftPrice}
                  onChange={(e) => setSwiftPrice(e.target.value)}
                  className="crm-input"
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Maruti Ertiga (7-Seater)</label>
                <input
                  type="number"
                  value={ertigaPrice}
                  onChange={(e) => setErtigaPrice(e.target.value)}
                  className="crm-input"
                />
              </div>
            </div>
          </div>

          {/* Hotel Contact & General Info */}
          <div className="crm-card" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Building2 size={20} color="var(--color-emerald)" />
              <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Hotel Profile &amp; Tax Configuration
              </h2>
            </div>

            <div className="crm-hotel-profile-grid">
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Hotel Name</label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="crm-input"
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="crm-input"
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Primary Phone</label>
                <input
                  type="text"
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                  className="crm-input"
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Support Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="crm-input"
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>GSTIN Number</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="crm-input"
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Default GST Rate (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="crm-input"
                />
              </div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Full Property Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="crm-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="crm-btn crm-btn-primary" style={{ padding: '10px 24px', fontSize: '14px', width: 'auto' }}>
              <Save size={16} />
              <span>Save Rates &amp; Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: STAFF & ROLE ACCESS CONTROL */}
      {activeTab === 'staff' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Staff Accounts &amp; Granular Permissions
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
                Admins have root access. For staff members, toggle individual feature modules on/off in real time.
              </p>
            </div>

            <button
              onClick={() => setIsAddUserOpen(true)}
              className="crm-btn crm-btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
            >
              <UserPlus size={16} />
              <span>Add Staff Member</span>
            </button>
          </div>

          {/* User Cards with Permissions Matrix */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {users.map((u) => {
              const isAdmin = u.role === 'admin';
              const perms = u.permissions || {
                dashboard: true,
                calendar: true,
                rooms: true,
                vehicles: true,
                dining: true,
                housekeeping: true,
                guests: true,
                billing: false,
                analytics: false,
                settings: false
              };

              return (
                <div
                  key={u.id}
                  className="crm-card crm-staff-card"
                  style={{
                    border: isAdmin ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-card)'
                  }}
                >
                  {/* User Profile Header Row */}
                  <div className="crm-staff-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          backgroundColor: isAdmin ? '#FEF3C7' : '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          border: isAdmin ? '1px solid #FDE68A' : '1px solid #E2E8F0',
                          flexShrink: 0
                        }}
                      >
                        {u.avatar || (isAdmin ? '👑' : '👤')}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                            {u.name}
                          </h3>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: isAdmin ? '#FEF3C7' : '#F1F5F9',
                              color: isAdmin ? '#92400E' : '#475569',
                              border: isAdmin ? '1px solid #FDE68A' : '1px solid #E2E8F0'
                            }}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {u.designation || 'Staff'} · {u.email}
                        </div>
                      </div>
                    </div>

                    {/* Role & PIN Controls */}
                    <div className="crm-staff-controls">
                      {/* Role Dropdown */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '140px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>Role:</span>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as CRMUserRole)}
                          className="crm-select"
                          style={{ padding: '5px 10px', fontSize: '12px', fontWeight: 700, flex: 1 }}
                        >
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      {/* PIN Editor */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={13} color="var(--text-muted)" />
                        <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>PIN:</span>
                        <input
                          type="password"
                          maxLength={4}
                          value={u.pin || '0000'}
                          onChange={(e) => handlePinChange(u.id, e.target.value.replace(/\D/g, ''))}
                          style={{
                            width: '58px',
                            padding: '4px 6px',
                            fontSize: '12px',
                            textAlign: 'center',
                            fontWeight: 700,
                            letterSpacing: '2px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-subtle)'
                          }}
                        />
                      </div>

                      {/* Delete Button */}
                      {!isAdmin && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          title="Delete Staff Account"
                          style={{
                            background: 'none',
                            border: '1px solid #FCA5A5',
                            borderRadius: '6px',
                            padding: '5px 8px',
                            color: '#DC2626',
                            cursor: 'pointer',
                            backgroundColor: '#FEF2F2',
                            flexShrink: 0
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Permissions Toggles Grid */}
                  <div>
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
                      Allowed Feature Modules
                    </span>

                    {isAdmin ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '12.5px', fontWeight: 600 }}>
                        <ShieldCheck size={16} />
                        <span>Administrator accounts automatically have full access to all CRM modules and settings.</span>
                      </div>
                    ) : (
                      <div className="crm-perms-grid">
                        {permissionModules.map((mod) => {
                          const isChecked = Boolean(perms[mod.key]);
                          const Icon = mod.icon;

                          return (
                            <div
                              key={mod.key}
                              onClick={() => handleTogglePermission(u.id, mod.key)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: isChecked ? '1px solid rgba(5, 150, 105, 0.4)' : '1px solid var(--border-subtle)',
                                backgroundColor: isChecked ? 'rgba(5, 150, 105, 0.04)' : 'var(--bg-subtle)',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
                                <div
                                  style={{
                                    color: isChecked ? 'var(--color-emerald)' : 'var(--text-muted)',
                                    flexShrink: 0
                                  }}
                                >
                                  <Icon size={15} />
                                </div>
                                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: isChecked ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {mod.label}
                                  </div>
                                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {mod.desc}
                                  </div>
                                </div>
                              </div>

                              {/* Toggle Switch */}
                              <div
                                style={{
                                  width: '34px',
                                  height: '18px',
                                  borderRadius: '999px',
                                  backgroundColor: isChecked ? 'var(--color-emerald)' : '#CBD5E1',
                                  position: 'relative',
                                  flexShrink: 0,
                                  marginLeft: '8px',
                                  transition: 'background-color 0.2s'
                                }}
                              >
                                <div
                                  style={{
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    backgroundColor: '#FFFFFF',
                                    position: 'absolute',
                                    top: '2px',
                                    left: isChecked ? '18px' : '2px',
                                    transition: 'left 0.2s',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM & DATA BACKUP */}
      {activeTab === 'system' && (
        <div className="crm-card" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Data Import, Export &amp; Reset
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
            Export full hotel records (guests, bookings, folios, users, settings) to a JSON file for backup, or restore from a previous snapshot.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const json = exportCRMDataAsJSON();
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `casa_paradiso_crm_backup_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                showNotification('Database exported successfully.');
              }}
              className="crm-btn crm-btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', fontSize: '13px' }}
            >
              <Download size={15} />
              <span>Export Full CRM Backup (JSON)</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all CRM store data to factory defaults? All temporary bookings will be restored to seed state.')) {
                  resetCRMData();
                  showNotification('CRM reset to initial seed data.');
                  setTimeout(() => window.location.reload(), 800);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                fontSize: '13px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FEE2E2',
                border: '1px solid #FECACA',
                color: '#DC2626',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={15} />
              <span>Reset to Seed Defaults</span>
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="crm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setIsAddUserOpen(false)}>
          <div className="crm-modal" style={{ maxWidth: '480px' }}>
            <div className="crm-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} color="var(--color-emerald)" />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Create New Staff Account
                </h3>
              </div>
              <button
                onClick={() => setIsAddUserOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="crm-modal-body">
              <div className="crm-form-group">
                <label className="crm-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="crm-input"
                />
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. ramesh@casaparadisohotel.in"
                  className="crm-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Scope Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as CRMUserRole)}
                    className="crm-select"
                  >
                    <option value="staff">Staff (Custom)</option>
                    <option value="admin">Admin (Root Access)</option>
                  </select>
                </div>

                <div className="crm-form-group">
                  <label className="crm-label">4-Digit PIN Code</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newUserPin}
                    onChange={(e) => setNewUserPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="0000"
                    className="crm-input"
                    style={{ textAlign: 'center', letterSpacing: '3px', fontWeight: 700 }}
                  />
                </div>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Job Designation</label>
                <input
                  type="text"
                  value={newUserDesignation}
                  onChange={(e) => setNewUserDesignation(e.target.value)}
                  placeholder="e.g. Front Office Associate"
                  className="crm-input"
                />
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Avatar Icon</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['🏨', '🧹', '👤', '🛎️', '👨‍💼', '👩‍💼', '👑'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewUserAvatar(emoji)}
                      style={{
                        fontSize: '18px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: newUserAvatar === emoji ? '2px solid var(--color-emerald)' : '1px solid var(--border-subtle)',
                        backgroundColor: newUserAvatar === emoji ? 'rgba(5, 150, 105, 0.1)' : 'var(--bg-subtle)',
                        cursor: 'pointer'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="crm-modal-footer" style={{ padding: '12px 0 0 0', background: 'none' }}>
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="crm-btn crm-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="crm-btn crm-btn-primary"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
