'use client';

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
  CleanlinessStatus,
  GuestTag,
  BookingStatus,
  VehicleBookingStatus,
  DiningBookingStatus,
  PaymentStatus,
  PaymentMethod,
  CRMUser,
  CRMUserRole,
  StaffPermissions
} from './types';

import { isSupabaseConfigured } from './supabaseClient';
import {
  fetchFullStoreFromSupabase,
  persistUserToSupabase,
  deleteUserFromSupabase,
  persistGuestToSupabase,
  persistRoomBookingToSupabase,
  persistVehicleBookingToSupabase,
  persistDiningBookingToSupabase,
  persistRoomToSupabase,
  persistRoomsBatchToSupabase,
  persistVehicleToSupabase,
  persistDiningTableToSupabase,
  persistMaintenanceTicketToSupabase,
  persistFolioToSupabase,
  persistActivityLogToSupabase,
  persistHotelSettingsToSupabase,
  deleteRecordFromSupabase,
  setupSupabaseRealtimeChannel
} from './supabaseService';

export const STORAGE_KEY = 'casa_paradiso_crm_v2';
export const SYNC_CHANNEL_NAME = 'casa_crm_channel';

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
  gstin: '30AAAAA0000A1Z5',
  currencySymbol: '₹',
  whatsappMessageTemplate: 'Dear {guest_name}, thank you for choosing Casa Paradiso, Panaji! Your reservation #{booking_id} is confirmed. We look forward to welcoming you.'
};

export const initialRooms: RoomDefinition[] = [
  // Floor 1
  { roomNumber: '101', floor: 1, roomType: 'ac', title: 'Paradise AC Suite (Garden View)', maxOccupancy: 3, cleanliness: 'clean', isOccupied: false },
  { roomNumber: '102', floor: 1, roomType: 'ac', title: 'Paradise AC Suite', maxOccupancy: 3, cleanliness: 'clean', isOccupied: false },
  { roomNumber: '103', floor: 1, roomType: 'ac', title: 'Paradise AC Suite', maxOccupancy: 3, cleanliness: 'clean', isOccupied: false },
  { roomNumber: '104', floor: 1, roomType: 'ac', title: 'Paradise AC Suite (Courtyard)', maxOccupancy: 3, cleanliness: 'clean', isOccupied: true, currentBookingId: 'CP-RM-1041' },
  { roomNumber: '105', floor: 1, roomType: 'nonac', title: 'Heritage Non-AC Room', maxOccupancy: 2, cleanliness: 'dirty', isOccupied: false, notes: 'Housekeeping requested fresh linens' },
  { roomNumber: '106', floor: 1, roomType: 'nonac', title: 'Heritage Non-AC Room', maxOccupancy: 2, cleanliness: 'clean', isOccupied: false },
  { roomNumber: '107', floor: 1, roomType: 'nonac', title: 'Heritage Non-AC Room', maxOccupancy: 3, cleanliness: 'clean', isOccupied: false },
  { roomNumber: '108', floor: 1, roomType: 'nonac', title: 'Heritage Non-AC Room', maxOccupancy: 2, cleanliness: 'inspected', isOccupied: false },
  // Floor 2
  { roomNumber: '201', floor: 2, roomType: 'ac', title: 'Paradise AC Suite with Balcony', maxOccupancy: 3, cleanliness: 'clean', isOccupied: true, currentBookingId: 'CP-RM-1042' },
  { roomNumber: '202', floor: 2, roomType: 'ac', title: 'Paradise AC Suite with Balcony', maxOccupancy: 3, cleanliness: 'cleaning_in_progress', isOccupied: false },
  { roomNumber: '203', floor: 2, roomType: 'ac', title: 'Paradise AC Suite (Altinho Hill View)', maxOccupancy: 3, cleanliness: 'clean', isOccupied: false },
  { roomNumber: '204', floor: 2, roomType: 'ac', title: 'Paradise AC Suite (Altinho Hill View)', maxOccupancy: 3, cleanliness: 'clean', isOccupied: true, currentBookingId: 'CP-RM-1044' },
  { roomNumber: '205', floor: 2, roomType: 'ac', title: 'Paradise AC Suite', maxOccupancy: 3, cleanliness: 'clean', isOccupied: false },
  { roomNumber: '206', floor: 2, roomType: 'ac', title: 'Paradise AC Suite', maxOccupancy: 3, cleanliness: 'out_of_order', isOccupied: false, notes: 'AC compressor scheduled for servicing' },
  { roomNumber: '207', floor: 2, roomType: 'nonac', title: 'Heritage Non-AC Room', maxOccupancy: 2, cleanliness: 'clean', isOccupied: false },
  { roomNumber: '208', floor: 2, roomType: 'nonac', title: 'Heritage Non-AC Room', maxOccupancy: 3, cleanliness: 'clean', isOccupied: false },
  { roomNumber: '209', floor: 2, roomType: 'nonac', title: 'Heritage Non-AC Room', maxOccupancy: 2, cleanliness: 'clean', isOccupied: false },
  { roomNumber: '210', floor: 2, roomType: 'nonac', title: 'Heritage Non-AC Room', maxOccupancy: 2, cleanliness: 'clean', isOccupied: false }
];

export const initialVehicles: VehicleDefinition[] = [
  { id: 'activa', name: 'Honda Activa 6G', category: '2-wheeler', registrationNumber: 'GA-07-AB-4192', dailyRate: 400, image: '/activa.png', isAvailable: false, status: 'rented' },
  { id: 'dio', name: 'Honda Dio 110', category: '2-wheeler', registrationNumber: 'GA-07-CD-8812', dailyRate: 400, image: '/WhatsApp_Image_2026-08-11_at_6.56.54_PM__2_-removebg-preview.png', isAvailable: true, status: 'available' },
  { id: 'fascino', name: 'Yamaha Fascino 125', category: '2-wheeler', registrationNumber: 'GA-07-EF-9921', dailyRate: 400, image: '/fasc.png', isAvailable: true, status: 'available' },
  { id: 'swift', name: 'Maruti Suzuki Swift VXi', category: '4-wheeler', registrationNumber: 'GA-07-GH-1234', dailyRate: 1500, image: '/WhatsApp Image 2026-08-11 at 6.56.54 PM.jpeg', isAvailable: false, status: 'rented' },
  { id: 'ertiga', name: 'Maruti Suzuki Ertiga 7-Seater', category: '4-wheeler', registrationNumber: 'GA-07-JK-5678', dailyRate: 2500, image: '/WhatsApp Image 2026-08-11 at 6.56.53 PM (1).jpeg', isAvailable: true, status: 'available' }
];

