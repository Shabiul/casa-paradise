import { getSupabaseClient } from './supabaseClient';
import type { CRMUser, StaffPermissions } from './types';
import { initialUsers, defaultAdminPermissions, defaultStaffPermissions } from './crmStore';

// ─── Permission maps keyed by crm_id ────────────────────────────────────────
const PERMISSION_MAP: Record<string, StaffPermissions> = {
  'USR-ADMIN-1': defaultAdminPermissions,
  'USR-STAFF-101': defaultStaffPermissions,
  'USR-STAFF-102': {
    dashboard: false,
    calendar: false,
    rooms: true,
    vehicles: false,
    dining: false,
    housekeeping: true,
    guests: false,
    billing: false,
    analytics: false,
    settings: false
  }
};

const AVATAR_MAP: Record<string, string> = {
  'USR-ADMIN-1': '👑',
  'USR-STAFF-101': '🏨',
  'USR-STAFF-102': '🧹'
};

/**
 * Convert a Supabase Auth user (with user_metadata) into a CRMUser.
 * Falls back to the seed user list if metadata is incomplete.
 */
export function supabaseUserToCRMUser(supabaseUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}): CRMUser {
  const meta = supabaseUser.user_metadata || {};
  const crmId = (meta.crm_id as string) || 'USR-ADMIN-1';
  const role = (meta.role as 'admin' | 'staff') || 'admin';

  // Try to pull full profile from the seed list first
  const seedUser = initialUsers.find(u => u.id === crmId);

  return {
    id: crmId,
    name: (meta.name as string) || seedUser?.name || 'Staff Member',
    email: supabaseUser.email || seedUser?.email || '',
    role,
    pin: seedUser?.pin || '0000',
    designation: (meta.designation as string) || seedUser?.designation,
    avatar: seedUser?.avatar || AVATAR_MAP[crmId] || '👤',
    permissions: PERMISSION_MAP[crmId] || (role === 'admin' ? defaultAdminPermissions : defaultStaffPermissions),
    createdAt: seedUser?.createdAt || new Date().toISOString()
  };
}

/**
 * Sign in via Supabase email + password.
 * Returns { user, error }.
 */
export async function signInWithEmail(email: string, password: string): Promise<{
  user: CRMUser | null;
  error: string | null;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { user: null, error: 'Supabase is not configured. Check .env.local.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { user: null, error: error?.message || 'Login failed. Please check your credentials.' };
  }

  const crmUser = supabaseUserToCRMUser(data.user);
  return { user: crmUser, error: null };
}

/**
 * Sign out the current Supabase session.
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
}

/**
 * Get the currently authenticated CRMUser, or null if no session.
 */
export async function getCurrentSession(): Promise<CRMUser | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  return supabaseUserToCRMUser(session.user);
}
