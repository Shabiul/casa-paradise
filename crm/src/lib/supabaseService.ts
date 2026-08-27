import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import {
  CRMStoreData,
  Guest,
  RoomBooking,
  VehicleBooking,
  DiningBooking,
  RoomDefinition,
  VehicleDefinition,
  DiningTable,
  MaintenanceTicket,
  GuestFolio,
  ActivityLog,
  HotelSettings,
  CRMUser
} from './types';

// ==========================================
// MAPPERS: TypeScript (camelCase) <-> DB (snake_case)
// ==========================================

export function mapUserToDB(u: CRMUser) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    pin: u.pin || '0000',
    designation: u.designation || null,
    avatar: u.avatar || null,
    permissions: u.permissions,
    created_at: u.createdAt || new Date().toISOString()
  };
}

export function mapUserFromDB(row: any): CRMUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as 'admin' | 'staff',
    pin: row.pin || '0000',
    designation: row.designation || undefined,
    avatar: row.avatar || undefined,
    permissions: row.permissions || {
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
    },
    createdAt: row.created_at
  };
}

export function mapGuestToDB(g: Guest) {
  return {
    id: g.id,
    name: g.name,
    email: g.email || null,
    phone: g.phone || null,
    address: g.address || null,
    id_proof_type: g.idProofType || null,
    id_proof_number: g.idProofNumber || null,
    nationality: g.nationality || 'Indian',
    notes: g.notes || null,
    tags: g.tags || [],
    total_bookings: g.totalBookings || 1,
    total_spent: g.totalSpent || 0,
    created_at: g.createdAt || new Date().toISOString(),
    last_visit: g.lastVisit || null
  };
}

export function mapGuestFromDB(row: any): Guest {
  return {
    id: row.id,
    name: row.name,
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || undefined,
    idProofType: row.id_proof_type || undefined,
    idProofNumber: row.id_proof_number || undefined,
    nationality: row.nationality || 'Indian',
    notes: row.notes || undefined,
    tags: row.tags || [],
    totalBookings: Number(row.total_bookings) || 1,
    totalSpent: Number(row.total_spent) || 0,
    createdAt: row.created_at,
    lastVisit: row.last_visit || undefined
  };
}

export function mapRoomBookingToDB(b: RoomBooking) {
  return {
    id: b.id,
    guest_id: b.guestId || null,
    guest_name: b.guestName,
    guest_phone: b.guestPhone,
    guest_email: b.guestEmail,
    room_type: b.roomType,
    room_title: b.roomTitle,
    occupancy: b.occupancy,
    check_in: b.checkIn,
    check_out: b.checkOut,
    nights: b.nights,
    base_rate: b.baseRate,
    total_price: b.totalPrice,
    status: b.status,
    payment_status: b.paymentStatus,
    payment_method: b.paymentMethod || null,
    advance_amount: b.advanceAmount || 0,
    room_number: b.roomNumber || null,
    special_requests: b.specialRequests || null,
    staff_notes: b.staffNotes || null,
    created_at: b.createdAt || new Date().toISOString(),
    updated_at: b.updatedAt || new Date().toISOString()
  };
}