export const initialDiningTables: DiningTable[] = [
  { id: 'T-1', name: 'Table 1', section: 'Main Heritage Hall', capacity: 4, isOccupied: false },
  { id: 'T-2', name: 'Table 2', section: 'Main Heritage Hall', capacity: 4, isOccupied: false },
  { id: 'T-3', name: 'Table 3', section: 'Main Heritage Hall', capacity: 2, isOccupied: false },
  { id: 'T-4', name: 'Table 4', section: 'Main Heritage Hall', capacity: 6, isOccupied: false },
  { id: 'T-5', name: 'Table 5 (Garden Gazebo)', section: 'Garden Courtyard', capacity: 4, isOccupied: false },
  { id: 'T-6', name: 'Table 6 (Fountain Side)', section: 'Garden Courtyard', capacity: 2, isOccupied: false },
  { id: 'T-7', name: 'Table 7 (Balcony Sunset)', section: 'Balcony', capacity: 2, isOccupied: true, currentBookingId: 'CP-DN-3091' },
  { id: 'T-8', name: 'Table 8 (Balcony Altinho View)', section: 'Balcony', capacity: 4, isOccupied: false },
  { id: 'T-9', name: 'Table 9 (Private Alcove)', section: 'Private Lounge', capacity: 6, isOccupied: false },
  { id: 'T-10', name: 'Table 10 (Executive Table)', section: 'Private Lounge', capacity: 8, isOccupied: false }
];

export const initialGuests: Guest[] = [
  {
    id: 'GST-101',
    name: 'Aarav Singhania',
    email: 'aarav.singhania@gmail.com',
    phone: '+91 98201 44521',
    address: 'Bandra West, Mumbai',
    idProofType: 'Aadhaar',
    idProofNumber: 'XXXX-XXXX-9281',
    nationality: 'Indian',
    tags: ['VIP', 'Repeat Guest'],
    totalBookings: 3,
    totalSpent: 16400,
    notes: 'Prefers 2nd floor heritage view room with extra pillows. Vegetarian breakfast.',
    createdAt: '2026-07-15T10:30:00Z',
    lastVisit: '2026-08-11'
  },
  {
    id: 'GST-102',
    name: 'Pooja & Rohan Mehra',
    email: 'pooja.mehra@outlook.com',
    phone: '+91 98450 88219',
    address: 'Indiranagar, Bengaluru',
    idProofType: 'Passport',
    idProofNumber: 'Z8192041',
    nationality: 'Indian',
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
    idProofType: 'Driving License',
    idProofNumber: 'DL-04-2018-09123',
    nationality: 'Indian',
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
    idProofType: 'Passport',
    idProofNumber: 'DE-9920194',
    nationality: 'German',
    tags: ['Repeat Guest'],
    totalBookings: 2,
    totalSpent: 7200,
    notes: 'Loves Fontainhas heritage architecture and Goan prawn curry.',
    createdAt: '2026-08-07T11:45:00Z',
    lastVisit: '2026-08-09'
  }
];

export const initialRoomBookings: RoomBooking[] = [
  {
    id: 'CP-RM-1041',
    guestId: 'GST-101',
    guestName: 'Aarav Singhania',
    guestPhone: '+91 98201 44521',
    guestEmail: 'aarav.singhania@gmail.com',
    roomType: 'ac',
    roomTitle: 'Paradise AC Suite',
    occupancy: 'double',
    checkIn: '2026-08-10',
    checkOut: '2026-08-13',
    nights: 3,
    baseRate: 1800,
    totalPrice: 5400,
    status: 'checked_in',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    roomNumber: '104',
    specialRequests: 'Quiet room facing courtyard, extra pillows',
    staffNotes: 'VIP guest checked in by Manager Desk. Given room 104 key card.',
    createdAt: '2026-08-08T10:00:00Z',
    updatedAt: '2026-08-10T13:30:00Z'
  },
  {
    id: 'CP-RM-1042',
    guestId: 'GST-102',
    guestName: 'Pooja & Rohan Mehra',
    guestPhone: '+91 98450 88219',
    guestEmail: 'pooja.mehra@outlook.com',
    roomType: 'ac',
    roomTitle: 'Paradise AC Suite with Balcony',
    occupancy: 'double',
    checkIn: '2026-08-11',
    checkOut: '2026-08-14',
    nights: 3,
    baseRate: 1800,
    totalPrice: 5400,
    status: 'checked_in',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    roomNumber: '201',
    specialRequests: 'Honeymoon room decoration with rose petals & Goan wine',
    staffNotes: 'Complimentary wine bottle delivered to Suite 201.',
    createdAt: '2026-08-09T16:20:00Z',
    updatedAt: '2026-08-11T14:00:00Z'
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
    checkIn: '2026-08-12',
    checkOut: '2026-08-16',
    nights: 4,
    baseRate: 1200,
    totalPrice: 4800,
    status: 'confirmed',
    paymentStatus: 'advance_paid',
    paymentMethod: 'online',
    advanceAmount: 2000,
    roomNumber: '106',
    specialRequests: 'Work desk near window with high-speed internet',
    staffNotes: 'Advance of ₹2,000 received via Razorpay. Balance ₹2,800 due at check-in.',
    createdAt: '2026-08-11T12:10:00Z',
    updatedAt: '2026-08-11T12:10:00Z'
  },
  {
    id: 'CP-RM-1044',
    guestId: 'GST-104',
    guestName: 'Elena Rostova',
    guestPhone: '+49 176 5542109',
    guestEmail: 'elena.rostova@travel.de',
    roomType: 'ac',
    roomTitle: 'Paradise AC Suite (Altinho Hill View)',
    occupancy: 'single',
    checkIn: '2026-08-11',
    checkOut: '2026-08-13',
    nights: 2,
    baseRate: 1200,
    totalPrice: 2400,
    status: 'checked_in',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    roomNumber: '204',
    specialRequests: 'Top floor room overlooking Altinho tree-canopy',
    staffNotes: 'Passport verified upon check-in.',
    createdAt: '2026-08-09T08:30:00Z',
    updatedAt: '2026-08-11T15:00:00Z'
  }
];

