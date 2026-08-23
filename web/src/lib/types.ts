export type RoomType = 'ac' | 'nonac';
export type OccupancyType = 'single' | 'double' | 'triple';
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
export type VehicleBookingStatus = 'pending' | 'confirmed' | 'handed_over' | 'returned' | 'cancelled';
export type DiningBookingStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'advance_paid' | 'paid' | 'refunded';

export type GuestTag = 'VIP' | 'Repeat Guest' | 'Honeymoon' | 'Corporate' | 'Family' | 'Long Stay';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  idProofType?: string;
  idProofNumber?: string;
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
  checkIn: string;
  checkOut: string;
  nights: number;
  baseRate: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'cash' | 'upi' | 'card' | 'online';
  roomNumber?: string;
  specialRequests?: string;
  staffNotes?: string;
  createdAt: string;
  updatedAt: string;
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
  pickupDate: string;
  returnDate: string;
  days: number;
  dailyRate: number;
  totalPrice: number;
  status: VehicleBookingStatus;
  paymentStatus: PaymentStatus;
  licenseNumber?: string;
  helmetCount?: number;
  depositAmount?: number;
  hotelDelivery?: boolean;
  specialRequests?: string;
  staffNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiningBooking {
  id: string; // e.g. CP-DN-3094
  guestId: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  date: string;
  timeSlot: string;
  partySize: number;
  specialRequests?: string;
  dietaryPreferences?: string;
  tableNumber?: string;
  status: DiningBookingStatus;
  staffNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'room' | 'vehicle' | 'dining' | 'guest' | 'settings' | 'system';
  action: 'created' | 'updated' | 'status_changed' | 'deleted' | 'note_added';
  title: string;
  description: string;
  guestName?: string;
  bookingId?: string;
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
  currencySymbol: string;
}

export interface CRMStoreData {
  guests: Guest[];
  roomBookings: RoomBooking[];
  vehicleBookings: VehicleBooking[];
  diningBookings: DiningBooking[];
  activityLogs: ActivityLog[];
  settings: HotelSettings;
  version: number;
}