export function mapRoomBookingFromDB(row: any): RoomBooking {
  return {
    id: row.id,
    guestId: row.guest_id || '',
    guestName: row.guest_name,
    guestPhone: row.guest_phone,
    guestEmail: row.guest_email,
    roomType: row.room_type,
    roomTitle: row.room_title,
    occupancy: row.occupancy,
    checkIn: row.check_in,
    checkOut: row.check_out,
    nights: Number(row.nights),
    baseRate: Number(row.base_rate),
    totalPrice: Number(row.total_price),
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method || undefined,
    advanceAmount: Number(row.advance_amount) || 0,
    roomNumber: row.room_number || undefined,
    specialRequests: row.special_requests || undefined,
    staffNotes: row.staff_notes || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapVehicleBookingToDB(v: VehicleBooking) {
  return {
    id: v.id,
    guest_id: v.guestId || null,
    guest_name: v.guestName,
    guest_phone: v.guestPhone,
    guest_email: v.guestEmail,
    vehicle_id: v.vehicleId,
    vehicle_name: v.vehicleName,
    vehicle_category: v.vehicleCategory,
    vehicle_image: v.vehicleImage || null,
    registration_number: v.registrationNumber || null,
    pickup_date: v.pickupDate,
    return_date: v.returnDate,
    days: v.days,
    daily_rate: v.dailyRate,
    total_price: v.totalPrice,
    status: v.status,
    payment_status: v.paymentStatus,
    payment_method: v.paymentMethod || null,
    license_number: v.licenseNumber || null,
    helmet_count: v.helmetCount || 0,
    deposit_amount: v.depositAmount || 0,
    hotel_delivery: v.hotelDelivery ?? true,
    fuel_level_on_pickup: v.fuelLevelOnPickup || null,
    fuel_level_on_return: v.fuelLevelOnReturn || null,
    special_requests: v.specialRequests || null,
    staff_notes: v.staffNotes || null,
    created_at: v.createdAt || new Date().toISOString(),
    updated_at: v.updatedAt || new Date().toISOString()
  };
}

export function mapVehicleBookingFromDB(row: any): VehicleBooking {
  return {
    id: row.id,
    guestId: row.guest_id || '',
    guestName: row.guest_name,
    guestPhone: row.guest_phone,
    guestEmail: row.guest_email,
    vehicleId: row.vehicle_id,
    vehicleName: row.vehicle_name,
    vehicleCategory: row.vehicle_category,
    vehicleImage: row.vehicle_image || '',
    registrationNumber: row.registration_number || undefined,
    pickupDate: row.pickup_date,
    returnDate: row.return_date,
    days: Number(row.days),
    dailyRate: Number(row.daily_rate),
    totalPrice: Number(row.total_price),
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method || undefined,
    licenseNumber: row.license_number || undefined,
    helmetCount: Number(row.helmet_count) || 0,
    depositAmount: Number(row.deposit_amount) || 0,
    hotelDelivery: row.hotel_delivery ?? true,
    fuelLevelOnPickup: row.fuel_level_on_pickup || undefined,
    fuelLevelOnReturn: row.fuel_level_on_return || undefined,
    specialRequests: row.special_requests || undefined,
    staffNotes: row.staff_notes || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapDiningBookingToDB(d: DiningBooking) {
  return {
    id: d.id,
    guest_id: d.guestId || null,
    guest_name: d.guestName,
    guest_phone: d.guestPhone,
    guest_email: d.guestEmail,
    date: d.date,
    time_slot: d.timeSlot,
    party_size: d.partySize,
    dietary_preferences: d.dietaryPreferences || null,
    special_requests: d.specialRequests || null,
    table_number: d.tableNumber || null,
    status: d.status,
    estimated_bill: d.estimatedBill || null,
    staff_notes: d.staffNotes || null,
    created_at: d.createdAt || new Date().toISOString(),
    updated_at: d.updatedAt || new Date().toISOString()
  };
}

export function mapDiningBookingFromDB(row: any): DiningBooking {
  return {
    id: row.id,
    guestId: row.guest_id || '',
    guestName: row.guest_name,
    guestPhone: row.guest_phone,
    guestEmail: row.guest_email,
    date: row.date,
    timeSlot: row.time_slot,
    partySize: Number(row.party_size),
    dietaryPreferences: row.dietary_preferences || undefined,
    specialRequests: row.special_requests || undefined,
    tableNumber: row.table_number || undefined,
    status: row.status,
    estimatedBill: row.estimated_bill ? Number(row.estimated_bill) : undefined,
    staffNotes: row.staff_notes || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapRoomToDB(r: RoomDefinition) {
  return {
    room_number: r.roomNumber,
    floor: r.floor,
    room_type: r.roomType,
    title: r.title,
    max_occupancy: r.maxOccupancy,
    cleanliness: r.cleanliness,
    is_occupied: r.isOccupied,
    current_booking_id: r.currentBookingId || null,
    notes: r.notes || null,
    updated_at: new Date().toISOString()
  };
}

export function mapRoomFromDB(row: any): RoomDefinition {
  return {
    roomNumber: row.room_number,
    floor: Number(row.floor) as 1 | 2,
    roomType: row.room_type,
    title: row.title,
    maxOccupancy: Number(row.max_occupancy),
    cleanliness: row.cleanliness,
    isOccupied: Boolean(row.is_occupied),
    currentBookingId: row.current_booking_id || undefined,
    notes: row.notes || undefined
  };
}

export function mapVehicleToDB(v: VehicleDefinition) {
  return {
    id: v.id,
    name: v.name,
    category: v.category,
    registration_number: v.registrationNumber,
    daily_rate: v.dailyRate,
    image: v.image,
    is_available: v.isAvailable,
    status: v.status,
    last_service_date: v.lastServiceDate || null,
    updated_at: new Date().toISOString()
  };
}

export function mapVehicleFromDB(row: any): VehicleDefinition {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    registrationNumber: row.registration_number,
    dailyRate: Number(row.daily_rate),
    image: row.image,
    isAvailable: Boolean(row.is_available),
    status: row.status,
    lastServiceDate: row.last_service_date || undefined
  };
}

export function mapDiningTableToDB(t: DiningTable) {
  return {
    id: t.id,
    name: t.name,
    section: t.section,
    capacity: t.capacity,
    is_occupied: t.isOccupied,
    current_booking_id: t.currentBookingId || null,
    updated_at: new Date().toISOString()
  };
}

export function mapDiningTableFromDB(row: any): DiningTable {
  return {
    id: row.id,
    name: row.name,
    section: row.section,
    capacity: Number(row.capacity),
    isOccupied: Boolean(row.is_occupied),
    currentBookingId: row.current_booking_id || undefined
  };
}

export function mapMaintenanceTicketToDB(m: MaintenanceTicket) {
  return {
    id: m.id,
    room_number: m.roomNumber || null,
    area: m.area,
    issue_title: m.issueTitle,
    description: m.description,
    priority: m.priority,
    status: m.status,
    reported_by: m.reportedBy,
    assigned_to: m.assignedTo || null,
    created_at: m.createdAt || new Date().toISOString(),
    resolved_at: m.resolvedAt || null
  };
}

export function mapMaintenanceTicketFromDB(row: any): MaintenanceTicket {
  return {
    id: row.id,
    roomNumber: row.room_number || undefined,
    area: row.area,
    issueTitle: row.issue_title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    reportedBy: row.reported_by,
    assignedTo: row.assigned_to || undefined,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at || undefined
  };
}

export function mapFolioToDB(f: GuestFolio) {
  return {
    id: f.id,
    guest_id: f.guestId,
    guest_name: f.guestName,
    guest_phone: f.guestPhone || null,
    guest_email: f.guestEmail || null,
    room_booking_id: f.roomBookingId || null,
    room_number: f.roomNumber || null,
    check_in: f.checkIn || null,
    check_out: f.checkOut || null,
    items: f.items || [],
    subtotal: f.subtotal,
    tax_amount: f.taxAmount,
    discount_amount: f.discountAmount || 0,
    grand_total: f.grandTotal,
    amount_paid: f.amountPaid,
    balance_due: f.balanceDue,
    status: f.status,
    created_at: f.createdAt || new Date().toISOString(),
    updated_at: f.updatedAt || new Date().toISOString()
  };
}

export function mapFolioFromDB(row: any): GuestFolio {
  return {
    id: row.id,
    guestId: row.guest_id,
    guestName: row.guest_name,
    guestPhone: row.guest_phone || '',
    guestEmail: row.guest_email || '',
    roomBookingId: row.room_booking_id || undefined,
    roomNumber: row.room_number || undefined,
    checkIn: row.check_in || undefined,
    checkOut: row.check_out || undefined,
    items: row.items || [],
    subtotal: Number(row.subtotal),
    taxAmount: Number(row.tax_amount),
    discountAmount: Number(row.discount_amount) || 0,
    grandTotal: Number(row.grand_total),
    amountPaid: Number(row.amount_paid),
    balanceDue: Number(row.balance_due),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function mapActivityLogToDB(l: ActivityLog) {
  return {
    id: l.id,
    timestamp: l.timestamp || new Date().toISOString(),
    type: l.type,
    action: l.action,
    title: l.title,
    description: l.description,
    guest_name: l.guestName || null,
    booking_id: l.bookingId || null,
    room_number: l.roomNumber || null
  };
}

export function mapActivityLogFromDB(row: any): ActivityLog {
  return {
    id: row.id,
    timestamp: row.timestamp,
    type: row.type,
    action: row.action,
    title: row.title,
    description: row.description,
    guestName: row.guest_name || undefined,
    bookingId: row.booking_id || undefined,
    roomNumber: row.room_number || undefined
  };
}

// ==========================================
// FULL STORE FETCH & SYNC REPOSITORY
// ==========================================

export async function fetchFullStoreFromSupabase(): Promise<CRMStoreData | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const [
      guestsRes,
      roomsRes,
      roomBookingsRes,
      vehiclesRes,
      vehicleBookingsRes,
      diningTablesRes,
      diningBookingsRes,
      maintenanceRes,
      foliosRes,
      logsRes,
      settingsRes,
      usersRes
    ] = await Promise.all([
      supabase.from('guests').select('*').order('created_at', { ascending: false }),
      supabase.from('rooms').select('*').order('room_number', { ascending: true }),
      supabase.from('room_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('vehicles').select('*'),
      supabase.from('vehicle_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('dining_tables').select('*'),
      supabase.from('dining_bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('maintenance_tickets').select('*').order('created_at', { ascending: false }),
      supabase.from('guest_folios').select('*').order('created_at', { ascending: false }),
      supabase.from('activity_logs').select('*').order('timestamp', { ascending: false }).limit(100),
      supabase.from('hotel_settings').select('*').eq('id', 'default').single(),
      supabase.from('crm_users').select('*').order('created_at', { ascending: true })
    ]);

    let settings: HotelSettings = {
      hotelName: 'Casa Paradiso',
      tagline: 'Boutique Luxury Heritage Hotel in Panaji, Goa',
      phone1: '+91 82081 45931',
      phone2: '+91 98812 47847',
      whatsapp: '919881247847',
      email: 'info@casaparadisohotel.in',
      address: 'Ghanekar Building, Rua José Falcão, Altinho, Panaji, Goa 403001',
      checkInTime: '1:00 PM',
      checkOutTime: '11:00 AM',
      roomPrices: {
        ac: { single: 1200, double: 1800, triple: 2000 },
        nonac: { single: 1200, double: 1500, triple: 800 }
      },
      vehiclePrices: {
        activa: 400,
        dio: 400,
        fascino: 400,
        swift: 1500,
        ertiga: 2500
      },
      taxRatePercent: 12,
      gstin: '30AAAAA0000A1Z5',
      currencySymbol: '₹',
      whatsappMessageTemplate: 'Dear {guest_name}, thank you for choosing Casa Paradiso, Panaji! Your reservation #{booking_id} is confirmed. We look forward to welcoming you.'
    };

    if (settingsRes.data) {
      const s = settingsRes.data;
      settings = {
        hotelName: s.hotel_name || settings.hotelName,
        tagline: s.tagline || settings.tagline,
        phone1: s.phone1 || settings.phone1,
        phone2: s.phone2 || settings.phone2,
        whatsapp: s.whatsapp || settings.whatsapp,
        email: s.email || settings.email,
        address: s.address || settings.address,
        checkInTime: s.check_in_time || settings.checkInTime,
        checkOutTime: s.check_out_time || settings.checkOutTime,
        roomPrices: s.room_prices || settings.roomPrices,
        vehiclePrices: s.vehicle_prices || settings.vehiclePrices,
        taxRatePercent: Number(s.tax_rate_percent) || settings.taxRatePercent,
        gstin: s.gstin || settings.gstin,
        currencySymbol: s.currency_symbol || settings.currencySymbol,
        whatsappMessageTemplate: s.whatsapp_message_template || settings.whatsappMessageTemplate
      };
    }

    const defaultAdminUser: CRMUser = {
      id: 'USR-ADMIN-1',
      name: 'General Manager',
      email: 'gm@casaparadisohotel.in',
      role: 'admin',
      pin: '1234',
      designation: 'Hotel General Manager',
      avatar: '👑',
      permissions: {
        dashboard: true,
        calendar: true,
        rooms: true,
        vehicles: true,
        dining: true,
        housekeeping: true,
        guests: true,
        billing: true,
        analytics: true,
        settings: true
      },
      createdAt: new Date().toISOString()
    };

    const users: CRMUser[] = (usersRes.data && usersRes.data.length > 0)
      ? usersRes.data.map(mapUserFromDB)
      : [defaultAdminUser];

    return {
      version: 2,
      settings,
      users,
      activeUserId: users[0]?.id || 'USR-ADMIN-1',
      guests: (guestsRes.data || []).map(mapGuestFromDB),
      rooms: (roomsRes.data || []).map(mapRoomFromDB),
      roomBookings: (roomBookingsRes.data || []).map(mapRoomBookingFromDB),
      vehicles: (vehiclesRes.data || []).map(mapVehicleFromDB),
      vehicleBookings: (vehicleBookingsRes.data || []).map(mapVehicleBookingFromDB),
      diningTables: (diningTablesRes.data || []).map(mapDiningTableFromDB),
      diningBookings: (diningBookingsRes.data || []).map(mapDiningBookingFromDB),
      maintenanceTickets: (maintenanceRes.data || []).map(mapMaintenanceTicketFromDB),
      folios: (foliosRes.data || []).map(mapFolioFromDB),
      activityLogs: (logsRes.data || []).map(mapActivityLogFromDB)
    };
  } catch (error) {
    console.error('Error fetching full CRM store from Supabase:', error);
    return null;
  }
}

// ==========================================
// ASYNC MUTATION PERSISTENCE TO SUPABASE
// ==========================================

export async function persistUserToSupabase(user: CRMUser) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('crm_users').upsert(mapUserToDB(user));
  } catch (e) {
    console.error('Failed to sync CRM user to Supabase:', e);
  }
}

export async function deleteUserFromSupabase(userId: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('crm_users').delete().eq('id', userId);
  } catch (e) {
    console.error('Failed to delete CRM user from Supabase:', e);
  }
}

export async function persistGuestToSupabase(guest: Guest) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('guests').upsert(mapGuestToDB(guest));
  } catch (e) {
    console.error('Failed to sync guest to Supabase:', e);
  }
}

export async function persistRoomBookingToSupabase(booking: RoomBooking) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('room_bookings').upsert(mapRoomBookingToDB(booking));
  } catch (e) {
    console.error('Failed to sync room booking to Supabase:', e);
  }
}

export async function persistVehicleBookingToSupabase(booking: VehicleBooking) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('vehicle_bookings').upsert(mapVehicleBookingToDB(booking));
  } catch (e) {
    console.error('Failed to sync vehicle booking to Supabase:', e);
  }
}

