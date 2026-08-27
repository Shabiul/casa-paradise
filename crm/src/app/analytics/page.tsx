'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  DollarSign,
  BedDouble,
  Car,
  UtensilsCrossed,
  Sparkles,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { getCRMStore, subscribeToCRM, exportCRMDataAsJSON, hasPermission } from '@/lib/crmStore';
import { CRMStoreData } from '@/lib/types';
import AccessRestricted from '@/components/AccessRestricted';

export default function AnalyticsAdminPage() {
  const [store, setStore] = useState<CRMStoreData>(getCRMStore());
  const [allowed, setAllowed] = useState<boolean>(true);

  useEffect(() => {
    const update = () => {
      setAllowed(hasPermission('analytics'));
      setStore(getCRMStore());
    };
    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  if (!allowed) {
    return (
      <AccessRestricted
        moduleName="Financial & Revenue Analytics"
        requiredPermission="analytics (Financial Reporting & RevPAR Access)"
        description="Hotel revenue metrics, ADR, RevPAR, department profitability breakdowns, and CSV export are confidential executive analytics."
      />
    );
  }

  const roomRevenue = store.roomBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const vehicleRevenue = store.vehicleBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const diningRevenue = store.diningBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.estimatedBill || 1500), 0);

  const totalRevenue = roomRevenue + vehicleRevenue + diningRevenue;

  const totalRoomNights = store.roomBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.nights, 0);

  const adr = totalRoomNights > 0 ? Math.round(roomRevenue / totalRoomNights) : 1800;
  const totalRooms = 18;
  const revpar = Math.round(roomRevenue / (totalRooms * 30));

  const acBookings = store.roomBookings.filter(b => b.roomType === 'ac' && b.status !== 'cancelled');
  const nonacBookings = store.roomBookings.filter(b => b.roomType === 'nonac' && b.status !== 'cancelled');
  const acRevenue = acBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const nonacRevenue = nonacBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Type,Booking ID,Guest Name,Service Name,Date,Amount (INR),Status\n';

    store.roomBookings.forEach(b => {
      csvContent += `Room,${b.id},"${b.guestName}","${b.roomTitle}",${b.checkIn},${b.totalPrice},${b.status}\n`;
    });
    store.vehicleBookings.forEach(v => {
      csvContent += `Vehicle,${v.id},"${v.guestName}","${v.vehicleName}",${v.pickupDate},${v.totalPrice},${v.status}\n`;
    });
    store.diningBookings.forEach(d => {
      csvContent += `Dining,${d.id},"${d.guestName}","Table ${d.tableNumber || 'Dining'}",${d.date},${d.estimatedBill || 1800},${d.status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `casa_paradiso_financial_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const jsonStr = exportCRMDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `casa_paradiso_crm_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="crm-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={22} color="#059669" />
            <span>Financial Analytics & Revenue Performance</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Hospitality KPIs, RevPAR, ADR, channel breakdown, and exportable financial audit reports.
          </p>
        </div>

        <div className="crm-analytics-header-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleExportCSV} className="crm-btn crm-btn-secondary" style={{ padding: '8px 14px' }}>
            <FileSpreadsheet size={16} color="#059669" />
            <span>Export CSV Report</span>
          </button>

          <button onClick={handleExportJSON} className="crm-btn crm-btn-primary" style={{ padding: '8px 14px' }}>
            <Download size={16} />
            <span>Full Data JSON Backup</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="crm-metrics-grid">
        <div className="crm-metric-card">
          <span className="crm-metric-label">ADR (Average Daily Rate)</span>
          <div className="crm-metric-value" style={{ color: '#0284C7' }}>
            ₹{adr.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Average rate per booked night</div>
        </div>

        <div className="crm-metric-card">
          <span className="crm-metric-label">RevPAR (Rev per Available Room)</span>
          <div className="crm-metric-value" style={{ color: '#059669' }}>
            ₹{revpar.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Based on 18 inventory suites</div>
        </div>

        <div className="crm-metric-card">
          <span className="crm-metric-label">Total Room Nights Sold</span>
          <div className="crm-metric-value" style={{ color: '#D97706' }}>
            {totalRoomNights} Nights
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Across all AC & Non-AC suites</div>
        </div>

        <div className="crm-metric-card">
          <span className="crm-metric-label">Gross Operations Revenue</span>
          <div className="crm-metric-value" style={{ color: '#059669' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Combined Revenue streams</div>
        </div>
      </div>

      {/* Revenue Breakdown by Stream & Category Share */}
      <div className="crm-analytics-grid">
        {/* Stream Distribution */}
        <div className="crm-card">
          <div className="crm-card-header">
            <div className="crm-card-title">
              <TrendingUp size={18} color="#059669" />
              <span>Revenue Streams Breakdown</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Rooms */}
            <div>
              <div className="crm-stream-header">
                <span className="crm-stream-label">
                  <BedDouble size={15} color="#059669" />
                  <span>Suite Accommodations</span>
                </span>
                <span className="crm-stream-val" style={{ color: '#059669' }}>
                  ₹{roomRevenue.toLocaleString('en-IN')} ({totalRevenue > 0 ? Math.round((roomRevenue / totalRevenue) * 100) : 0}%)
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${totalRevenue > 0 ? (roomRevenue / totalRevenue) * 100 : 0}%`,
                    backgroundColor: '#059669',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>

            {/* Vehicle Rentals */}
            <div>
              <div className="crm-stream-header">
                <span className="crm-stream-label">
                  <Car size={15} color="#0284C7" />
                  <span>Vehicle Fleet Rentals</span>
                </span>
                <span className="crm-stream-val" style={{ color: '#0284C7' }}>
                  ₹{vehicleRevenue.toLocaleString('en-IN')} ({totalRevenue > 0 ? Math.round((vehicleRevenue / totalRevenue) * 100) : 0}%)
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${totalRevenue > 0 ? (vehicleRevenue / totalRevenue) * 100 : 0}%`,
                    backgroundColor: '#0284C7',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>

            {/* Dining */}
            <div>
              <div className="crm-stream-header">
                <span className="crm-stream-label">
                  <UtensilsCrossed size={15} color="#D97706" />
                  <span>Restaurant &amp; Gastronomy</span>
                </span>
                <span className="crm-stream-val" style={{ color: '#D97706' }}>
                  ₹{diningRevenue.toLocaleString('en-IN')} ({totalRevenue > 0 ? Math.round((diningRevenue / totalRevenue) * 100) : 0}%)
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${totalRevenue > 0 ? (diningRevenue / totalRevenue) * 100 : 0}%`,
                    backgroundColor: '#D97706',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Accommodation Category Comparison */}
        <div className="crm-card">
          <div className="crm-card-header">
            <div className="crm-card-title">
              <Sparkles size={18} color="#D97706" />
              <span>Room Category Share</span>
            </div>
          </div>

          <div className="crm-category-share-grid">
            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Paradise AC Suites
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                ₹{acRevenue.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {acBookings.length} total bookings
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Heritage Non-AC Rooms
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                ₹{nonacRevenue.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {nonacBookings.length} total bookings
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