export const initialVehicleBookings: VehicleBooking[] = [
  {
    id: 'CP-VH-2081',
    guestId: 'GST-101',
    guestName: 'Aarav Singhania',
    guestPhone: '+91 98201 44521',
    guestEmail: 'aarav.singhania@gmail.com',
    vehicleId: 'activa',
    vehicleName: 'Honda Activa 6G',
    vehicleCategory: '2-wheeler',
    vehicleImage: '/activa.png',
    registrationNumber: 'GA-07-AB-4192',
    pickupDate: '2026-08-10',
    returnDate: '2026-08-13',
    days: 3,
    dailyRate: 400,
    totalPrice: 1200,
    status: 'handed_over',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    licenseNumber: 'MH-02-2016-77881',
    helmetCount: 2,
    depositAmount: 1000,
    hotelDelivery: true,
    fuelLevelOnPickup: 'Full',
    specialRequests: 'Two clean full-face helmets requested',
    staffNotes: 'Vehicle keys and 2 helmets given. ₹1000 security deposit in safe.',
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-10T09:00:00Z'
  },
  {
    id: 'CP-VH-2082',
    guestId: 'GST-102',
    guestName: 'Pooja & Rohan Mehra',
    guestPhone: '+91 98450 88219',
    guestEmail: 'pooja.mehra@outlook.com',
    vehicleId: 'swift',
    vehicleName: 'Maruti Suzuki Swift VXi',
    vehicleCategory: '4-wheeler',
    vehicleImage: '/WhatsApp Image 2026-08-11 at 6.56.54 PM.jpeg',
    registrationNumber: 'GA-07-GH-1234',
    pickupDate: '2026-08-11',
    returnDate: '2026-08-13',
    days: 2,
    dailyRate: 1500,
    totalPrice: 3000,
    status: 'handed_over',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    licenseNumber: 'KA-05-2019-11204',
    depositAmount: 3000,
    hotelDelivery: true,
    fuelLevelOnPickup: 'Full',
    specialRequests: 'Car with chilled AC for South Goa heritage church tour',
    staffNotes: 'Handover complete. Chilled AC confirmed, fuel full.',
    createdAt: '2026-08-11T10:30:00Z',
    updatedAt: '2026-08-11T10:30:00Z'
  }
];

export const initialDiningBookings: DiningBooking[] = [
  {
    id: 'CP-DN-3091',
    guestId: 'GST-101',
    guestName: 'Aarav Singhania',
    guestPhone: '+91 98201 44521',
    guestEmail: 'aarav.singhania@gmail.com',
    date: '2026-08-11',
    timeSlot: 'Dinner (7:30 PM - 11:00 PM)',
    partySize: 2,
    dietaryPreferences: 'Goan Seafood Special (Kingfish / Prawns)',
    specialRequests: 'Anniversary celebration. Dessert with sparkle candle.',
    tableNumber: 'T-7',
    status: 'seated',
    estimatedBill: 1800,
    staffNotes: 'Chef informed about complimentary anniversary dessert.',
    createdAt: '2026-08-10T14:30:00Z',
    updatedAt: '2026-08-11T19:45:00Z'
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
    dietaryPreferences: 'Romantic Candlelight Dinner (Goan & Continental)',
    specialRequests: 'Balcony table with panoramic river lights view',
    tableNumber: 'T-8',
    status: 'confirmed',
    estimatedBill: 2200,
    staffNotes: 'Balcony table T-8 reserved for dinner.',
    createdAt: '2026-08-11T11:00:00Z',
    updatedAt: '2026-08-11T11:00:00Z'
  }
];

export const initialMaintenance: MaintenanceTicket[] = [
  {
    id: 'MNT-101',
    roomNumber: '206',
    area: 'Room',
    issueTitle: 'AC Cooling Efficiency Low',
    description: 'Compressor gas recharge scheduled with Daikin technician.',
    priority: 'high',
    status: 'in_progress',
    reportedBy: 'Housekeeping Supervisor',
    assignedTo: 'Daikin Service Team',
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'MNT-102',
    area: 'Restaurant',
    issueTitle: 'Balcony Garden Light Restringing',
    description: 'Replace 2 fairy light bulbs near Table 7 balcony pergola.',
    priority: 'medium',
    status: 'resolved',
    reportedBy: 'F&B Manager',
    assignedTo: 'In-house Electrician',
    createdAt: '2026-08-09T18:00:00Z',
    resolvedAt: '2026-08-10T12:00:00Z'
  }
];

export const initialFolios: GuestFolio[] = [
  {
    id: 'FOL-801',
    guestId: 'GST-101',
    guestName: 'Aarav Singhania',
    guestPhone: '+91 98201 44521',
    guestEmail: 'aarav.singhania@gmail.com',
    roomBookingId: 'CP-RM-1041',
    roomNumber: '104',
    checkIn: '2026-08-10',
    checkOut: '2026-08-13',
    items: [
      { id: 'FIT-1', date: '2026-08-10', category: 'Room', description: 'Paradise AC Suite (3 Nights @ ₹1,800/night)', qty: 3, unitPrice: 1800, taxRatePercent: 12, totalPrice: 5400, referenceId: 'CP-RM-1041' },
      { id: 'FIT-2', date: '2026-08-10', category: 'Vehicle', description: 'Honda Activa 6G Rental (3 Days @ ₹400/day)', qty: 3, unitPrice: 400, taxRatePercent: 18, totalPrice: 1200, referenceId: 'CP-VH-2081' },
      { id: 'FIT-3', date: '2026-08-11', category: 'Dining', description: 'Goan Seafood Dinner & Wine (Table T-7)', qty: 1, unitPrice: 1800, taxRatePercent: 5, totalPrice: 1800, referenceId: 'CP-DN-3091' }
    ],
    subtotal: 8400,
    taxAmount: 954,
    discountAmount: 0,
    grandTotal: 9354,
    amountPaid: 6600,
    balanceDue: 2754,
    status: 'open',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-11T20:00:00Z'
  }
];

