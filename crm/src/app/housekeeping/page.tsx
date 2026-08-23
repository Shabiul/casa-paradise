'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Edit,
  Clock,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import {
  getCRMStore,
  subscribeToCRM,
  updateRoomCleanliness,
  createMaintenanceTicket,
  updateMaintenanceTicket
} from '@/lib/crmStore';
import { CleanlinessStatus, MaintenanceTicket, MaintenancePriority, CRMStoreData } from '@/lib/types';
import QuickBookingModal from '@/components/QuickBookingModal';

export default function HousekeepingAdminPage() {
  const [store, setStore] = useState<CRMStoreData>(getCRMStore());
  const [activeTab, setActiveTab] = useState<'rooms' | 'maintenance'>('rooms');
  const [isQuickMaintOpen, setIsQuickMaintOpen] = useState(false);

  // Maintenance Edit
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [ticketStatus, setTicketStatus] = useState<any>('reported');
  const [ticketAssignee, setTicketAssignee] = useState('');

  useEffect(() => {
    const update = () => setStore(getCRMStore());
    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  const cleanRooms = store.rooms.filter(r => r.cleanliness === 'clean' || r.cleanliness === 'inspected').length;
  const dirtyRooms = store.rooms.filter(r => r.cleanliness === 'dirty').length;
  const inProgressRooms = store.rooms.filter(r => r.cleanliness === 'cleaning_in_progress').length;
  const outOfOrderRooms = store.rooms.filter(r => r.cleanliness === 'out_of_order').length;

  const handleCleanlinessChange = (roomNum: string, status: CleanlinessStatus) => {
    updateRoomCleanliness(roomNum, status);
  };

  const handleResolveTicket = (ticketId: string) => {
    updateMaintenanceTicket(ticketId, { status: 'resolved' });
  };

  const handleOpenTicket = (t: MaintenanceTicket) => {
    setSelectedTicket(t);
    setTicketStatus(t.status);
    setTicketAssignee(t.assignedTo || '');
  };

  const handleSaveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    updateMaintenanceTicket(selectedTicket.id, {
      status: ticketStatus,
      assignedTo: ticketAssignee
    });

    setSelectedTicket(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={22} color="#059669" />
            <span>Housekeeping & Maintenance Operations</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Room cleanliness inspection, turn-down service, asset maintenance & vendor work orders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab(activeTab === 'rooms' ? 'maintenance' : 'rooms')}
            className="crm-btn crm-btn-secondary"
          >
            <Wrench size={16} />
            <span>Switch to {activeTab === 'rooms' ? 'Maintenance Tickets' : 'Room Grid'}</span>
          </button>

          <button onClick={() => setIsQuickMaintOpen(true)} className="crm-btn crm-btn-primary">
            <Plus size={16} />
            <span>Log Maintenance Ticket</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="crm-metrics-grid">
        <div className="crm-metric-card">
          <span className="crm-metric-label">Clean & Inspected</span>
          <div className="crm-metric-value" style={{ color: '#059669' }}>{cleanRooms}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ready for guest check-in</div>
        </div>

        <div className="crm-metric-card">
          <span className="crm-metric-label">Dirty (Needs Turndown)</span>
          <div className="crm-metric-value" style={{ color: dirtyRooms > 0 ? '#DC2626' : '#059669' }}>{dirtyRooms}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Pending room attendant</div>
        </div>

        <div className="crm-metric-card">
          <span className="crm-metric-label">Cleaning In-Progress</span>
          <div className="crm-metric-value" style={{ color: '#D97706' }}>{inProgressRooms}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Housekeeping active</div>
        </div>

        <div className="crm-metric-card">
          <span className="crm-metric-label">Out of Order (Maintenance)</span>
          <div className="crm-metric-value" style={{ color: outOfOrderRooms > 0 ? '#DC2626' : '#059669' }}>{outOfOrderRooms}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Under repair / blocked</div>
        </div>
      </div>

      {/* ROOM CLEANLINESS MATRIX VIEW */}
      {activeTab === 'rooms' && (
        <div className="crm-card">
          <div className="crm-card-header">
            <div className="crm-card-title">
              <Sparkles size={18} color="#059669" />
              <span>18-Suite Cleanliness & Turndown Board</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Click any badge to toggle housekeeping status</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {store.rooms.map(room => (
              <div
                key={room.roomNumber}
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                      Suite {room.roomNumber}
                    </strong>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      {room.title} (Floor {room.floor})
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: room.isOccupied ? '#DCFCE7' : 'var(--bg-elevated)',
                      color: room.isOccupied ? '#15803D' : 'var(--text-secondary)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {room.isOccupied ? 'OCCUPIED' : 'VACANT'}
                  </span>
                </div>

                {room.notes && (
                  <div style={{ fontSize: '12px', color: '#D97706', backgroundColor: '#FEF3C7', padding: '6px 10px', borderRadius: '4px' }}>
                    Note: {room.notes}
                  </div>
                )}

                {/* Status Toggle Buttons */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <button
                    onClick={() => handleCleanlinessChange(room.roomNumber, 'clean')}
                    className="crm-btn"
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      backgroundColor: room.cleanliness === 'clean' ? '#059669' : 'var(--bg-elevated)',
                      color: room.cleanliness === 'clean' ? '#FFF' : 'var(--text-secondary)'
                    }}
                  >
                    Clean
                  </button>

                  <button
                    onClick={() => handleCleanlinessChange(room.roomNumber, 'cleaning_in_progress')}
                    className="crm-btn"
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      backgroundColor: room.cleanliness === 'cleaning_in_progress' ? '#D97706' : 'var(--bg-elevated)',
                      color: room.cleanliness === 'cleaning_in_progress' ? '#FFF' : 'var(--text-secondary)'
                    }}
                  >
                    Cleaning
                  </button>

                  <button
                    onClick={() => handleCleanlinessChange(room.roomNumber, 'dirty')}
                    className="crm-btn"
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      backgroundColor: room.cleanliness === 'dirty' ? '#DC2626' : 'var(--bg-elevated)',
                      color: room.cleanliness === 'dirty' ? '#FFF' : 'var(--text-secondary)'
                    }}
                  >
                    Dirty
                  </button>

                  <button
                    onClick={() => handleCleanlinessChange(room.roomNumber, 'out_of_order')}
                    className="crm-btn"
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      backgroundColor: room.cleanliness === 'out_of_order' ? '#7F1D1D' : 'var(--bg-elevated)',
                      color: room.cleanliness === 'out_of_order' ? '#FFF' : 'var(--text-secondary)'
                    }}
                  >
                    OOO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAINTENANCE TICKETS VIEW */}
      {activeTab === 'maintenance' && (
        <div className="crm-table-container">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Area / Room</th>
                <th>Issue Summary & Notes</th>
                <th>Priority</th>
                <th>Assigned Staff</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {store.maintenanceTickets.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.area}</div>
                    {t.roomNumber && <div style={{ fontSize: '11px', color: '#0284C7' }}>Suite {t.roomNumber}</div>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.issueTitle}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.description}</div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        backgroundColor:
                          t.priority === 'urgent'
                            ? '#FEE2E2'
                            : t.priority === 'high'
                            ? '#FEF3C7'
                            : 'var(--bg-elevated)',
                        color:
                          t.priority === 'urgent'
                            ? '#B91C1C'
                            : t.priority === 'high'
                            ? '#92400E'
                            : 'var(--text-secondary)'
                      }}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px' }}>{t.assignedTo}</span>
                  </td>
                  <td>
                    <span
                      className={`crm-badge ${
                        t.status === 'resolved'
                          ? 'crm-badge-active'
                          : t.status === 'in_progress'
                          ? 'crm-badge-pending'
                          : 'crm-badge-cancelled'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {t.status !== 'resolved' ? (
                      <button
                        onClick={() => handleResolveTicket(t.id)}
                        className="crm-btn crm-btn-primary"
                        style={{ padding: '5px 10px', fontSize: '11.5px' }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Mark Resolved</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>
                        Resolved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ticket Edit Modal */}
      {selectedTicket && (
        <div className="crm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setSelectedTicket(null)}>
          <div className="crm-modal" style={{ maxWidth: '520px' }}>
            <div className="crm-modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Update Ticket #{selectedTicket.id}
              </h3>
              <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTicket} className="crm-modal-body">
              <div className="crm-form-group">
                <label className="crm-label">Update Status</label>
                <select
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value as any)}
                  className="crm-select"
                >
                  <option value="reported">Reported (Pending)</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved & Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Assigned Technician / Vendor</label>
                <input
                  type="text"
                  value={ticketAssignee}
                  onChange={(e) => setTicketAssignee(e.target.value)}
                  className="crm-input"
                />
              </div>

              <div className="crm-modal-footer" style={{ padding: '12px 0 0 0', background: 'none' }}>
                <button type="button" onClick={() => setSelectedTicket(null)} className="crm-btn crm-btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="crm-btn crm-btn-primary">
                  Save Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isQuickMaintOpen && (
        <QuickBookingModal
          initialTab="maintenance"
          onClose={() => setIsQuickMaintOpen(false)}
        />
      )}
    </div>
  );
}
