-- ============================================================================
-- CASA PARADISO - HOTEL MANAGEMENT & CRM SUPABASE DATABASE SCHEMA
-- ============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. GUESTS TABLE
CREATE TABLE IF NOT EXISTS public.guests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    id_proof_type TEXT,
    id_proof_number TEXT,
    nationality TEXT DEFAULT 'Indian',
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    total_bookings INTEGER DEFAULT 1,
    total_spent NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_visit TEXT
);

-- 2. ROOMS INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
    room_number TEXT PRIMARY KEY,
    floor INTEGER NOT NULL,
    room_type TEXT NOT NULL CHECK (room_type IN ('ac', 'nonac')),
    title TEXT NOT NULL,
    max_occupancy INTEGER NOT NULL DEFAULT 2,
    cleanliness TEXT NOT NULL DEFAULT 'clean' CHECK (cleanliness IN ('clean', 'dirty', 'cleaning_in_progress', 'inspected', 'out_of_order')),
    is_occupied BOOLEAN NOT NULL DEFAULT FALSE,
    current_booking_id TEXT,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROOM BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.room_bookings (
    id TEXT PRIMARY KEY,
    guest_id TEXT REFERENCES public.guests(id) ON DELETE SET NULL,
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    room_type TEXT NOT NULL CHECK (room_type IN ('ac', 'nonac')),
    room_title TEXT NOT NULL,
    occupancy TEXT NOT NULL CHECK (occupancy IN ('single', 'double', 'triple')),
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    nights INTEGER NOT NULL DEFAULT 1,
    base_rate NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'advance_paid', 'paid', 'refunded')),
    payment_method TEXT CHECK (payment_method IN ('cash', 'upi', 'card', 'online', 'bank_transfer')),
    advance_amount NUMERIC DEFAULT 0,
    room_number TEXT,
    special_requests TEXT,
    staff_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VEHICLES INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.vehicles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('2-wheeler', '4-wheeler')),
    registration_number TEXT NOT NULL,
    daily_rate NUMERIC NOT NULL,
    image TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
    last_service_date TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VEHICLE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.vehicle_bookings (
    id TEXT PRIMARY KEY,
    guest_id TEXT REFERENCES public.guests(id) ON DELETE SET NULL,
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    vehicle_id TEXT NOT NULL,
    vehicle_name TEXT NOT NULL,
    vehicle_category TEXT NOT NULL CHECK (vehicle_category IN ('2-wheeler', '4-wheeler')),
    vehicle_image TEXT,
    registration_number TEXT,
    pickup_date TEXT NOT NULL,
    return_date TEXT NOT NULL,
    days INTEGER NOT NULL DEFAULT 1,
    daily_rate NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'handed_over', 'returned', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'advance_paid', 'paid', 'refunded')),
    payment_method TEXT CHECK (payment_method IN ('cash', 'upi', 'card', 'online', 'bank_transfer')),
    license_number TEXT,
    helmet_count INTEGER DEFAULT 0,
    deposit_amount NUMERIC DEFAULT 0,
    hotel_delivery BOOLEAN DEFAULT TRUE,
    fuel_level_on_pickup TEXT,
    fuel_level_on_return TEXT,
    special_requests TEXT,
    staff_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DINING TABLES TABLE