export const initialLogs: ActivityLog[] = [
  {
    id: 'LOG-1',
    timestamp: '2026-08-11T19:45:00Z',
    type: 'dining',
    action: 'status_changed',
    title: 'Guest Seated at Balcony Table T-7',
    description: 'Aarav Singhania seated for Dinner table reservation (Party of 2).',
    guestName: 'Aarav Singhania',
    bookingId: 'CP-DN-3091'
  },
  {
    id: 'LOG-2',
    timestamp: '2026-08-11T14:00:00Z',
    type: 'room',
    action: 'status_changed',
    title: 'Honeymoon Couple Checked In',
    description: 'Pooja & Rohan Mehra checked into Suite 201 with Balcony.',
    guestName: 'Pooja & Rohan Mehra',
    bookingId: 'CP-RM-1042',
    roomNumber: '201'
  },
  {
    id: 'LOG-3',
    timestamp: '2026-08-11T10:30:00Z',
    type: 'vehicle',
    action: 'status_changed',
    title: 'Swift Hatchback Handed Over',
    description: 'Maruti Suzuki Swift handed over to Pooja & Rohan Mehra (2 Days rental).',
    guestName: 'Pooja & Rohan Mehra',
    bookingId: 'CP-VH-2082'
  },
  {
    id: 'LOG-4',
    timestamp: '2026-08-10T13:30:00Z',
    type: 'room',
    action: 'status_changed',
    title: 'Guest Checked In',
    description: 'Aarav Singhania checked into Paradise AC Suite (Room 104).',
    guestName: 'Aarav Singhania',
    bookingId: 'CP-RM-1041',
    roomNumber: '104'
  }
];

export const defaultStaffPermissions: StaffPermissions = {
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
};

export const defaultAdminPermissions: StaffPermissions = {
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
};

export const initialUsers: CRMUser[] = [
  {
    id: 'USR-ADMIN-1',
    name: 'General Manager',
    email: 'gm@casaparadisohotel.in',
    role: 'admin',
    pin: '1234',
    designation: 'Hotel General Manager',
    avatar: '👑',
    permissions: defaultAdminPermissions,
    createdAt: '2026-08-01T09:00:00Z'
  },
  {
    id: 'USR-STAFF-101',
    name: 'Front Desk Staff',
    email: 'frontdesk@casaparadisohotel.in',
    role: 'staff',
    pin: '0000',
    designation: 'Front Office Associate',
    avatar: '🏨',
    permissions: defaultStaffPermissions,
    createdAt: '2026-08-01T09:00:00Z'
  },
  {
    id: 'USR-STAFF-102',
    name: 'Housekeeping Supervisor',
    email: 'housekeeping@casaparadisohotel.in',
    role: 'staff',
    pin: '1111',
    designation: 'Housekeeping & Maintenance Lead',
    avatar: '🧹',
    permissions: {
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
    },
    createdAt: '2026-08-01T09:00:00Z'
  }
];

export const initialData: CRMStoreData = {
  version: 2,
  settings: defaultSettings,
  rooms: initialRooms,
  vehicles: initialVehicles,
  diningTables: initialDiningTables,
  guests: initialGuests,
  roomBookings: initialRoomBookings,
  vehicleBookings: initialVehicleBookings,
  diningBookings: initialDiningBookings,
  maintenanceTickets: initialMaintenance,
  folios: initialFolios,
  activityLogs: initialLogs,
  users: initialUsers,
  activeUserId: 'USR-ADMIN-1'
};

// Cross-tab broadcast channel
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel error', e);
  }
}

export function notifySubscribers() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('casa_crm_updated'));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'DATA_UPDATED', time: Date.now() });
    }
  }
}

let hasInitiatedInitialSupabaseFetch = false;

// Pull from Supabase
export async function pullLatestFromSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const remoteData = await fetchFullStoreFromSupabase();
    if (remoteData) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
        notifySubscribers();
      }
      return true;
    }
  } catch (e) {
    console.error('Error pulling latest data from Supabase:', e);
  }
  return false;
}

// 1. Get Store
export function getCRMStore(): CRMStoreData {
  if (typeof window === 'undefined') return initialData;

  // Background fetch from Supabase on first run
  if (isSupabaseConfigured() && !hasInitiatedInitialSupabaseFetch) {
    hasInitiatedInitialSupabaseFetch = true;
    pullLatestFromSupabase().catch(() => {});
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    const parsed: CRMStoreData = JSON.parse(raw);
    let needsUpdate = false;

    // Backward compatibility checks
    if (!parsed.settings || parsed.version !== initialData.version) {
      parsed.settings = { ...defaultSettings, ...(parsed.settings || {}) };
      parsed.version = initialData.version;
      needsUpdate = true;
    }
    if (!parsed.rooms || parsed.rooms.length === 0) {
      parsed.rooms = initialRooms;
      needsUpdate = true;
    }
    if (!parsed.vehicles || parsed.vehicles.length === 0) {
      parsed.vehicles = initialVehicles;
      needsUpdate = true;
    }
    if (!parsed.diningTables || parsed.diningTables.length === 0) {
      parsed.diningTables = initialDiningTables;
      needsUpdate = true;
    }
    if (!parsed.maintenanceTickets) {
      parsed.maintenanceTickets = initialMaintenance;
      needsUpdate = true;
    }
    if (!parsed.folios) {
      parsed.folios = initialFolios;
      needsUpdate = true;
    }
    if (!parsed.users || parsed.users.length === 0) {
      parsed.users = initialUsers;
      parsed.activeUserId = 'USR-ADMIN-1';
      needsUpdate = true;
    }
    if (!parsed.activeUserId) {
      parsed.activeUserId = parsed.users[0]?.id || 'USR-ADMIN-1';
      needsUpdate = true;
    }

    if (needsUpdate) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error('Error reading CRM store', e);
    return initialData;
  }
}

