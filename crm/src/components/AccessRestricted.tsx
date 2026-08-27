'use client';

import React, { useState } from 'react';
import { ShieldAlert, Lock, KeyRound, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/crmStore';
import UserSwitcherModal from './UserSwitcherModal';

interface AccessRestrictedProps {
  moduleName: string;
  requiredPermission?: string;
  description?: string;
}

export default function AccessRestricted({
  moduleName,
  requiredPermission,
  description
}: AccessRestrictedProps) {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const currentUser = getCurrentUser();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        textAlign: 'center',
        padding: '32px 20px',
        maxWidth: '560px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          backgroundColor: '#FEE2E2',
          border: '2px solid #FCA5A5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#DC2626',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(220, 38, 38, 0.12)'
        }}
      >
        <Lock size={36} />
      </div>

      <span
        style={{
          fontSize: '11px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '1.2px',
          color: '#DC2626',
          backgroundColor: '#FEF2F2',
          padding: '4px 12px',
          borderRadius: '999px',
          marginBottom: '12px',
          border: '1px solid #FECACA'
        }}
      >
        Staff Access Restricted
      </span>

      <h1
        style={{
          fontSize: '24px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          margin: '0 0 12px 0'
        }}
      >
        {moduleName} is Locked
      </h1>

      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: '0 0 24px 0'
        }}
      >
        {description || `Your active account (${currentUser.name} · ${currentUser.role.toUpperCase()}) does not have permission to view or manage this module. Please contact the Hotel General Manager or Administrator to request access.`}
      </p>

      {requiredPermission && (
        <div
          style={{
            fontSize: '12.5px',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-subtle)',
            padding: '8px 16px',
            borderRadius: '8px',
            marginBottom: '28px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          Required Scope Permission: <strong style={{ color: 'var(--text-primary)' }}>{requiredPermission}</strong>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '13.5px',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </Link>

        <button
          onClick={() => setIsSwitcherOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-emerald)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
          }}
        >
          <KeyRound size={16} />
          <span>Switch to Admin Account</span>
        </button>
      </div>

      <UserSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </div>
  );
}
