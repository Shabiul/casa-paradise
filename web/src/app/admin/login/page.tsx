'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' || password === 'casaparadiso') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('casa_admin_auth', 'true');
      }
      router.push('/admin');
    } else {
      setError(true);
    }
  };

  const handleDemoAccess = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('casa_admin_auth', 'true');
    }
    router.push('/admin');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0B132B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        color: '#FFF'
      }}
    >
      <div
        style={{
          backgroundColor: '#1E293B',
          borderRadius: '24px',
          border: '1px solid #334155',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          maxWidth: '440px',
          width: '100%',
          padding: '36px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Lock size={26} color="#FFF" />
          </div>
          <span style={{ fontSize: '11px', color: '#34D399', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            OPERATIONS & FRONT DESK
          </span>
          <h1 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 700, color: '#FFF' }}>
            Casa Paradiso CRM
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>
            Sign in to access live bookings, vehicles, and guest directory.
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>
              Manager Passcode
            </label>
            <input
              type="password"
              placeholder="Enter passcode (e.g. admin123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: '#0F172A',
                color: '#FFF',
                border: '1px solid #334155',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
            {error && (
              <span style={{ color: '#F87171', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Incorrect passcode. Try 'admin123' or click One-Click Demo Access below.
              </span>
            )}
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#059669',
              color: '#FFF',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Sign In to CRM <ArrowRight size={16} />
          </button>

          <div style={{ textAlign: 'center', margin: '8px 0', borderTop: '1px solid #334155', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={handleDemoAccess}
              style={{
                background: 'transparent',
                border: '1px dashed #64748B',
                color: '#38BDF8',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={15} /> Instant Demo Access (Bypass)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