// 2. Save Store
export function saveCRMStore(data: CRMStoreData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    notifySubscribers();
  } catch (e) {
    console.error('Error saving CRM store', e);
  }
}

// 3. Guest Aggregation Helper
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
    if (existing.totalBookings >= 2 && !existing.tags.includes('Repeat Guest')) {
      existing.tags.push('Repeat Guest');
    }
    updatedGuests = updatedGuests.map(g => (g.id === existing!.id ? existing! : g));
    persistGuestToSupabase(existing);
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
    persistGuestToSupabase(newGuest);
    return { guest: newGuest, updatedGuests };
  }
}

// 4. Room Booking CRUD
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
  roomNumber?: string;
  specialRequests?: string;
  staffNotes?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  advanceAmount?: number;
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
    status: payload.roomNumber ? 'confirmed' : 'pending',
    paymentStatus: payload.paymentStatus || 'unpaid',
    paymentMethod: payload.paymentMethod,
    advanceAmount: payload.advanceAmount || 0,
    roomNumber: payload.roomNumber,
    specialRequests: payload.specialRequests,
    staffNotes: payload.staffNotes,
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
    bookingId: id,
    roomNumber: payload.roomNumber
  };

  // Update room occupancy if assigned
  let updatedRooms = [...store.rooms];
  if (payload.roomNumber) {
    updatedRooms = updatedRooms.map(r =>
      r.roomNumber === payload.roomNumber
        ? { ...r, isOccupied: true, currentBookingId: id }
        : r
    );
    persistRoomsBatchToSupabase(updatedRooms);
  }

  saveCRMStore({
    ...store,
    guests: updatedGuests,
    rooms: updatedRooms,
    roomBookings: [newBooking, ...store.roomBookings],
    activityLogs: [newLog, ...store.activityLogs]
  });

  // Supabase Async Persistence
  persistRoomBookingToSupabase(newBooking);
  persistActivityLogToSupabase(newLog);

  return newBooking;
}

export function updateRoomBooking(id: string, updates: Partial<RoomBooking>): RoomBooking | null {
  const store = getCRMStore();
  const index = store.roomBookings.findIndex(b => b.id === id);
  if (index === -1) return null;

  const current = store.roomBookings[index];
  const updated: RoomBooking = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const updatedBookings = [...store.roomBookings];
  updatedBookings[index] = updated;

  // Handle room occupancy state changes
  let updatedRooms = [...store.rooms];
  if (updates.roomNumber && updates.roomNumber !== current.roomNumber) {
    // Release old room
    if (current.roomNumber) {
      updatedRooms = updatedRooms.map(r =>
        r.roomNumber === current.roomNumber ? { ...r, isOccupied: false, currentBookingId: undefined } : r
      );
    }
    // Claim new room
    updatedRooms = updatedRooms.map(r =>
      r.roomNumber === updates.roomNumber ? { ...r, isOccupied: true, currentBookingId: id } : r
    );
  }

  if (updates.status === 'checked_out' || updates.status === 'cancelled') {
    if (updated.roomNumber) {
      updatedRooms = updatedRooms.map(r =>
        r.roomNumber === updated.roomNumber
          ? { ...r, isOccupied: false, currentBookingId: undefined, cleanliness: 'dirty' }
          : r
      );
    }
  }

  const logs = [...store.activityLogs];
  if (updates.status && updates.status !== current.status) {
    const statusLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'room',
      action: 'status_changed',
      title: `Room Status: ${updates.status.toUpperCase()}`,
      description: `${current.guestName} (${current.id}) status updated to ${updates.status}`,
      guestName: current.guestName,
      bookingId: id,
      roomNumber: updated.roomNumber
    };
    logs.unshift(statusLog);
    persistActivityLogToSupabase(statusLog);
  }

  saveCRMStore({
    ...store,
    rooms: updatedRooms,
    roomBookings: updatedBookings,
    activityLogs: logs
  });

  // Supabase Async Persistence
  persistRoomBookingToSupabase(updated);
  persistRoomsBatchToSupabase(updatedRooms);

  return updated;
}

// 5. Vehicle Booking CRUD
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
  depositAmount?: number;
  licenseNumber?: string;
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
    licenseNumber: payload.licenseNumber,
    helmetCount: payload.helmetCount || (payload.vehicleCategory === '2-wheeler' ? 2 : 0),
    depositAmount: payload.depositAmount || (payload.vehicleCategory === '2-wheeler' ? 1000 : 3000),
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

  saveCRMStore({
    ...store,
    guests: updatedGuests,
    vehicleBookings: [newBooking, ...store.vehicleBookings],
    activityLogs: [newLog, ...store.activityLogs]
  });

  // Supabase Async Persistence
  persistVehicleBookingToSupabase(newBooking);
  persistActivityLogToSupabase(newLog);

  return newBooking;
}

export function updateVehicleBooking(id: string, updates: Partial<VehicleBooking>): VehicleBooking | null {
  const store = getCRMStore();
  const index = store.vehicleBookings.findIndex(b => b.id === id);
  if (index === -1) return null;

  const current = store.vehicleBookings[index];
  const updated: VehicleBooking = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const updatedBookings = [...store.vehicleBookings];
  updatedBookings[index] = updated;

  // Update vehicle fleet status
  let updatedVehicles = [...store.vehicles];
  let touchedVehicle: VehicleDefinition | undefined;

  if (updates.status === 'handed_over') {
    updatedVehicles = updatedVehicles.map(v => {
      if (v.id === updated.vehicleId) {
        const vUp: VehicleDefinition = { ...v, status: 'rented', isAvailable: false };
        touchedVehicle = vUp;
        return vUp;
      }
      return v;
    });
  } else if (updates.status === 'returned' || updates.status === 'cancelled') {
    updatedVehicles = updatedVehicles.map(v => {
      if (v.id === updated.vehicleId) {
        const vUp: VehicleDefinition = { ...v, status: 'available', isAvailable: true };
        touchedVehicle = vUp;
        return vUp;
      }
      return v;
    });
  }

  const logs = [...store.activityLogs];
  if (updates.status && updates.status !== current.status) {
    const statusLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'vehicle',
      action: 'status_changed',
      title: `Vehicle Status: ${updates.status.toUpperCase()}`,
      description: `${current.guestName}'s ${current.vehicleName} status updated to ${updates.status}`,
      guestName: current.guestName,
      bookingId: id
    };
    logs.unshift(statusLog);
    persistActivityLogToSupabase(statusLog);
  }

  saveCRMStore({
    ...store,
    vehicles: updatedVehicles,
    vehicleBookings: updatedBookings,
    activityLogs: logs
  });

  // Supabase Async Persistence
  persistVehicleBookingToSupabase(updated);
  if (touchedVehicle) {
    persistVehicleToSupabase(touchedVehicle);
  }

  return updated;
}

