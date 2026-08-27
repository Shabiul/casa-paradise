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
  Trash2,
  Clock,
  ShieldAlert,
  UserCheck,
  ShieldCheck,
  BedDouble
} from 'lucide-react';
import {
  getCRMStore,
  subscribeToCRM,
  updateRoomCleanliness,
  createRoomDefinition,
  updateRoomDefinition,
  deleteRoomDefinition,
  createMaintenanceTicket,
  updateMaintenanceTicket,
  getCurrentUser,
  hasPermission
} from '@/lib/crmStore';
import { useAuth } from '@/lib/AuthContext';
import { CleanlinessStatus, MaintenanceTicket, MaintenancePriority, CRMStoreData, RoomDefinition, RoomType } from '@/lib/types';
import QuickBookingModal from '@/components/QuickBookingModal';
import AccessRestricted from '@/components/AccessRestricted';

export default function HousekeepingAdminPage() {
  const { user: authUser } = useAuth();
  const [store, setStore] = useState<CRMStoreData>(getCRMStore());
  const [activeTab, setActiveTab] = useState<'rooms' | 'maintenance'>('rooms');
  const [isQuickMaintOpen, setIsQuickMaintOpen] = useState(false);
  const [allowed, setAllowed] = useState<boolean>(true);

  const currentUser = authUser || getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  // Room Create/Edit Modal (Admin Only)
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomDefinition | null>(null);
  const [roomNum, setRoomNum] = useState('');
  const [roomTitle, setRoomTitle] = useState('');
  const [roomFloor, setRoomFloor] = useState<1 | 2>(1);
  const [roomType, setRoomType] = useState<RoomType>('ac');
  const [roomMaxOccupancy, setRoomMaxOccupancy] = useState<number>(2);
  const [roomCleanliness, setRoomCleanliness] = useState<CleanlinessStatus>('clean');
  const [roomNotes, setRoomNotes] = useState('');
  const [roomFormError, setRoomFormError] = useState('');

  // Maintenance Edit
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [ticketStatus, setTicketStatus] = useState<any>('reported');
  const [ticketAssignee, setTicketAssignee] = useState('');

  useEffect(() => {
    const update = () => {
      setAllowed(hasPermission('housekeeping'));
      setStore(getCRMStore());
    };
    update();
    const unsubscribe = subscribeToCRM(update);
    return () => unsubscribe();
  }, []);

  if (!allowed) {
    return (
      <AccessRestricted
        moduleName="Housekeeping & Maintenance"
        requiredPermission="housekeeping (Cleaning & Work Orders Access)"
        description="Updating room cleaning statuses, linen requests, and logging maintenance repair tickets requires Housekeeping permissions."
      />
    );
  }

  const cleanRooms = store.rooms.filter(r => r.cleanliness === 'clean' || r.cleanliness === 'inspected').length;
  const dirtyRooms = store.rooms.filter(r => r.cleanliness === 'dirty').length;
  const inProgressRooms = store.rooms.filter(r => r.cleanliness === 'cleaning_in_progress').length;

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

  const handleOpenRoomModal = (room: RoomDefinition | null) => {
    if (!isAdmin) return;
    setEditingRoom(room);
    setRoomFormError('');
    if (room) {
      setRoomNum(room.roomNumber);
      setRoomTitle(room.title);
      setRoomFloor(room.floor);
      setRoomType(room.roomType);
      setRoomMaxOccupancy(room.maxOccupancy);
      setRoomCleanliness(room.cleanliness);
      setRoomNotes(room.notes || '');
    } else {
      setRoomNum('');
      setRoomTitle('Paradise AC Suite');
      setRoomFloor(1);
      setRoomType('ac');
      setRoomMaxOccupancy(2);
      setRoomCleanliness('clean');
      setRoomNotes('');
    }
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (!roomNum.trim()) {
      setRoomFormError('Room number is required.');
      return;
    }

    if (editingRoom) {
      const res = updateRoomDefinition(editingRoom.roomNumber, {
        title: roomTitle.trim() || `Suite ${editingRoom.roomNumber}`,
        floor: Number(roomFloor) as 1 | 2,
        roomType: roomType,
        maxOccupancy: Number(roomMaxOccupancy) || 2,
        cleanliness: roomCleanliness,
        notes: roomNotes.trim()
      });
      if (!res.success) {
        setRoomFormError(res.error || 'Failed to update suite.');
        return;
      }
    } else {
      const res = createRoomDefinition({
        roomNumber: roomNum.trim(),
        title: roomTitle.trim() || `Suite ${roomNum.trim()}`,
        floor: Number(roomFloor) as 1 | 2,
        roomType: roomType,
        maxOccupancy: Number(roomMaxOccupancy) || 2,
        cleanliness: roomCleanliness,
        isOccupied: false,
        notes: roomNotes.trim()
      });
      if (!res.success) {
        setRoomFormError(res.error || 'Failed to create suite.');
        return;
      }
    }

    setIsRoomModalOpen(false);
  };

  const handleDeleteRoom = () => {
    if (!isAdmin || !editingRoom) return;
    if (!confirm(`Are you sure you want to delete Suite ${editingRoom.roomNumber} (${editingRoom.title}) from the hotel inventory?`)) {
      return;
    }
    const res = deleteRoomDefinition(editingRoom.roomNumber);
    if (!res.success) {
      alert(res.error || 'Failed to delete room.');
      return;
    }
    setIsRoomModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={22} color="#059669" />
              <span>Housekeeping &amp; Maintenance Operations</span>
            </h1>
            {isAdmin && (
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  border: '1px solid #FDE68A',
                  letterSpacing: '0.5px'
                }}
              >
                ADMIN ACCESS
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Room cleanliness inspection, turn-down service, asset maintenance &amp; suite inventory control.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {isAdmin && activeTab === 'rooms' && (
            <button
              onClick={() => handleOpenRoomModal(null)}
              className="crm-btn crm-btn-primary"
              style={{ backgroundColor: '#059669', color: '#FFF' }}
            >
              <Plus size={16} />
              <span>Add New Suite</span>
            </button>
          )}

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
          <span className="crm-metric-label">Clean &amp; Inspected</span>
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
          <span className="crm-metric-label">Open Maintenance Tickets</span>
          <div className="crm-metric-value" style={{ color: store.maintenanceTickets.filter(t => t.status !== 'resolved').length > 0 ? '#D97706' : '#059669' }}>
            {store.maintenanceTickets.filter(t => t.status !== 'resolved').length}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active repair work orders</div>
        </div>
      </div>

      {/* ROOM CLEANLINESS MATRIX VIEW */}
      {activeTab === 'rooms' && (
        <div className="crm-card">
          <div className="crm-card-header">
            <div className="crm-card-title">
              <Sparkles size={18} color="#059669" />
              <span>{store.rooms.length}-Suite Cleanliness &amp; Turndown Board</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isAdmin && (
                <button
                  onClick={() => handleOpenRoomModal(null)}
                  className="crm-btn crm-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '12px', color: '#059669', borderColor: '#A7F3D0' }}
                >
                  <Plus size={13} />
                  <span>Add Suite</span>
                </button>
              )}
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Click any badge to toggle status</span>
            </div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                        Suite {room.roomNumber}
                      </strong>
                      {isAdmin && (
                        <button
                          onClick={() => handleOpenRoomModal(room)}
                          title="Edit Suite Details (Admin Only)"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#0284C7',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(2, 132, 199, 0.08)'
                          }}
                        >
                          <Edit size={11} />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {room.title} · Floor {room.floor} · Max {room.maxOccupancy} Guests
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
                      textTransform: 'uppercase',
                      flexShrink: 0
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
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: room.cleanliness === 'clean' || room.cleanliness === 'inspected' ? '#059669' : 'var(--bg-elevated)',
                      color: room.cleanliness === 'clean' || room.cleanliness === 'inspected' ? '#FFF' : 'var(--text-secondary)'
                    }}
                  >
                    Clean
                  </button>

                  <button
                    onClick={() => handleCleanlinessChange(room.roomNumber, 'cleaning_in_progress')}
                    className="crm-btn"
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
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
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: room.cleanliness === 'dirty' || room.cleanliness === 'out_of_order' ? '#DC2626' : 'var(--bg-elevated)',
                      color: room.cleanliness === 'dirty' || room.cleanliness === 'out_of_order' ? '#FFF' : 'var(--text-secondary)'
                    }}
                  >
                    Dirty
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
                <th>Issue Summary &amp; Notes</th>
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

      {/* Admin Suite Create / Edit Modal */}
      {isRoomModalOpen && isAdmin && (
        <div className="crm-modal-backdrop" onClick={(e) => e.target === e.currentTarget && setIsRoomModalOpen(false)}>
          <div className="crm-modal" style={{ maxWidth: '520px' }}>
            <div className="crm-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BedDouble size={18} color="#059669" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {editingRoom ? `Edit Suite ${editingRoom.roomNumber}` : 'Create New Suite'}
                </h3>
              </div>
              <button onClick={() => setIsRoomModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="crm-modal-body">
              {roomFormError && (
                <div style={{ padding: '10px 14px', backgroundColor: '#FEE2E2', border: '1px solid #FECACA', color: '#B91C1C', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600 }}>
                  {roomFormError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Room / Suite Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 109"
                    value={roomNum}
                    onChange={(e) => setRoomNum(e.target.value)}
                    disabled={Boolean(editingRoom)}
                    className="crm-input"
                  />
                  {editingRoom && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Room numbers cannot be changed once created.</span>}
                </div>

                <div className="crm-form-group">
                  <label className="crm-label">Floor</label>
                  <select
                    value={roomFloor}
                    onChange={(e) => setRoomFloor(Number(e.target.value) as 1 | 2)}
                    className="crm-select"
                  >
                    <option value={1}>Floor 1 (Ground &amp; Garden)</option>
                    <option value={2}>Floor 2 (Hill &amp; City View)</option>
                  </select>
                </div>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Suite Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paradise AC Suite with Balcony"
                  value={roomTitle}
                  onChange={(e) => setRoomTitle(e.target.value)}
                  className="crm-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="crm-form-group">
                  <label className="crm-label">Room Category</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as RoomType)}
                    className="crm-select"
                  >
                    <option value="ac">Paradise AC Suite</option>
                    <option value="nonac">Heritage Non-AC Room</option>
                  </select>
                </div>

                <div className="crm-form-group">
                  <label className="crm-label">Max Occupancy</label>
                  <select
                    value={roomMaxOccupancy}
                    onChange={(e) => setRoomMaxOccupancy(Number(e.target.value))}
                    className="crm-select"
                  >
                    <option value={1}>1 Guest (Single)</option>
                    <option value={2}>2 Guests (Double)</option>
                    <option value={3}>3 Guests (Triple)</option>
                    <option value={4}>4 Guests (Family)</option>
                  </select>
                </div>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Initial Cleanliness Status</label>
                <select
                  value={roomCleanliness}
                  onChange={(e) => setRoomCleanliness(e.target.value as CleanlinessStatus)}
                  className="crm-select"
                >
                  <option value="clean">Clean (Ready for check-in)</option>
                  <option value="cleaning_in_progress">Cleaning In-Progress</option>
                  <option value="dirty">Dirty (Requires turn-down)</option>
                </select>
              </div>

              <div className="crm-form-group">
                <label className="crm-label">Room Notes &amp; Special Amenities</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Altinho hill view, king bed, extra wardrobe"
                  value={roomNotes}
                  onChange={(e) => setRoomNotes(e.target.value)}
                  className="crm-textarea"
                />
              </div>

              <div className="crm-modal-footer" style={{ padding: '12px 0 0 0', background: 'none', justifyContent: 'space-between' }}>
                {editingRoom ? (
                  <button
                    type="button"
                    onClick={handleDeleteRoom}
                    className="crm-btn crm-btn-danger"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    <Trash2 size={14} />
                    <span>Delete Suite</span>
                  </button>
                ) : <div />}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setIsRoomModalOpen(false)} className="crm-btn crm-btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="crm-btn crm-btn-primary">
                    {editingRoom ? 'Save Suite Changes' : 'Create Suite'}
                  </button>
                </div>
              </div>
            </form>
          </div>
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
                  <option value="resolved">Resolved &amp; Closed</option>
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