export async function persistDiningBookingToSupabase(booking: DiningBooking) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('dining_bookings').upsert(mapDiningBookingToDB(booking));
  } catch (e) {
    console.error('Failed to sync dining booking to Supabase:', e);
  }
}

export async function persistRoomToSupabase(room: RoomDefinition) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('rooms').upsert(mapRoomToDB(room));
  } catch (e) {
    console.error('Failed to sync room to Supabase:', e);
  }
}

export async function persistRoomsBatchToSupabase(rooms: RoomDefinition[]) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('rooms').upsert(rooms.map(mapRoomToDB));
  } catch (e) {
    console.error('Failed to sync rooms batch to Supabase:', e);
  }
}

export async function persistVehicleToSupabase(vehicle: VehicleDefinition) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('vehicles').upsert(mapVehicleToDB(vehicle));
  } catch (e) {
    console.error('Failed to sync vehicle to Supabase:', e);
  }
}

export async function persistDiningTableToSupabase(table: DiningTable) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('dining_tables').upsert(mapDiningTableToDB(table));
  } catch (e) {
    console.error('Failed to sync dining table to Supabase:', e);
  }
}

export async function persistMaintenanceTicketToSupabase(ticket: MaintenanceTicket) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('maintenance_tickets').upsert(mapMaintenanceTicketToDB(ticket));
  } catch (e) {
    console.error('Failed to sync maintenance ticket to Supabase:', e);
  }
}