// 6. Dining Booking CRUD
export function createDiningBooking(payload: {
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  date: string;
  timeSlot: string;
  partySize: number;
  dietaryPreferences?: string;
  specialRequests?: string;
  tableNumber?: string;
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
    tableNumber: payload.tableNumber,
    status: payload.tableNumber ? 'confirmed' : 'pending',
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

  saveCRMStore({
    ...store,
    guests: updatedGuests,
    diningBookings: [newBooking, ...store.diningBookings],
    activityLogs: [newLog, ...store.activityLogs]
  });

  // Supabase Async Persistence
  persistDiningBookingToSupabase(newBooking);
  persistActivityLogToSupabase(newLog);

  return newBooking;
}

export function updateDiningBooking(id: string, updates: Partial<DiningBooking>): DiningBooking | null {
  const store = getCRMStore();
  const index = store.diningBookings.findIndex(b => b.id === id);
  if (index === -1) return null;

  const current = store.diningBookings[index];
  const updated: DiningBooking = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const updatedBookings = [...store.diningBookings];
  updatedBookings[index] = updated;

  // Table status update
  let updatedTables = [...store.diningTables];
  let touchedTable: DiningTable | undefined;

  if (updates.status === 'seated' && updated.tableNumber) {
    updatedTables = updatedTables.map(t => {
      if (t.id === updated.tableNumber) {
        const tUp: DiningTable = { ...t, isOccupied: true, currentBookingId: id };
        touchedTable = tUp;
        return tUp;
      }
      return t;
    });
  } else if ((updates.status === 'completed' || updates.status === 'cancelled') && updated.tableNumber) {
    updatedTables = updatedTables.map(t => {
      if (t.id === updated.tableNumber) {
        const tUp: DiningTable = { ...t, isOccupied: false, currentBookingId: undefined };
        touchedTable = tUp;
        return tUp;
      }
      return t;
    });
  }

  const logs = [...store.activityLogs];
  if (updates.status && updates.status !== current.status) {
    const statusLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'dining',
      action: 'status_changed',
      title: `Dining Status: ${updates.status.toUpperCase()}`,
      description: `${current.guestName}'s reservation updated to ${updates.status}`,
      guestName: current.guestName,
      bookingId: id
    };
    logs.unshift(statusLog);
    persistActivityLogToSupabase(statusLog);
  }

  saveCRMStore({
    ...store,
    diningTables: updatedTables,
    diningBookings: updatedBookings,
    activityLogs: logs
  });

  // Supabase Async Persistence
  persistDiningBookingToSupabase(updated);
  if (touchedTable) {
    persistDiningTableToSupabase(touchedTable);
  }

  return updated;
}

// 7. Housekeeping & Room Cleanliness
export function updateRoomCleanliness(roomNumber: string, cleanliness: CleanlinessStatus, notes?: string): boolean {
  const store = getCRMStore();
  const index = store.rooms.findIndex(r => r.roomNumber === roomNumber);
  if (index === -1) return false;

  const updatedRoom: RoomDefinition = {
    ...store.rooms[index],
    cleanliness,
    notes: notes !== undefined ? notes : store.rooms[index].notes
  };

  const updatedRooms = [...store.rooms];
  updatedRooms[index] = updatedRoom;

  const log: ActivityLog = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'housekeeping',
    action: 'status_changed',
    title: `Room ${roomNumber} marked ${cleanliness.replace('_', ' ').toUpperCase()}`,
    description: `Housekeeping status for Room ${roomNumber} changed to ${cleanliness}`,
    roomNumber
  };

  saveCRMStore({
    ...store,
    rooms: updatedRooms,
    activityLogs: [log, ...store.activityLogs]
  });

  // Supabase Async Persistence
  persistRoomToSupabase(updatedRoom);
  persistActivityLogToSupabase(log);

  return true;
}

