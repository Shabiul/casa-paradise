export type RoomType = 'ac' | 'nonac';
export type OccupancyType = 'single' | 'double' | 'triple';
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type VehicleBookingStatus = 'pending' | 'confirmed' | 'handed_over' | 'returned' | 'cancelled';
export type DiningBookingStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'advance_paid' | 'paid' | 'refunded';
export type PaymentMethod = 'cash' | 'upi' | 'card' | 'online' | 'bank_transfer';
export type CleanlinessStatus = 'clean' | 'dirty' | 'cleaning_in_progress' | 'inspected' | 'out_of_order';
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type MaintenanceStatus = 'reported' | 'in_progress' | 'resolved' | 'cancelled';

export type GuestTag = 'VIP' | 'Repeat Guest' | 'Honeymoon' | 'Corporate' | 'Family' | 'Long Stay';

export interface RoomDefinition {
  roomNumber: string; // e.g. '101'
  floor: 1 | 2;
  roomType: RoomType;
  title: string;
  maxOccupancy: number;
  cleanliness: CleanlinessStatus;
  isOccupied: boolean;
  currentBookingId?: string;
  notes?: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  idProofType?: 'Aadhaar' | 'Passport' | 'Driving License' | 'Voter ID' | 'Other';
  idProofNumber?: string;
  nationality?: string;
  notes?: string;
  tags: GuestTag[];
  totalBookings: number;
  totalSpent: number;
  createdAt: string;
  lastVisit?: string;
}

export interface RoomBooking {
  id: string; // e.g. CP-RM-1042
  guestId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  roomType: RoomType;
  roomTitle: string;
  occupancy: OccupancyType;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  baseRate: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  advanceAmount?: number;
  roomNumber?: string; // Assigned room like '104', '202'
  specialRequests?: string;
  staffNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleDefinition {
  id: string; // 'activa', 'dio', 'fascino', 'swift', 'ertiga'
  name: string;
  category: '2-wheeler' | '4-wheeler';
  registrationNumber: string;
  dailyRate: number;
  image: string;
  isAvailable: boolean;
  status: 'available' | 'rented' | 'maintenance';
  lastServiceDate?: string;
}

export interface VehicleBooking {
  id: string; // e.g. CP-VH-2083
  guestId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: '2-wheeler' | '4-wheeler';
  vehicleImage: string;
  registrationNumber?: string;
  pickupDate: string;
  returnDate: string;
  days: number;
  dailyRate: number;
  totalPrice: number;
  status: VehicleBookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  licenseNumber?: string;
  helmetCount?: number;
  depositAmount?: number;
  hotelDelivery?: boolean;
  fuelLevelOnPickup?: 'Quarter' | 'Half' | 'Full';
  fuelLevelOnReturn?: 'Quarter' | 'Half' | 'Full';
  specialRequests?: string;
  staffNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiningTable {
  id: string; // 'T-1', 'T-2', ...
  name: string;
  section: 'Balcony' | 'Garden Courtyard' | 'Main Heritage Hall' | 'Private Lounge';
  capacity: number;
  isOccupied: boolean;
  currentBookingId?: string;
}

export interface DiningBooking {
  id: string; // e.g. CP-DN-3094
  guestId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  date: string;
  timeSlot: string; // 'Breakfast', 'Lunch', 'High Tea', 'Dinner'
  partySize: number;
  specialRequests?: string;
  dietaryPreferences?: string;
  tableNumber?: string;
  status: DiningBookingStatus;
  estimatedBill?: number;
  staffNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTicket {
  id: string; // e.g. MNT-101
  roomNumber?: string;
  area: 'Room' | 'Restaurant' | 'Lobby' | 'Vehicles' | 'General';
  issueTitle: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface FolioItem {
  id: string;
  date: string;
  category: 'Room' | 'Vehicle' | 'Dining' | 'Laundry' | 'Minibar' | 'Extra Bed' | 'Other';
  description: string;
  qty: number;
  unitPrice: number;
  taxRatePercent: number;
  totalPrice: number;
  referenceId?: string;
}

export interface GuestFolio {
  id: string; // e.g. FOL-8021
  guestId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  roomBookingId?: string;
  roomNumber?: string;
  checkIn?: string;
  checkOut?: string;
  items: FolioItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  status: 'open' | 'settled' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'room' | 'vehicle' | 'dining' | 'housekeeping' | 'maintenance' | 'guest' | 'billing' | 'settings' | 'system';
  action: 'created' | 'updated' | 'status_changed' | 'deleted' | 'settled' | 'note_added';
  title: string;
  description: string;
  guestName?: string;
  bookingId?: string;
  roomNumber?: string;
}

export interface RoomPriceConfig {
  ac: { single: number; double: number; triple: number };
  nonac: { single: number; double: number; triple: number };
}

export interface VehiclePriceConfig {
  activa: number;
  dio: number;
  fascino: number;
  swift: number;
  ertiga: number;
}

export interface HotelSettings {
  hotelName: string;
  tagline: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;
  checkInTime: string;
  checkOutTime: string;
  roomPrices: RoomPriceConfig;
  vehiclePrices: VehiclePriceConfig;
  heroImageOverride?: string;
  taxRatePercent: number;
  gstin?: string;
  currencySymbol: string;
  whatsappMessageTemplate?: string;
}

export type CRMUserRole = 'admin' | 'staff';

export interface StaffPermissions {
  dashboard: boolean;
  calendar: boolean;
  rooms: boolean;
  vehicles: boolean;
  dining: boolean;
  housekeeping: boolean;
  guests: boolean;
  billing: boolean;
  analytics: boolean;
  settings: boolean;
}

export interface CRMUser {
  id: string;
  name: string;
  email: string;
  role: CRMUserRole;
  pin: string;
  permissions: StaffPermissions;
  avatar?: string;
  designation?: string;
  createdAt: string;
}

export interface CRMStoreData {
  guests: Guest[];
  roomBookings: RoomBooking[];
  vehicleBookings: VehicleBooking[];
  diningBookings: DiningBooking[];
  rooms: RoomDefinition[];
  vehicles: VehicleDefinition[];
  diningTables: DiningTable[];
  maintenanceTickets: MaintenanceTicket[];
  folios: GuestFolio[];
  activityLogs: ActivityLog[];
  settings: HotelSettings;
  users: CRMUser[];
  activeUserId: string;
  version: number;
}
