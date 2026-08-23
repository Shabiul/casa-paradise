'use client';

import {
  CRMStoreData,
  Guest,
  RoomBooking,
  VehicleBooking,
  DiningBooking,
  ActivityLog,
  HotelSettings,
  BookingStatus,
  VehicleBookingStatus,
  DiningBookingStatus,
  PaymentStatus,
  GuestTag
} from './types';

const STORAGE_KEY = 'casa_paradiso_crm_v2';
const SYNC_CHANNEL_NAME = 'casa_crm_channel';

export const defaultSettings: HotelSettings = {
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
  currencySymbol: '₹'
};

const initialDemoData: CRMStoreData = {
  version: 2,
  settings: defaultSettings,
  guests: [
    {
      id: 'GST-101',
      name: 'Aarav Singhania',
      email: 'aarav.singhania@gmail.com',
      phone: '+91 98201 44521',
      address: 'Bandra West, Mumbai',
      tags: ['VIP', 'Repeat Guest'],
      totalBookings: 3,
      totalSpent: 16400,
      notes: 'Prefers 2nd floor heritage view room with extra pillows. Vegetarian breakfast.',
      createdAt: '2026-07-15T10:30:00Z',
      lastVisit: '2026-08-10'
    },
    {
      id: 'GST-102',
      name: 'Pooja & Rohan Mehra',
      email: 'pooja.mehra@outlook.com',
      phone: '+91 98450 88219',
      address: 'Indiranagar, Bengaluru',
      tags: ['Honeymoon'],
      totalBookings: 2,
      totalSpent: 9600,
      notes: 'Honeymoon couple. Arrange complimentary Goan wine bottle on arrival.',
      createdAt: '2026-08-01T14:15:00Z',
      lastVisit: '2026-08-11'
    },
    {
      id: 'GST-103',
      name: 'Vikram Malhotra',
      email: 'v.malhotra@techcorp.in',
      phone: '+91 97110 33490',
      address: 'Cyber Hub, Gurugram',
      tags: ['Corporate', 'Long Stay'],
      totalBookings: 2,
      totalSpent: 14800,
      notes: 'Business traveler attending offshore conference. High-speed WiFi requested.',
      createdAt: '2026-08-05T09:00:00Z',
      lastVisit: '2026-08-12'
    },
    {
      id: 'GST-104',
      name: 'Elena Rostova',
      email: 'elena.rostova@travel.de',
      phone: '+49 176 5542109',
      address: 'Munich, Germany',
      tags: ['Repeat Guest'],
      totalBookings: 2,
      totalSpent: 7200,
      notes: 'Loves Fontainhas heritage architecture and Goan prawn curry.',
      createdAt: '2026-08-07T11:45:00Z',
      lastVisit: '2026-08-09'
    }
  ],
  roomBookings: [
    {
      id: 'CP-RM-1041',
      guestId: 'GST-101',
      guestName: 'Aarav Singhania',
      guestPhone: '+91 98201 44521',
      guestEmail: 'aarav.singhania@gmail.com',
      roomType: 'ac',
      roomTitle: 'Paradise AC Suite',
      occupancy: 'double',
      checkIn: '2026-08-11',
      checkOut: '2026-08-14',
      nights: 3,
      baseRate: 1800,
      totalPrice: 5400,
      status: 'checked_in',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      roomNumber: 'Suite 204',
      specialRequests: 'Upper floor, late check-out at 1:00 PM if possible.',
      staffNotes: 'Checked in at 2:15 PM. Provided with room key 204.',
      createdAt: '2026-08-08T15:20:00Z',
      updatedAt: '2026-08-11T14:15:00Z'
    },
    {
      id: 'CP-RM-1042',
      guestId: 'GST-102',
      guestName: 'Pooja & Rohan Mehra',
      guestPhone: '+91 98450 88219',
      guestEmail: 'pooja.mehra@outlook.com',
      roomType: 'ac',
      roomTitle: 'Paradise AC Suite',
      occupancy: 'double',
      checkIn: '2026-08-12',
      checkOut: '2026-08-15',
      nights: 3,
      baseRate: 1800,
      totalPrice: 5400,
      status: 'confirmed',
      paymentStatus: 'advance_paid',
      paymentMethod: 'online',
      roomNumber: 'Suite 201',
      specialRequests: 'Flower bouquet and quiet corner room.',
      staffNotes: 'Advance payment of ₹2,000 received via UPI.',
      createdAt: '2026-08-09T18:40:00Z',
      updatedAt: '2026-08-10T10:00:00Z'
    },
    {
      id: 'CP-RM-1043',
      guestId: 'GST-103',
      guestName: 'Vikram Malhotra',
      guestPhone: '+91 97110 33490',
      guestEmail: 'v.malhotra@techcorp.in',
      roomType: 'nonac',
      roomTitle: 'Heritage Non-AC Room',
      occupancy: 'single',
      checkIn: '2026-08-13',
      checkOut: '2026-08-17',
      nights: 4,
      baseRate: 1200,
      totalPrice: 4800,
      status: 'pending',
      paymentStatus: 'unpaid',
      roomNumber: 'Room 102',
      specialRequests: 'Quiet room for remote work and early morning taxi booking.',
      staffNotes: 'Guest inquired via website booking form. Follow-up WhatsApp sent.',
      createdAt: '2026-08-11T12:10:00Z',
      updatedAt: '2026-08-11T12:10:00Z'
    }
  ],
  vehicleBookings: [
    {
      id: 'CP-VH-2081',
      guestId: 'GST-101',
      guestName: 'Aarav Singhania',
      guestPhone: '+91 98201 44521',
      guestEmail: 'aarav.singhania@gmail.com',
      vehicleId: 'activa',
      vehicleName: 'Honda Activa',
      vehicleCategory: '2-wheeler',
      vehicleImage: '/activa.png',
      pickupDate: '2026-08-11',
      returnDate: '2026-08-14',
      days: 3,
      dailyRate: 400,
      totalPrice: 1200,
      status: 'handed_over',
      paymentStatus: 'paid',
      helmetCount: 2,
      depositAmount: 500,
      licenseNumber: 'MH02 2018004921',
      hotelDelivery: true,
      specialRequests: 'Both helmets with clean visors.',
      staffNotes: 'Scooter keys and 2 helmets handed over at hotel reception.',
      createdAt: '2026-08-11T08:30:00Z',
      updatedAt: '2026-08-11T09:00:00Z'
    },
    {
      id: 'CP-VH-2082',
      guestId: 'GST-104',
      guestName: 'Elena Rostova',
      guestPhone: '+49 176 5542109',
      guestEmail: 'elena.rostova@travel.de',
      vehicleId: 'swift',
      vehicleName: 'Maruti Suzuki Swift',
      vehicleCategory: '4-wheeler',
      vehicleImage: '/WhatsApp Image 2026-08-11 at 6.56.54 PM.jpeg',
      pickupDate: '2026-08-12',
      returnDate: '2026-08-14',
      days: 2,
      dailyRate: 1500,
      totalPrice: 3000,
      status: 'confirmed',
      paymentStatus: 'advance_paid',
      depositAmount: 2000,
      hotelDelivery: true,
      specialRequests: 'Automatic hatchback if available, airport delivery.',
      staffNotes: 'Car assigned. Cleaned and fueled.',
      createdAt: '2026-08-10T16:20:00Z',
      updatedAt: '2026-08-10T16:20:00Z'
    }
  ],
  diningBookings: [
    {
      id: 'CP-DN-3091',
      guestId: 'GST-101',
      guestName: 'Aarav Singhania',
      guestPhone: '+91 98201 44521',
      guestEmail: 'aarav.singhania@gmail.com',
      date: '2026-08-11',
      timeSlot: 'Dinner (7:30 PM - 11:00 PM)',
      partySize: 2,
      dietaryPreferences: 'Vegetarian, Mild spice',
      specialRequests: 'Candlelight table by the courtyard window.',
      tableNumber: 'Table T-4',
      status: 'confirmed',
      staffNotes: 'Courtyard window table reserved.',
      createdAt: '2026-08-11T11:00:00Z',
      updatedAt: '2026-08-11T11:00:00Z'
    },
    {
      id: 'CP-DN-3092',
      guestId: 'GST-102',
      guestName: 'Pooja & Rohan Mehra',
      guestPhone: '+91 98450 88219',
      guestEmail: 'pooja.mehra@outlook.com',
      date: '2026-08-12',
      timeSlot: 'Dinner (7:30 PM - 11:00 PM)',
      partySize: 2,
      dietaryPreferences: 'Goan Seafood Special (Kingfish / Prawns)',
      specialRequests: 'Anniversary celebration. Dessert with sparkle candle.',
      tableNumber: 'Table T-7 (Balcony)',
      status: 'confirmed',
      staffNotes: 'Chef informed about complimentary anniversary dessert.',
      createdAt: '2026-08-10T14:30:00Z',
      updatedAt: '2026-08-10T14:30:00Z'
    }
  ],
  activityLogs: [
    {
      id: 'LOG-1',
      timestamp: '2026-08-11T14:15:00Z',
      type: 'room',
      action: 'status_changed',
      title: 'Guest Checked In',
      description: 'Aarav Singhania checked into Paradise AC Suite (Suite 204).',
      guestName: 'Aarav Singhania',
      bookingId: 'CP-RM-1041'
    },
    {
      id: 'LOG-2',
      timestamp: '2026-08-11T12:10:00Z',
      type: 'room',
      action: 'created',
      title: 'New Room Booking Request',
      description: 'Vikram Malhotra submitted booking request for Heritage Non-AC Room.',
      guestName: 'Vikram Malhotra',
      bookingId: 'CP-RM-1043'
    },
    {
      id: 'LOG-3',
      timestamp: '2026-08-11T11:00:00Z',
      type: 'dining',
      action: 'created',
      title: 'New Table Reservation',
      description: 'Aarav Singhania reserved Dinner Table for 2 guests.',
      guestName: 'Aarav Singhania',
      bookingId: 'CP-DN-3091'
    },
    {
      id: 'LOG-4',
      timestamp: '2026-08-11T09:00:00Z',
      type: 'vehicle',
      action: 'status_changed',
      title: 'Vehicle Handed Over',
      description: 'Honda Activa handed over to Aarav Singhania (3 Days rental).',
      guestName: 'Aarav Singhania',
      bookingId: 'CP-VH-2081'
    }
  ]
};