// 8. Maintenance Tickets
export function createMaintenanceTicket(payload: Omit<MaintenanceTicket, 'id' | 'createdAt'>): MaintenanceTicket {
  const store = getCRMStore();
  const id = `MNT-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();

  const newTicket: MaintenanceTicket = {
    id,
    createdAt: now,
    ...payload
  };

  // If room ticket, mark room as out_of_order if high or urgent
  let updatedRooms = [...store.rooms];
  if (payload.roomNumber && (payload.priority === 'high' || payload.priority === 'urgent')) {
    updatedRooms = updatedRooms.map(r =>
      r.roomNumber === payload.roomNumber ? { ...r, cleanliness: 'out_of_order', notes: payload.issueTitle } : r
    );
    persistRoomsBatchToSupabase(updatedRooms);
  }

  const log: ActivityLog = {
    id: `LOG-${Date.now()}`,
    timestamp: now,
    type: 'maintenance',
    action: 'created',
    title: `New Maintenance Ticket: ${payload.issueTitle}`,
    description: `[${payload.priority.toUpperCase()}] ${payload.description} (Assigned to: ${payload.assignedTo || 'Unassigned'})`,
    roomNumber: payload.roomNumber
  };

  saveCRMStore({
    ...store,
    rooms: updatedRooms,
    maintenanceTickets: [newTicket, ...store.maintenanceTickets],
    activityLogs: [log, ...store.activityLogs]
  });

  // Supabase Async Persistence
  persistMaintenanceTicketToSupabase(newTicket);
  persistActivityLogToSupabase(log);

  return newTicket;
}

export function updateMaintenanceTicket(id: string, updates: Partial<MaintenanceTicket>): MaintenanceTicket | null {
  const store = getCRMStore();
  const index = store.maintenanceTickets.findIndex(t => t.id === id);
  if (index === -1) return null;

  const current = store.maintenanceTickets[index];
  const updated: MaintenanceTicket = {
    ...current,
    ...updates,
    resolvedAt: updates.status === 'resolved' ? new Date().toISOString() : current.resolvedAt
  };

  const updatedTickets = [...store.maintenanceTickets];
  updatedTickets[index] = updated;

  // Restore room cleanliness if resolved
  let updatedRooms = [...store.rooms];
  if (updated.roomNumber && updates.status === 'resolved') {
    updatedRooms = updatedRooms.map(r =>
      r.roomNumber === updated.roomNumber && r.cleanliness === 'out_of_order'
        ? { ...r, cleanliness: 'dirty', notes: 'Maintenance resolved. Needs cleaning.' }
        : r
    );
    persistRoomsBatchToSupabase(updatedRooms);
  }

  saveCRMStore({
    ...store,
    rooms: updatedRooms,
    maintenanceTickets: updatedTickets
  });

  // Supabase Async Persistence
  persistMaintenanceTicketToSupabase(updated);

  return updated;
}

// 9. Guest Profiles
export function updateGuestProfile(guestId: string, updates: Partial<Guest>): Guest | null {
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

  // Supabase Async Persistence
  persistGuestToSupabase(updated);

  return updated;
}

export const updateGuest = updateGuestProfile;

// 10. Guest Folios & Invoicing
export function getOrCreateFolioForGuest(guestId: string): GuestFolio {
  const store = getCRMStore();
  const existing = store.folios.find(f => f.guestId === guestId && f.status === 'open');
  if (existing) return existing;

  const guest = store.guests.find(g => g.id === guestId);
  const guestRooms = store.roomBookings.filter(b => b.guestId === guestId && b.status !== 'cancelled');
  const guestVehicles = store.vehicleBookings.filter(b => b.guestId === guestId && b.status !== 'cancelled');
  const guestDining = store.diningBookings.filter(b => b.guestId === guestId && b.status !== 'cancelled');

  const items: GuestFolio['items'] = [];
  let subtotal = 0;
  let taxAmount = 0;

  guestRooms.forEach(r => {
    const tax = r.totalPrice * 0.12;
    items.push({
      id: `FIT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: r.checkIn,
      category: 'Room',
      description: `${r.roomTitle} (${r.nights} night${r.nights > 1 ? 's' : ''} @ ₹${r.baseRate}/night)`,
      qty: r.nights,
      unitPrice: r.baseRate,
      taxRatePercent: 12,
      totalPrice: r.totalPrice,
      referenceId: r.id
    });
    subtotal += r.totalPrice;
    taxAmount += tax;
  });

  guestVehicles.forEach(v => {
    const tax = v.totalPrice * 0.18;
    items.push({
      id: `FIT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: v.pickupDate,
      category: 'Vehicle',
      description: `${v.vehicleName} (${v.days} day${v.days > 1 ? 's' : ''} @ ₹${v.dailyRate}/day)`,
      qty: v.days,
      unitPrice: v.dailyRate,
      taxRatePercent: 18,
      totalPrice: v.totalPrice,
      referenceId: v.id
    });
    subtotal += v.totalPrice;
    taxAmount += tax;
  });

  guestDining.forEach(d => {
    const bill = d.estimatedBill || 1500;
    const tax = bill * 0.05;
    items.push({
      id: `FIT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: d.date,
      category: 'Dining',
      description: `Restaurant Dining (${d.timeSlot} - Party of ${d.partySize})`,
      qty: 1,
      unitPrice: bill,
      taxRatePercent: 5,
      totalPrice: bill,
      referenceId: d.id
    });
    subtotal += bill;
    taxAmount += tax;
  });

  const grandTotal = Math.round(subtotal + taxAmount);
  const totalPaid = guestRooms.reduce((sum, r) => sum + (r.paymentStatus === 'paid' ? r.totalPrice : (r.advanceAmount || 0)), 0) +
                    guestVehicles.reduce((sum, v) => sum + (v.paymentStatus === 'paid' ? v.totalPrice : 0), 0);

  const newFolio: GuestFolio = {
    id: `FOL-${Math.floor(1000 + Math.random() * 9000)}`,
    guestId,
    guestName: guest?.name || 'Guest',
    guestPhone: guest?.phone || '',
    guestEmail: guest?.email || '',
    roomBookingId: guestRooms[0]?.id,
    roomNumber: guestRooms[0]?.roomNumber,
    checkIn: guestRooms[0]?.checkIn,
    checkOut: guestRooms[0]?.checkOut,
    items,
    subtotal,
    taxAmount: Math.round(taxAmount),
    discountAmount: 0,
    grandTotal,
    amountPaid: totalPaid,
    balanceDue: Math.max(0, grandTotal - totalPaid),
    status: grandTotal - totalPaid <= 0 ? 'settled' : 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  saveCRMStore({
    ...store,
    folios: [newFolio, ...store.folios]
  });

  // Supabase Async Persistence
  persistFolioToSupabase(newFolio);

  return newFolio;
}

export function recordFolioPayment(folioId: string, amount: number, paymentMethod: string): GuestFolio | null {
  const store = getCRMStore();
  const index = store.folios.findIndex(f => f.id === folioId);
  if (index === -1) return null;

  const current = store.folios[index];
  const newAmountPaid = current.amountPaid + amount;
  const newBalance = Math.max(0, current.grandTotal - newAmountPaid);

  const updated: GuestFolio = {
    ...current,
    amountPaid: newAmountPaid,
    balanceDue: newBalance,
    status: newBalance === 0 ? 'settled' : 'open',
    updatedAt: new Date().toISOString()
  };

  const updatedFolios = [...store.folios];
  updatedFolios[index] = updated;

  const log: ActivityLog = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'billing',
    action: 'settled',
    title: `Payment Recorded: ₹${amount.toLocaleString('en-IN')}`,
    description: `Received ₹${amount.toLocaleString('en-IN')} via ${paymentMethod} for Folio ${current.id} (${current.guestName})`,
    guestName: current.guestName
  };

  saveCRMStore({
    ...store,
    folios: updatedFolios,
    activityLogs: [log, ...store.activityLogs]
  });

  // Supabase Async Persistence
  persistFolioToSupabase(updated);
  persistActivityLogToSupabase(log);

  return updated;
}

