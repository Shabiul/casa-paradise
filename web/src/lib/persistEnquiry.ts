/**
 * persistEnquiry.ts
 * Persists web-submitted room bookings and dining reservations to Supabase
 * so they immediately appear in the CRM. Falls back silently if Supabase
 * is unavailable — the local CRM store is always written first.
 */

import { getSupabaseClient } from './supabaseClient';

export interface RoomBookingPayload {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  roomType: 'ac' | 'nonac';
  occupancy: 'single' | 'double' | 'triple';
  checkIn: string;
  checkOut: string;
  nights: number;
  baseRate: number;
  totalPrice: number;
  specialRequests?: string;
  status: string;
  createdAt: string;
}

export interface DiningBookingPayload {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  date: string;
  timeSlot: string;
  partySize: number;
  dietaryPreferences: string;
  specialRequests?: string;
  status: string;
  createdAt: string;
}

/**
 * Push a room booking to Supabase `room_bookings` table.
 * Safe to call from the web — does not throw.
 */
export async function persistRoomBookingToSupabase(booking: RoomBookingPayload): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error } = await supabase.from('room_bookings').upsert({
      id: booking.id,
      guest_name: booking.guestName,
      guest_phone: booking.guestPhone,
      guest_email: booking.guestEmail,
      room_type: booking.roomType,
      occupancy: booking.occupancy,
      check_in: booking.checkIn,
      check_out: booking.checkOut,
      nights: booking.nights,
      base_rate: booking.baseRate,
      total_price: booking.totalPrice,
      special_requests: booking.specialRequests || '',
      status: booking.status || 'pending',
      source: 'website',
      created_at: booking.createdAt,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) {
      console.warn('[Casa Paradiso] Room booking sync to Supabase failed:', error.message);
    } else {
      console.log('[Casa Paradiso] Room booking synced to CRM:', booking.id);
    }
  } catch (err) {
    console.warn('[Casa Paradiso] Supabase unavailable, booking saved locally only:', err);
  }
}

/**
 * Push a dining reservation to Supabase `dining_bookings` table.
 * Safe to call from the web — does not throw.
 */
export async function persistDiningBookingToSupabase(booking: DiningBookingPayload): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error } = await supabase.from('dining_bookings').upsert({
      id: booking.id,
      guest_name: booking.guestName,
      guest_phone: booking.guestPhone,
      guest_email: booking.guestEmail,
      reservation_date: booking.date,
      time_slot: booking.timeSlot,
      party_size: booking.partySize,
      dietary_preferences: booking.dietaryPreferences,
      special_requests: booking.specialRequests || '',
      status: booking.status || 'pending',
      source: 'website',
      created_at: booking.createdAt,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) {
      console.warn('[Casa Paradiso] Dining reservation sync to Supabase failed:', error.message);
    } else {
      console.log('[Casa Paradiso] Dining reservation synced to CRM:', booking.id);
    }
  } catch (err) {
    console.warn('[Casa Paradiso] Supabase unavailable, reservation saved locally only:', err);
  }
}