// Cross-tab broadcast helper
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel error', e);
  }
}

function notifySubscribers() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('casa_crm_updated'));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'DATA_UPDATED', time: Date.now() });
    }
  }
}

// Read store
export function getCRMStore(): CRMStoreData {
  if (typeof window === 'undefined') return initialDemoData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDemoData));
      return initialDemoData;
    }
    const parsed: CRMStoreData = JSON.parse(raw);
    // Merge settings in case new fields were added
    if (!parsed.settings || parsed.version !== initialDemoData.version) {
      parsed.settings = { ...defaultSettings, ...(parsed.settings || {}) };
      parsed.version = initialDemoData.version;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error('Error reading CRM store', e);
    return initialDemoData;
  }
}

// Save store
function saveCRMStore(data: CRMStoreData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    notifySubscribers();
  } catch (e) {
    console.error('Error saving CRM store', e);
  }
}

// Helper to find or create a guest record
function getOrCreateGuest(
  store: CRMStoreData,
  name: string,
  email: string,
  phone: string,
  amountSpent: number,
  notes?: string
): { guest: Guest; updatedGuests: Guest[] } {
  const cleanPhone = phone.trim();
  const cleanEmail = email.trim().toLowerCase();

  let existing = store.guests.find(
    g => (cleanPhone && g.phone === cleanPhone) || (cleanEmail && g.email.toLowerCase() === cleanEmail)
  );

  let updatedGuests = [...store.guests];

  if (existing) {
    existing = {
      ...existing,
      name: name || existing.name,
      email: cleanEmail || existing.email,
      phone: cleanPhone || existing.phone,
      totalBookings: existing.totalBookings + 1,
      totalSpent: existing.totalSpent + amountSpent,
      lastVisit: new Date().toISOString().split('T')[0],
      notes: notes ? `${existing.notes ? existing.notes + ' | ' : ''}${notes}` : existing.notes
    };
    // If repeat guest, add tag
    if (existing.totalBookings >= 2 && !existing.tags.includes('Repeat Guest')) {
      existing.tags.push('Repeat Guest');
    }
    updatedGuests = updatedGuests.map(g => (g.id === existing!.id ? existing! : g));
    return { guest: existing, updatedGuests };
  } else {
    const newGuest: Guest = {
      id: `GST-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      tags: [],
      totalBookings: 1,
      totalSpent: amountSpent,
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toISOString().split('T')[0],
      notes: notes || undefined
    };
    updatedGuests.unshift(newGuest);
    return { guest: newGuest, updatedGuests };
  }
}

// 1. Create Room Booking
export function createRoomBooking(payload: {
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
}): RoomBooking {
  const store = getCRMStore();
  const id = `CP-RM-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const { guest, updatedGuests } = getOrCreateGuest(
    store,
    payload.guestName,
    payload.guestEmail,
    payload.guestPhone,
    payload.totalPrice,
    payload.specialRequests
  );

  const roomTitle = payload.roomType === 'ac' ? 'Paradise AC Suite' : 'Heritage Non-AC Room';

  const newBooking: RoomBooking = {
    id,
    guestId: guest.id,
    guestName: payload.guestName.trim(),
    guestPhone: payload.guestPhone.trim(),
    guestEmail: payload.guestEmail.trim(),
    roomType: payload.roomType,
    roomTitle,
    occupancy: payload.occupancy,
    checkIn: payload.checkIn,
    checkOut: payload.checkOut,
    nights: payload.nights,
    baseRate: payload.baseRate,
    totalPrice: payload.totalPrice,
    status: 'pending',
    paymentStatus: 'unpaid',
    specialRequests: payload.specialRequests,
    createdAt: now,
    updatedAt: now
  };

  const newLog: ActivityLog = {
    id: `LOG-${Date.now()}`,
    timestamp: now,
    type: 'room',
    action: 'created',
    title: 'New Room Booking',
    description: `${payload.guestName} booked ${roomTitle} (${payload.nights} night${payload.nights > 1 ? 's' : ''}) for ₹${payload.totalPrice.toLocaleString('en-IN')}`,
    guestName: payload.guestName,
    bookingId: id
  };

  const updatedStore: CRMStoreData = {
    ...store,
    guests: updatedGuests,
    roomBookings: [newBooking, ...store.roomBookings],
    activityLogs: [newLog, ...store.activityLogs]
  };

  saveCRMStore(updatedStore);
  return newBooking;
}

// 2. Create Vehicle Booking
export function createVehicleBooking(payload: {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: '2-wheeler' | '4-wheeler';
  vehicleImage: string;
  pickupDate: string;
  returnDate: string;
  days: number;
  dailyRate: number;
  totalPrice: number;
  helmetCount?: number;
  hotelDelivery?: boolean;
  specialRequests?: string;
}): VehicleBooking {
  const store = getCRMStore();
  const id = `CP-VH-${Math.floor(2000 + Math.random() * 8000)}`;
  const now = new Date().toISOString();

  const { guest, updatedGuests } = getOrCreateGuest(
    store,
    payload.guestName,
    payload.guestEmail,
    payload.guestPhone,
    payload.totalPrice,
    `Vehicle: ${payload.vehicleName}`
  );

  const newBooking: VehicleBooking = {
    id,
    guestId: guest.id,
    guestName: payload.guestName.trim(),
    guestPhone: payload.guestPhone.trim(),
    guestEmail: payload.guestEmail.trim(),
    vehicleId: payload.vehicleId,
    vehicleName: payload.vehicleName,
    vehicleCategory: payload.vehicleCategory,
    vehicleImage: payload.vehicleImage,
    pickupDate: payload.pickupDate,
    returnDate: payload.returnDate,
    days: payload.days,
    dailyRate: payload.dailyRate,
    totalPrice: payload.totalPrice,
    status: 'pending',
    paymentStatus: 'unpaid',
    helmetCount: payload.helmetCount || 2,
    hotelDelivery: payload.hotelDelivery ?? true,
    specialRequests: payload.specialRequests,
    createdAt: now,
    updatedAt: now
  };

  const newLog: ActivityLog = {
    id: `LOG-${Date.now()}`,
    timestamp: now,
    type: 'vehicle',
    action: 'created',
    title: 'New Vehicle Rental',
    description: `${payload.guestName} booked ${payload.vehicleName} for ${payload.days} day${payload.days > 1 ? 's' : ''} (₹${payload.totalPrice.toLocaleString('en-IN')})`,
    guestName: payload.guestName,
    bookingId: id
  };

  const updatedStore: CRMStoreData = {
    ...store,
    guests: updatedGuests,
    vehicleBookings: [newBooking, ...store.vehicleBookings],
    activityLogs: [newLog, ...store.activityLogs]
  };

  saveCRMStore(updatedStore);
  return newBooking;
}

// 3. Create Dining Booking
export function createDiningBooking(payload: {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  date: string;
  timeSlot: string;
  partySize: number;
  dietaryPreferences?: string;
  specialRequests?: string;
}): DiningBooking {
  const store = getCRMStore();
  const id = `CP-DN-${Math.floor(3000 + Math.random() * 7000)}`;
  const now = new Date().toISOString();

  const { guest, updatedGuests } = getOrCreateGuest(
    store,
    payload.guestName,
    payload.guestEmail,
    payload.guestPhone,
    0,
    `Dining reservation: ${payload.timeSlot}`
  );

  const newBooking: DiningBooking = {
    id,
    guestId: guest.id,
    guestName: payload.guestName.trim(),
    guestPhone: payload.guestPhone.trim(),
    guestEmail: payload.guestEmail.trim(),
    date: payload.date,
    timeSlot: payload.timeSlot,
    partySize: payload.partySize,
    dietaryPreferences: payload.dietaryPreferences,
    specialRequests: payload.specialRequests,
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };

  const newLog: ActivityLog = {
    id: `LOG-${Date.now()}`,
    timestamp: now,
    type: 'dining',
    action: 'created',
    title: 'New Dining Reservation',
    description: `${payload.guestName} reserved a table for ${payload.partySize} guest${payload.partySize > 1 ? 's' : ''} on ${payload.date} (${payload.timeSlot})`,
    guestName: payload.guestName,
    bookingId: id
  };

  const updatedStore: CRMStoreData = {
    ...store,
    guests: updatedGuests,
    diningBookings: [newBooking, ...store.diningBookings],
    activityLogs: [newLog, ...store.activityLogs]
  };

  saveCRMStore(updatedStore);
  return newBooking;
}

// 4. Update Room Booking
export function updateRoomBooking(
  id: string,
  updates: Partial<RoomBooking>
): RoomBooking | null {
  const store = getCRMStore();
  const index = store.roomBookings.findIndex(b => b.id === id);
  if (index === -1) return null;

  const current = store.roomBookings[index];
  const updated: RoomBooking = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const updatedList = [...store.roomBookings];
  updatedList[index] = updated;

  // Add log if status changed
  const logs = [...store.activityLogs];
  if (updates.status && updates.status !== current.status) {
    logs.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'room',
      action: 'status_changed',
      title: `Room Status: ${updates.status.toUpperCase()}`,
      description: `${current.guestName} (${current.id}) status updated to ${updates.status}`,
      guestName: current.guestName,
      bookingId: id
    });
  }

  saveCRMStore({
    ...store,
    roomBookings: updatedList,
    activityLogs: logs
  });

  return updated;
}

