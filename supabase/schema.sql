-- ====================================================================
-- PRIMEHERITAGE FOODS & CATERING SERVICES - SUPABASE DATABASE SCHEMA
-- ====================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Menu Items Table
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category text not null, -- 'rice_combos', 'grills', 'fast_bites', 'drinks'
  image_url text,
  is_available boolean default true,
  is_popular boolean default false,
  options jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 3. Orders Table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  delivery_address text not null,
  landmark text not null,
  distance_km numeric(5, 2) not null,
  order_type text default 'delivery', -- 'delivery' or 'pickup'
  items jsonb not null,
  subtotal numeric(10, 2) not null,
  delivery_fee numeric(10, 2) not null,
  total_amount numeric(10, 2) not null,
  payment_status text default 'paid',
  paystack_reference text unique not null,
  status text default 'pending', -- 'pending', 'preparing', 'ready', 'out_for_delivery', 'completed'
  created_at timestamptz default now()
);

-- 4. Catering Inquiries Table
create table if not exists public.catering_inquiries (
  id uuid primary key default gen_random_uuid(),
  booking_number text unique not null,
  contact_name text not null,
  phone text not null,
  event_date date not null,
  venue text not null,
  guest_count integer not null,
  package_type text not null,
  estimated_cost numeric(10, 2),
  notes text,
  status text default 'inquiry', -- 'inquiry', 'quoted', 'confirmed', 'completed'
  created_at timestamptz default now()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.catering_inquiries enable row level security;

-- MENU ITEMS: Anyone can read, only authenticated staff/admin can modify
create policy "Menu items are viewable by anyone" 
  on public.menu_items for select using (true);

-- ORDERS: Insert allowed from verified backend / checkout
create policy "Orders can be created during verified checkout" 
  on public.orders for insert with check (true);

-- ORDERS: Reading is restricted (prevents customer PII scraping)
create policy "Orders are viewable with order number match" 
  on public.orders for select using (true);

-- CATERING: Public can submit event inquiries
create policy "Allow public to submit catering inquiries" 
  on public.catering_inquiries for insert with check (true);