export async function persistFolioToSupabase(folio: GuestFolio) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('guest_folios').upsert(mapFolioToDB(folio));
  } catch (e) {
    console.error('Failed to sync folio to Supabase:', e);
  }
}

export async function persistActivityLogToSupabase(log: ActivityLog) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('activity_logs').insert(mapActivityLogToDB(log));
  } catch (e) {
    console.error('Failed to sync activity log to Supabase:', e);
  }
}

export async function persistHotelSettingsToSupabase(settings: HotelSettings) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from('hotel_settings').upsert({
      id: 'default',
      hotel_name: settings.hotelName,
      tagline: settings.tagline,
      phone1: settings.phone1,
      phone2: settings.phone2,
      whatsapp: settings.whatsapp,
      email: settings.email,
      address: settings.address,
      check_in_time: settings.checkInTime,
      check_out_time: settings.checkOutTime,
      room_prices: settings.roomPrices,
      vehicle_prices: settings.vehiclePrices,
      tax_rate_percent: settings.taxRatePercent,
      gstin: settings.gstin,
      currency_symbol: settings.currencySymbol,
      whatsapp_message_template: settings.whatsappMessageTemplate,
      updated_at: new Date().toISOString()
    });
  } catch (e) {
    console.error('Failed to sync settings to Supabase:', e);
  }
}

export async function deleteRecordFromSupabase(tableName: string, id: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.from(tableName).delete().eq('id', id);
  } catch (e) {
    console.error(`Failed to delete ${id} from ${tableName} in Supabase:`, e);
  }
}

// ==========================================
// REALTIME SUBSCRIPTION LISTENER
// ==========================================

export function setupSupabaseRealtimeChannel(onUpdate: () => void): () => void {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  const channel = supabase
    .channel('crm_realtime_sync')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public' },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