CREATE TABLE IF NOT EXISTS public.dining_tables (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    section TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 4,
    is_occupied BOOLEAN NOT NULL DEFAULT FALSE,
    current_booking_id TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DINING BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.dining_bookings (
    id TEXT PRIMARY KEY,
    guest_id TEXT REFERENCES public.guests(id) ON DELETE SET NULL,
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    party_size INTEGER NOT NULL DEFAULT 2,
    dietary_preferences TEXT,
    special_requests TEXT,
    table_number TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled')),
    estimated_bill NUMERIC,
    staff_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MAINTENANCE TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.maintenance_tickets (
    id TEXT PRIMARY KEY,
    room_number TEXT,
    area TEXT NOT NULL CHECK (area IN ('Room', 'Restaurant', 'Lobby', 'Vehicles', 'General')),
    issue_title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'in_progress', 'resolved', 'cancelled')),
    reported_by TEXT NOT NULL,
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 9. GUEST FOLIOS (BILLING LEDGER) TABLE
CREATE TABLE IF NOT EXISTS public.guest_folios (
    id TEXT PRIMARY KEY,
    guest_id TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    guest_phone TEXT,
    guest_email TEXT,
    room_booking_id TEXT,
    room_number TEXT,
    check_in TEXT,
    check_out TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    tax_amount NUMERIC NOT NULL DEFAULT 0,
    discount_amount NUMERIC NOT NULL DEFAULT 0,
    grand_total NUMERIC NOT NULL DEFAULT 0,
    amount_paid NUMERIC NOT NULL DEFAULT 0,
    balance_due NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'settled', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ACTIVITY LOGS AUDIT TRAIL TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    type TEXT NOT NULL,
    action TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    guest_name TEXT,
    booking_id TEXT,
    room_number TEXT
);

-- 11. HOTEL SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.hotel_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    hotel_name TEXT NOT NULL DEFAULT 'Casa Paradiso',
    tagline TEXT DEFAULT 'Boutique Luxury Heritage Hotel in Panaji, Goa',
    phone1 TEXT DEFAULT '+91 82081 45931',
    phone2 TEXT DEFAULT '+91 98812 47847',
    whatsapp TEXT DEFAULT '919881247847',
    email TEXT DEFAULT 'info@casaparadisohotel.in',
    address TEXT DEFAULT 'Ghanekar Building, Rua José Falcão, Altinho, Panaji, Goa 403001',
    check_in_time TEXT DEFAULT '1:00 PM',
    check_out_time TEXT DEFAULT '11:00 AM',
    room_prices JSONB DEFAULT '{"ac": {"single": 1200, "double": 1800, "triple": 2000}, "nonac": {"single": 1200, "double": 1500, "triple": 800}}'::jsonb,
    vehicle_prices JSONB DEFAULT '{"activa": 400, "dio": 400, "fascino": 400, "swift": 1500, "ertiga": 2500}'::jsonb,
    tax_rate_percent NUMERIC DEFAULT 12,
    gstin TEXT DEFAULT '30AAAAA0000A1Z5',
    currency_symbol TEXT DEFAULT '₹',
    whatsapp_message_template TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CRM USERS & STAFF ACCESS CONTROL TABLE
CREATE TABLE IF NOT EXISTS public.crm_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
    pin TEXT NOT NULL DEFAULT '0000',
    designation TEXT,
    avatar TEXT,
    permissions JSONB NOT NULL DEFAULT '{"dashboard": true, "calendar": true, "rooms": true, "vehicles": true, "dining": true, "housekeeping": true, "guests": true, "billing": false, "analytics": false, "settings": false}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_room_bookings_status ON public.room_bookings(status);
CREATE INDEX IF NOT EXISTS idx_room_bookings_guest ON public.room_bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_bookings_status ON public.vehicle_bookings(status);
CREATE INDEX IF NOT EXISTS idx_dining_bookings_status ON public.dining_bookings(status);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON public.guests(phone);
CREATE INDEX IF NOT EXISTS idx_guests_email ON public.guests(email);
CREATE INDEX IF NOT EXISTS idx_crm_users_role ON public.crm_users(role);
CREATE INDEX IF NOT EXISTS idx_activity_logs_time ON public.activity_logs(timestamp DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dining_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dining_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_folios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow public read-write on guests" ON public.guests;
    DROP POLICY IF EXISTS "Allow public read-write on rooms" ON public.rooms;
    DROP POLICY IF EXISTS "Allow public read-write on room_bookings" ON public.room_bookings;
    DROP POLICY IF EXISTS "Allow public read-write on vehicles" ON public.vehicles;
    DROP POLICY IF EXISTS "Allow public read-write on vehicle_bookings" ON public.vehicle_bookings;
    DROP POLICY IF EXISTS "Allow public read-write on dining_tables" ON public.dining_tables;
    DROP POLICY IF EXISTS "Allow public read-write on dining_bookings" ON public.dining_bookings;
    DROP POLICY IF EXISTS "Allow public read-write on maintenance_tickets" ON public.maintenance_tickets;
    DROP POLICY IF EXISTS "Allow public read-write on guest_folios" ON public.guest_folios;
    DROP POLICY IF EXISTS "Allow public read-write on activity_logs" ON public.activity_logs;
    DROP POLICY IF EXISTS "Allow public read-write on hotel_settings" ON public.hotel_settings;
    DROP POLICY IF EXISTS "Allow public read-write on crm_users" ON public.crm_users;
END $$;

-- Allow full public read/write access for anonymous & authenticated users (Hotel management & booking engine)
CREATE POLICY "Allow public read-write on guests" ON public.guests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on room_bookings" ON public.room_bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on vehicle_bookings" ON public.vehicle_bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on dining_tables" ON public.dining_tables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on dining_bookings" ON public.dining_bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on maintenance_tickets" ON public.maintenance_tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on guest_folios" ON public.guest_folios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on activity_logs" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on hotel_settings" ON public.hotel_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read-write on crm_users" ON public.crm_users FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- ENABLE REALTIME ON ALL CRM TABLES
-- ============================================================================
DO $$
BEGIN
  BEGIN
    DROP PUBLICATION IF EXISTS supabase_realtime;
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END $$;

CREATE PUBLICATION supabase_realtime FOR TABLE
  public.guests,
  public.rooms,
  public.room_bookings,
  public.vehicles,
  public.vehicle_bookings,
  public.dining_tables,
  public.dining_bookings,
  public.maintenance_tickets,
  public.guest_folios,
  public.activity_logs,
  public.hotel_settings,
  public.crm_users;

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================

-- 1. Insert Default Hotel Settings
INSERT INTO public.hotel_settings (id, hotel_name, tagline, phone1, phone2, whatsapp, email, address, check_in_time, check_out_time, room_prices, vehicle_prices, tax_rate_percent, gstin, currency_symbol, whatsapp_message_template)
VALUES (
    'default',
    'Casa Paradiso',
    'Boutique Luxury Heritage Hotel in Panaji, Goa',
    '+91 82081 45931',
    '+91 98812 47847',
    '919881247847',
    'info@casaparadisohotel.in',
    'Ghanekar Building, Rua José Falcão, Altinho, Panaji, Goa 403001',
    '1:00 PM',
    '11:00 AM',
    '{"ac": {"single": 1200, "double": 1800, "triple": 2000}, "nonac": {"single": 1200, "double": 1500, "triple": 800}}'::jsonb,
    '{"activa": 400, "dio": 400, "fascino": 400, "swift": 1500, "ertiga": 2500}'::jsonb,
    12,
    '30AAAAA0000A1Z5',
    '₹',
    'Dear {guest_name}, thank you for choosing Casa Paradiso, Panaji! Your reservation #{booking_id} is confirmed. We look forward to welcoming you.'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Default CRM Users (Admin and Front Desk Staff)
INSERT INTO public.crm_users (id, name, email, role, pin, designation, avatar, permissions) VALUES
('USR-ADMIN-1', 'General Manager', 'gm@casaparadisohotel.in', 'admin', '1234', 'Hotel General Manager', '👑', '{"dashboard": true, "calendar": true, "rooms": true, "vehicles": true, "dining": true, "housekeeping": true, "guests": true, "billing": true, "analytics": true, "settings": true}'::jsonb),
('USR-STAFF-101', 'Front Desk Staff', 'frontdesk@casaparadisohotel.in', 'staff', '0000', 'Front Office Associate', '🏨', '{"dashboard": true, "calendar": true, "rooms": true, "vehicles": true, "dining": true, "housekeeping": true, "guests": true, "billing": false, "analytics": false, "settings": false}'::jsonb),
('USR-STAFF-102', 'Housekeeping Supervisor', 'housekeeping@casaparadisohotel.in', 'staff', '1111', 'Housekeeping & Maintenance Lead', '🧹', '{"dashboard": false, "calendar": false, "rooms": true, "vehicles": false, "dining": false, "housekeeping": true, "guests": false, "billing": false, "analytics": false, "settings": false}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Rooms (18 Rooms)
INSERT INTO public.rooms (room_number, floor, room_type, title, max_occupancy, cleanliness, is_occupied, current_booking_id, notes) VALUES
('101', 1, 'ac', 'Paradise AC Suite (Garden View)', 3, 'clean', FALSE, NULL, NULL),
('102', 1, 'ac', 'Paradise AC Suite', 3, 'clean', FALSE, NULL, NULL),
('103', 1, 'ac', 'Paradise AC Suite', 3, 'clean', FALSE, NULL, NULL),
('104', 1, 'ac', 'Paradise AC Suite (Courtyard)', 3, 'clean', TRUE, 'CP-RM-1041', NULL),
('105', 1, 'nonac', 'Heritage Non-AC Room', 2, 'dirty', FALSE, NULL, 'Housekeeping requested fresh linens'),
('106', 1, 'nonac', 'Heritage Non-AC Room', 2, 'clean', FALSE, NULL, NULL),
('107', 1, 'nonac', 'Heritage Non-AC Room', 3, 'clean', FALSE, NULL, NULL),
('108', 1, 'nonac', 'Heritage Non-AC Room', 2, 'inspected', FALSE, NULL, NULL),
('201', 2, 'ac', 'Paradise AC Suite with Balcony', 3, 'clean', TRUE, 'CP-RM-1042', NULL),
('202', 2, 'ac', 'Paradise AC Suite with Balcony', 3, 'cleaning_in_progress', FALSE, NULL, NULL),
('203', 2, 'ac', 'Paradise AC Suite (Altinho Hill View)', 3, 'clean', FALSE, NULL, NULL),
('204', 2, 'ac', 'Paradise AC Suite (Altinho Hill View)', 3, 'clean', TRUE, 'CP-RM-1044', NULL),
('205', 2, 'ac', 'Paradise AC Suite', 3, 'clean', FALSE, NULL, NULL),
('206', 2, 'ac', 'Paradise AC Suite', 3, 'out_of_order', FALSE, NULL, 'AC compressor scheduled for servicing'),
('207', 2, 'nonac', 'Heritage Non-AC Room', 2, 'clean', FALSE, NULL, NULL),
('208', 2, 'nonac', 'Heritage Non-AC Room', 3, 'clean', FALSE, NULL, NULL),
('209', 2, 'nonac', 'Heritage Non-AC Room', 2, 'clean', FALSE, NULL, NULL),
('210', 2, 'nonac', 'Heritage Non-AC Room', 2, 'clean', FALSE, NULL, NULL)
ON CONFLICT (room_number) DO NOTHING;

-- 4. Insert Vehicles Fleet
INSERT INTO public.vehicles (id, name, category, registration_number, daily_rate, image, is_available, status) VALUES
('activa', 'Honda Activa 6G', '2-wheeler', 'GA-07-AB-4192', 400, '/activa.png', FALSE, 'rented'),
('dio', 'Honda Dio 110', '2-wheeler', 'GA-07-CD-8812', 400, '/WhatsApp_Image_2026-08-11_at_6.56.54_PM__2_-removebg-preview.png', TRUE, 'available'),
('fascino', 'Yamaha Fascino 125', '2-wheeler', 'GA-07-EF-9921', 400, '/fasc.png', TRUE, 'available'),
('swift', 'Maruti Suzuki Swift VXi', '4-wheeler', 'GA-07-GH-1234', 1500, '/WhatsApp Image 2026-08-11 at 6.56.54 PM.jpeg', FALSE, 'rented'),
('ertiga', 'Maruti Suzuki Ertiga 7-Seater', '4-wheeler', 'GA-07-JK-5678', 2500, '/WhatsApp Image 2026-08-11 at 6.56.53 PM (1).jpeg', TRUE, 'available')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Dining Tables
INSERT INTO public.dining_tables (id, name, section, capacity, is_occupied, current_booking_id) VALUES
('T-1', 'Table 1', 'Main Heritage Hall', 4, FALSE, NULL),
('T-2', 'Table 2', 'Main Heritage Hall', 4, FALSE, NULL),
('T-3', 'Table 3', 'Main Heritage Hall', 2, FALSE, NULL),
('T-4', 'Table 4', 'Main Heritage Hall', 6, FALSE, NULL),
('T-5', 'Table 5 (Garden Gazebo)', 'Garden Courtyard', 4, FALSE, NULL),
('T-6', 'Table 6 (Fountain Side)', 'Garden Courtyard', 2, FALSE, NULL),
('T-7', 'Table 7 (Balcony Sunset)', 'Balcony', 2, TRUE, 'CP-DN-3091'),
('T-8', 'Table 8 (Balcony Altinho View)', 'Balcony', 4, FALSE, NULL),
('T-9', 'Table 9 (Private Alcove)', 'Private Lounge', 6, FALSE, NULL),
('T-10', 'Table 10 (Executive Table)', 'Private Lounge', 8, FALSE, NULL)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Seed Guests
INSERT INTO public.guests (id, name, email, phone, address, id_proof_type, id_proof_number, nationality, tags, total_bookings, total_spent, notes, last_visit) VALUES
('GST-101', 'Aarav Singhania', 'aarav.singhania@gmail.com', '+91 98201 44521', 'Bandra West, Mumbai', 'Aadhaar', 'XXXX-XXXX-9281', 'Indian', ARRAY['VIP', 'Repeat Guest'], 3, 16400, 'Prefers 2nd floor heritage view room with extra pillows. Vegetarian breakfast.', '2026-08-11'),
('GST-102', 'Pooja & Rohan Mehra', 'pooja.mehra@outlook.com', '+91 98450 88219', 'Indiranagar, Bengaluru', 'Passport', 'Z8192041', 'Indian', ARRAY['Honeymoon'], 2, 9600, 'Honeymoon couple. Arrange complimentary Goan wine bottle on arrival.', '2026-08-11'),
('GST-103', 'Vikram Malhotra', 'v.malhotra@techcorp.in', '+91 97110 33490', 'Cyber Hub, Gurugram', 'Driving License', 'DL-04-2018-09123', 'Indian', ARRAY['Corporate', 'Long Stay'], 2, 14800, 'Business traveler attending offshore conference. High-speed WiFi requested.', '2026-08-12'),
('GST-104', 'Elena Rostova', 'elena.rostova@travel.de', '+49 176 5542109', 'Munich, Germany', 'Passport', 'DE-9920194', 'German', ARRAY['Repeat Guest'], 2, 7200, 'Loves Fontainhas heritage architecture and Goan prawn curry.', '2026-08-09')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Seed Room Bookings
INSERT INTO public.room_bookings (id, guest_id, guest_name, guest_phone, guest_email, room_type, room_title, occupancy, check_in, check_out, nights, base_rate, total_price, status, payment_status, payment_method, room_number, special_requests, staff_notes) VALUES
('CP-RM-1041', 'GST-101', 'Aarav Singhania', '+91 98201 44521', 'aarav.singhania@gmail.com', 'ac', 'Paradise AC Suite', 'double', '2026-08-10', '2026-08-13', 3, 1800, 5400, 'checked_in', 'paid', 'upi', '104', 'Quiet room facing courtyard, extra pillows', 'VIP guest checked in by Manager Desk. Given room 104 key card.'),
('CP-RM-1042', 'GST-102', 'Pooja & Rohan Mehra', '+91 98450 88219', 'pooja.mehra@outlook.com', 'ac', 'Paradise AC Suite with Balcony', 'double', '2026-08-11', '2026-08-14', 3, 1800, 5400, 'checked_in', 'paid', 'card', '201', 'Honeymoon room decoration with rose petals & Goan wine', 'Complimentary wine bottle delivered to Suite 201.'),
('CP-RM-1043', 'GST-103', 'Vikram Malhotra', '+91 97110 33490', 'v.malhotra@techcorp.in', 'nonac', 'Heritage Non-AC Room', 'single', '2026-08-12', '2026-08-16', 4, 1200, 4800, 'confirmed', 'advance_paid', 'online', '106', 'Work desk near window with high-speed internet', 'Advance of ₹2,000 received via Razorpay. Balance ₹2,800 due at check-in.'),
('CP-RM-1044', 'GST-104', 'Elena Rostova', '+49 176 5542109', 'elena.rostova@travel.de', 'ac', 'Paradise AC Suite (Altinho Hill View)', 'single', '2026-08-11', '2026-08-13', 2, 1200, 2400, 'checked_in', 'paid', 'card', '204', 'Top floor room overlooking Altinho tree-canopy', 'Passport verified upon check-in.')
ON CONFLICT (id) DO NOTHING;

-- 8. Insert Seed Vehicle Bookings
INSERT INTO public.vehicle_bookings (id, guest_id, guest_name, guest_phone, guest_email, vehicle_id, vehicle_name, vehicle_category, vehicle_image, registration_number, pickup_date, return_date, days, daily_rate, total_price, status, payment_status, payment_method, license_number, helmet_count, deposit_amount, hotel_delivery, fuel_level_on_pickup, special_requests, staff_notes) VALUES
('CP-VH-2081', 'GST-101', 'Aarav Singhania', '+91 98201 44521', 'aarav.singhania@gmail.com', 'activa', 'Honda Activa 6G', '2-wheeler', '/activa.png', 'GA-07-AB-4192', '2026-08-10', '2026-08-13', 3, 400, 1200, 'handed_over', 'paid', 'cash', 'MH-02-2016-77881', 2, 1000, TRUE, 'Full', 'Two clean full-face helmets requested', 'Vehicle keys and 2 helmets given. ₹1000 security deposit in safe.'),
('CP-VH-2082', 'GST-102', 'Pooja & Rohan Mehra', '+91 98450 88219', 'pooja.mehra@outlook.com', 'swift', 'Maruti Suzuki Swift VXi', '4-wheeler', '/WhatsApp Image 2026-08-11 at 6.56.54 PM.jpeg', 'GA-07-GH-1234', '2026-08-11', '2026-08-13', 2, 1500, 3000, 'handed_over', 'paid', 'upi', 'KA-05-2019-11204', 0, 3000, TRUE, 'Full', 'Car with chilled AC for South Goa heritage church tour', 'Handover complete. Chilled AC confirmed, fuel full.')
ON CONFLICT (id) DO NOTHING;

-- 9. Insert Seed Dining Bookings
INSERT INTO public.dining_bookings (id, guest_id, guest_name, guest_phone, guest_email, date, time_slot, party_size, dietary_preferences, special_requests, table_number, status, estimated_bill, staff_notes) VALUES
('CP-DN-3091', 'GST-101', 'Aarav Singhania', '+91 98201 44521', 'aarav.singhania@gmail.com', '2026-08-11', 'Dinner (7:30 PM - 11:00 PM)', 2, 'Goan Seafood Special (Kingfish / Prawns)', 'Anniversary celebration. Dessert with sparkle candle.', 'T-7', 'seated', 1800, 'Chef informed about complimentary anniversary dessert.'),
('CP-DN-3092', 'GST-102', 'Pooja & Rohan Mehra', '+91 98450 88219', 'pooja.mehra@outlook.com', '2026-08-12', 'Dinner (7:30 PM - 11:00 PM)', 2, 'Romantic Candlelight Dinner (Goan & Continental)', 'Balcony table with panoramic river lights view', 'T-8', 'confirmed', 2200, 'Balcony table T-8 reserved for dinner.')
ON CONFLICT (id) DO NOTHING;

-- 10. Insert Seed Maintenance Tickets
INSERT INTO public.maintenance_tickets (id, room_number, area, issue_title, description, priority, status, reported_by, assigned_to) VALUES
('MNT-101', '206', 'Room', 'AC Cooling Efficiency Low', 'Compressor gas recharge scheduled with Daikin technician.', 'high', 'in_progress', 'Housekeeping Supervisor', 'Daikin Service Team'),
('MNT-102', NULL, 'Restaurant', 'Balcony Garden Light Restringing', 'Replace 2 fairy light bulbs near Table 7 balcony pergola.', 'medium', 'resolved', 'F&B Manager', 'In-house Electrician')
ON CONFLICT (id) DO NOTHING;

-- 11. Insert Seed Guest Folio
INSERT INTO public.guest_folios (id, guest_id, guest_name, guest_phone, guest_email, room_booking_id, room_number, check_in, check_out, items, subtotal, tax_amount, discount_amount, grand_total, amount_paid, balance_due, status) VALUES
('FOL-801', 'GST-101', 'Aarav Singhania', '+91 98201 44521', 'aarav.singhania@gmail.com', 'CP-RM-1041', '104', '2026-08-10', '2026-08-13',
'[
  {"id": "FIT-1", "date": "2026-08-10", "category": "Room", "description": "Paradise AC Suite (3 Nights @ ₹1,800/night)", "qty": 3, "unitPrice": 1800, "taxRatePercent": 12, "totalPrice": 5400, "referenceId": "CP-RM-1041"},
  {"id": "FIT-2", "date": "2026-08-10", "category": "Vehicle", "description": "Honda Activa 6G Rental (3 Days @ ₹400/day)", "qty": 3, "unitPrice": 400, "taxRatePercent": 18, "totalPrice": 1200, "referenceId": "CP-VH-2081"},
  {"id": "FIT-3", "date": "2026-08-11", "category": "Dining", "description": "Goan Seafood Dinner & Wine (Table T-7)", "qty": 1, "unitPrice": 1800, "taxRatePercent": 5, "totalPrice": 1800, "referenceId": "CP-DN-3091"}
]'::jsonb,
8400, 954, 0, 9354, 6600, 2754, 'open')
ON CONFLICT (id) DO NOTHING;

-- 12. Insert Seed Activity Logs
INSERT INTO public.activity_logs (id, timestamp, type, action, title, description, guest_name, booking_id, room_number) VALUES
('LOG-1', '2026-08-11T19:45:00Z', 'dining', 'status_changed', 'Guest Seated at Balcony Table T-7', 'Aarav Singhania seated for Dinner table reservation (Party of 2).', 'Aarav Singhania', 'CP-DN-3091', NULL),
('LOG-2', '2026-08-11T14:00:00Z', 'room', 'status_changed', 'Honeymoon Couple Checked In', 'Pooja & Rohan Mehra checked into Suite 201 with Balcony.', 'Pooja & Rohan Mehra', 'CP-RM-1042', '201'),
('LOG-3', '2026-08-11T10:30:00Z', 'vehicle', 'status_changed', 'Swift Hatchback Handed Over', 'Maruti Suzuki Swift handed over to Pooja & Rohan Mehra (2 Days rental).', 'Pooja & Rohan Mehra', 'CP-VH-2082', NULL),
('LOG-4', '2026-08-10T13:30:00Z', 'room', 'status_changed', 'Guest Checked In', 'Aarav Singhania checked into Paradise AC Suite (Room 104).', 'Aarav Singhania', 'CP-RM-1041', '104')
ON CONFLICT (id) DO NOTHING;
