-- Lit Perfumes initial schema
-- Hard Rule 1: available = on_hand - reserved; reserve atomically on order create.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.order_status as enum (
    'awaiting_payment',
    'paid',
    'cod_confirmed',
    'shipped',
    'delivered',
    'cancelled',
    'failed'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_method as enum ('paystack', 'cod');
exception when duplicate_object then null;
end $$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  concentration text not null default '',
  notes_top text[] not null default '{}',
  notes_mid text[] not null default '{}',
  notes_base text[] not null default '{}',
  images text[] not null default '{}',
  featured boolean not null default false,
  active boolean not null default true,
  gender text not null default 'Unisex',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size_ml integer not null,
  price_ghs numeric(12, 2) not null check (price_ghs >= 0),
  sku text not null unique,
  on_hand integer not null default 0 check (on_hand >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  constraint reserved_lte_on_hand check (reserved <= on_hand)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  status public.order_status not null,
  currency text not null default 'GHS',
  customer_name text not null,
  email text not null,
  phone text not null,
  address jsonb not null,
  gift_note text,
  payment_method public.payment_method not null,
  paystack_reference text unique,
  cod_flag boolean not null default false,
  subtotal numeric(12, 2) not null,
  shipping_fee numeric(12, 2) not null,
  total numeric(12, 2) not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  variant_id uuid references public.product_variants(id),
  product_name text not null,
  brand text not null,
  size_ml integer not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'dev'))
);

create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_email on public.orders(email);
create index if not exists idx_product_variants_product on public.product_variants(product_id);

create or replace view public.product_variants_available as
select
  id,
  product_id,
  size_ml,
  price_ghs,
  sku,
  on_hand,
  reserved,
  greatest(on_hand - reserved, 0) as available
from public.product_variants;

-- Atomic reserve: returns true if reserved, false if insufficient stock
create or replace function public.reserve_stock(p_variant_id uuid, p_qty integer)
returns boolean
language plpgsql
as $$
begin
  update public.product_variants
  set reserved = reserved + p_qty
  where id = p_variant_id
    and (on_hand - reserved) >= p_qty;
  return found;
end;
$$;

create or replace function public.release_stock(p_variant_id uuid, p_qty integer)
returns void
language plpgsql
as $$
begin
  update public.product_variants
  set reserved = greatest(reserved - p_qty, 0)
  where id = p_variant_id;
end;
$$;

-- Convert reservation to sold (on payment): decrease on_hand and reserved together
create or replace function public.confirm_stock_sale(p_variant_id uuid, p_qty integer)
returns void
language plpgsql
as $$
begin
  update public.product_variants
  set
    on_hand = greatest(on_hand - p_qty, 0),
    reserved = greatest(reserved - p_qty, 0)
  where id = p_variant_id;
end;
$$;

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public read active products" on public.products;
create policy "Public read active products"
  on public.products for select
  using (active = true);

drop policy if exists "Public read variants of active products" on public.product_variants;
create policy "Public read variants of active products"
  on public.product_variants for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.active = true
    )
  );

-- Orders: no anon policies — Next.js service role only