// 11. Delete Bookings
export function deleteBooking(type: 'room' | 'vehicle' | 'dining', id: string): boolean {
  const store = getCRMStore();
  let updatedStore: CRMStoreData = { ...store };

  if (type === 'room') {
    updatedStore.roomBookings = store.roomBookings.filter(b => b.id !== id);
    deleteRecordFromSupabase('room_bookings', id);
  } else if (type === 'vehicle') {
    updatedStore.vehicleBookings = store.vehicleBookings.filter(b => b.id !== id);
    deleteRecordFromSupabase('vehicle_bookings', id);
  } else if (type === 'dining') {
    updatedStore.diningBookings = store.diningBookings.filter(b => b.id !== id);
    deleteRecordFromSupabase('dining_bookings', id);
  }

  saveCRMStore(updatedStore);
  return true;
}

// 12. Settings & Rate Master
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

  // Supabase Async Persistence
  persistHotelSettingsToSupabase(updatedSettings);

  return updatedSettings;
}

// 13. Export & Import & Reset
export function exportCRMDataAsJSON(): string {
  const store = getCRMStore();
  return JSON.stringify(store, null, 2);
}

export function importCRMDataFromJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.version || !parsed.settings) return false;
    saveCRMStore(parsed);
    return true;
  } catch (e) {
    console.error('Failed to import CRM data', e);
    return false;
  }
}

export function resetCRMData(): void {
  saveCRMStore(initialData);
  persistHotelSettingsToSupabase(defaultSettings);
  persistRoomsBatchToSupabase(initialRooms);
}

// 14. Real-time Subscription Hook Helper
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

  // Setup Supabase Realtime channel if configured
  const unsubscribeSupabase = setupSupabaseRealtimeChannel(() => {
    pullLatestFromSupabase().then(() => callback()).catch(() => callback());
  });

  return () => {
    window.removeEventListener('casa_crm_updated', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (broadcastChannel && handleBroadcast) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
    unsubscribeSupabase();
  };
}

// ==========================================
// 15. RBAC & STAFF PERMISSIONS MANAGEMENT
// ==========================================

export function getCurrentUser(): CRMUser {
  const store = getCRMStore();
  const user = store.users?.find(u => u.id === store.activeUserId);
  return user || store.users?.[0] || initialUsers[0];
}

export function getAllUsers(): CRMUser[] {
  const store = getCRMStore();
  return store.users || initialUsers;
}

export function setCurrentUser(userId: string): boolean {
  const store = getCRMStore();
  const user = store.users?.find(u => u.id === userId);
  if (!user) return false;
  store.activeUserId = userId;
  saveCRMStore(store);
  return true;
}

export function verifyUserPin(userId: string, pin: string): boolean {
  const store = getCRMStore();
  const user = store.users?.find(u => u.id === userId);
  if (!user) return false;
  return user.pin === pin.trim();
}

export function hasPermission(key: keyof StaffPermissions): boolean {
  const user = getCurrentUser();
  if (user.role === 'admin') return true;
  return Boolean(user.permissions && user.permissions[key]);
}

export function createStaffUser(payload: {
  name: string;
  email: string;
  role?: CRMUserRole;
  pin?: string;
  designation?: string;
  avatar?: string;
  permissions?: Partial<StaffPermissions>;
}): CRMUser {
  const store = getCRMStore();
  const role: CRMUserRole = payload.role || 'staff';
  const newUser: CRMUser = {
    id: `USR-${role === 'admin' ? 'ADMIN' : 'STAFF'}-${Math.floor(100 + Math.random() * 900)}`,
    name: payload.name.trim(),
    email: payload.email.trim(),
    role,
    pin: payload.pin?.trim() || (role === 'admin' ? '1234' : '0000'),
    designation: payload.designation?.trim() || (role === 'admin' ? 'Hotel Administrator' : 'Front Office Associate'),
    avatar: payload.avatar || (role === 'admin' ? '👑' : '👤'),
    permissions: role === 'admin' 
      ? { ...defaultAdminPermissions } 
      : { ...defaultStaffPermissions, ...(payload.permissions || {}) },
    createdAt: new Date().toISOString()
  };

  store.users = store.users || [];
  store.users.push(newUser);
  saveCRMStore(store);
  persistUserToSupabase(newUser);
  return newUser;
}

export function updateStaffUser(userId: string, updates: Partial<CRMUser>): CRMUser | null {
  const store = getCRMStore();
  if (!store.users) return null;
  const index = store.users.findIndex(u => u.id === userId);
  if (index === -1) return null;

  const current = store.users[index];
  const updated: CRMUser = {
    ...current,
    ...updates,
    permissions: updates.role === 'admin' || current.role === 'admin' && updates.role !== 'staff'
      ? { ...defaultAdminPermissions }
      : {
          ...current.permissions,
          ...(updates.permissions || {})
        }
  };

  store.users[index] = updated;
  saveCRMStore(store);
  persistUserToSupabase(updated);
  return updated;
}

export function deleteStaffUser(userId: string): boolean {
  const store = getCRMStore();
  if (!store.users) return false;

  const user = store.users.find(u => u.id === userId);
  if (!user) return false;

  // Protect against deleting the last admin
  const adminCount = store.users.filter(u => u.role === 'admin').length;
  if (user.role === 'admin' && adminCount <= 1) {
    return false;
  }

  store.users = store.users.filter(u => u.id !== userId);
  if (store.activeUserId === userId) {
    const fallback = store.users.find(u => u.role === 'admin') || store.users[0];
    store.activeUserId = fallback ? fallback.id : 'USR-ADMIN-1';
  }

  saveCRMStore(store);
  deleteUserFromSupabase(userId);
  return true;
}