// 5. Update Vehicle Booking
export function updateVehicleBooking(
  id: string,
  updates: Partial<VehicleBooking>
): VehicleBooking | null {
  const store = getCRMStore();
  const index = store.vehicleBookings.findIndex(b => b.id === id);
  if (index === -1) return null;

  const current = store.vehicleBookings[index];
  const updated: VehicleBooking = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const updatedList = [...store.vehicleBookings];
  updatedList[index] = updated;

  const logs = [...store.activityLogs];
  if (updates.status && updates.status !== current.status) {
    logs.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'vehicle',
      action: 'status_changed',
      title: `Vehicle Status: ${updates.status.toUpperCase()}`,
      description: `${current.guestName}'s ${current.vehicleName} status updated to ${updates.status}`,
      guestName: current.guestName,
      bookingId: id
    });
  }

  saveCRMStore({
    ...store,
    vehicleBookings: updatedList,
    activityLogs: logs
  });

  return updated;
}

// 6. Update Dining Booking
export function updateDiningBooking(
  id: string,
  updates: Partial<DiningBooking>
): DiningBooking | null {
  const store = getCRMStore();
  const index = store.diningBookings.findIndex(b => b.id === id);
  if (index === -1) return null;

  const current = store.diningBookings[index];
  const updated: DiningBooking = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const updatedList = [...store.diningBookings];
  updatedList[index] = updated;

  const logs = [...store.activityLogs];
  if (updates.status && updates.status !== current.status) {
    logs.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'dining',
      action: 'status_changed',
      title: `Dining Status: ${updates.status.toUpperCase()}`,
      description: `${current.guestName}'s table reservation status updated to ${updates.status}`,
      guestName: current.guestName,
      bookingId: id
    });
  }

  saveCRMStore({
    ...store,
    diningBookings: updatedList,
    activityLogs: logs
  });

  return updated;
}

