'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, UserCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  getAllUsers,
  getCurrentUser,
  setCurrentUser,
  verifyUserPin,
  subscribeToCRM
} from '@/lib/crmStore';
import { CRMUser } from '@/lib/types';

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSwitcherModal({ isOpen, onClose }: UserSwitcherModalProps) {
  const [users, setUsers] = useState<CRMUser[]>([]);
  const [currentUser, setCurrentUserState] = useState<CRMUser | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [switchSuccess, setSwitchSuccess] = useState(false);

  useEffect(() => {
    const sync = () => {
      const all = getAllUsers();
      const curr = getCurrentUser();
      setUsers(all);
      setCurrentUserState(curr);
      if (!selectedUserId) {
        setSelectedUserId(curr.id);
      }
    };
    sync();
    const unsub = subscribeToCRM(sync);
    return () => unsub();
  }, [isOpen]);

  if (!isOpen) return null;

  const targetUser = users.find(u => u.id === selectedUserId) || currentUser;

  const handleSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    // Check PIN
    if (!enteredPin) {
      setPinError('Please enter your 4-digit security PIN.');
      return;
    }

    const isValid = verifyUserPin(selectedUserId, enteredPin);
    if (!isValid) {
      setPinError('Incorrect PIN code. Please try again.');
      return;
    }

    setPinError(null);
    setCurrentUser(selectedUserId);
    setSwitchSuccess(true);

    setTimeout(() => {
      setSwitchSuccess(false);
      setEnteredPin('');
      onClose();
      // Reload current page to re-evaluate active permissions
      window.location.reload();
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #FAF8F5 0%, #F3EFEA 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <UserCheck size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Switch Shift / User Account
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Select role and enter your 4-digit PIN
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSwitch} style={{ padding: '24px' }}>
          {/* User List Radio Selection */}
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Select Staff Member or Administrator
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {users.map((u) => {
              const isSelected = selectedUserId === u.id;
              const isCurrent = currentUser?.id === u.id;
              return (
                <div
                  key={u.id}
                  onClick={() => {
                    setSelectedUserId(u.id);
                    setPinError(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid var(--color-emerald)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'rgba(5, 150, 105, 0.05)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '22px' }}>{u.avatar || (u.role === 'admin' ? '👑' : '👤')}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{u.name}</strong>
                        {isCurrent && (
                          <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#E0E7FF', color: '#3730A3', padding: '1px 6px', borderRadius: '4px' }}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {u.designation || (u.role === 'admin' ? 'Hotel Administrator' : 'Staff Associate')}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: u.role === 'admin' ? '#FEF3C7' : '#F1F5F9',
                      color: u.role === 'admin' ? '#92400E' : '#475569',
                      border: u.role === 'admin' ? '1px solid #FDE68A' : '1px solid #E2E8F0'
                    }}
                  >
                    {u.role.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* PIN Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Enter 4-Digit PIN for {targetUser?.name}
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={16} />
              </div>
              <input
                type="password"
                maxLength={4}
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value.replace(/\D/g, ''));
                  setPinError(null);
                }}
                placeholder="••••"
                autoFocus
                style={{
                  width: '100%',
                  height: '46px',
                  paddingLeft: '42px',
                  paddingRight: '14px',
                  fontSize: '20px',
                  letterSpacing: '8px',
                  fontWeight: 800,
                  borderRadius: '10px',
                  border: pinError ? '1.5px solid #DC2626' : '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            {pinError ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontSize: '12px', marginTop: '6px' }}>
                <AlertCircle size={14} />
                <span>{pinError}</span>
              </div>
            ) : (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                Default PINs: Admin = <strong>1234</strong> | Staff = <strong>0000</strong>
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={switchSuccess}
              style={{
                padding: '10px 24px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: switchSuccess ? '#059669' : 'var(--color-emerald)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {switchSuccess ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Authenticated!</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Authenticate & Switch</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
