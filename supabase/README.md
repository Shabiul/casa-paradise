# Casa Paradiso - Supabase Database Setup Guide

This project is configured to synchronize in real time with your **Supabase PostgreSQL** database.

---

## Step 1: Run the Database Migration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project (or create a new free project).
3. Open the **SQL Editor** tab from the left sidebar.
4. Click **New Query**, paste the contents of [`supabase/schema.sql`](./schema.sql), and click **Run**.

This will automatically create:
- All 11 relational tables (`guests`, `rooms`, `room_bookings`, `vehicles`, `vehicle_bookings`, `dining_tables`, `dining_bookings`, `maintenance_tickets`, `guest_folios`, `activity_logs`, `hotel_settings`).
- Row Level Security (RLS) policies.
- Realtime replication channels for instant inter-tab/inter-device sync.
- Pre-populated initial seed data with the hotel's 18 rooms, vehicle fleet, tables, and demo records.

---

## Step 2: Configure Environment Variables

1. In your Supabase project dashboard, navigate to **Project Settings > API**.
2. Copy your **Project URL** and **anon public Key**.
3. Create `.env.local` in both `crm/` and `web/` (or copy from `.env.local.example`):

### In `crm/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### In `web/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## Step 3: Run the Applications

Start both services:

```bash
# Terminal 1: Start CRM portal on port 3001
cd crm
npm run dev

# Terminal 2: Start Guest Web Application on port 3000
cd web
npm run dev
```

The CRM Topbar will show a green **"Supabase Cloud Connected"** status indicator, and any bookings or changes made from the guest website or CRM will sync bi-directionally in real time!