// 7. Update Guest Profile
export function updateGuest(guestId: string, updates: Partial<Guest>): Guest | null {
  const store = getCRMStore();
  const index = store.guests.findIndex(g => g.id === guestId);
  if (index === -1) return null;

  const current = store.guests[index];
  const updated: Guest = { ...current, ...updates };

  const updatedGuests = [...store.guests];
  updatedGuests[index] = updated;

  saveCRMStore({
    ...store,
    guests: updatedGuests
  });

  return updated;
}

// 8. Delete Booking
export function deleteBooking(type: 'room' | 'vehicle' | 'dining', id: string): boolean {
  const store = getCRMStore();
  let updatedStore: CRMStoreData = { ...store };

  if (type === 'room') {
    updatedStore.roomBookings = store.roomBookings.filter(b => b.id !== id);
  } else if (type === 'vehicle') {
    updatedStore.vehicleBookings = store.vehicleBookings.filter(b => b.id !== id);
  } else if (type === 'dining') {
    updatedStore.diningBookings = store.diningBookings.filter(b => b.id !== id);
  }

  saveCRMStore(updatedStore);
  return true;
}

// 9. Update Settings
export function updateHotelSettings(newSettings: Partial<HotelSettings>): HotelSettings {
  const store = getCRMStore();
  const updatedSettings: HotelSettings = {
    ...store.settings,
    ...newSettings
  };

  saveCRMStore({
    ...store,
    settings: updatedSettings
  });

  return updatedSettings;
}

// 10. Reset Demo Data
export function resetCRMData(): void {
  saveCRMStore(initialDemoData);
}

// 11. React hook / subscription helper for real-time reactivity
export function subscribeToCRM(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = () => callback();
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };

  window.addEventListener('casa_crm_updated', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  let handleBroadcast: ((e: MessageEvent) => void) | null = null;
  if (broadcastChannel) {
    handleBroadcast = () => callback();
    broadcastChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    window.removeEventListener('casa_crm_updated', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (broadcastChannel && handleBroadcast) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
  };
}
