-- ============================================================
-- SOAMI JI ENTERPRISES — Supabase schema
-- Run this once in Supabase → SQL Editor → New query → Run
-- ============================================================

create extension if not exists "pgcrypto";

-- Products (4 catalogues)
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  category    text not null check (category in ('camera','laptop','camera-accessories','laptop-accessories','printers','software')),
  name        text not null,
  description text not null default '',
  location    text not null default '',
  mrp         numeric(12,2) not null check (mrp >= 0),
  discount    numeric(5,2)  not null default 0 check (discount >= 0 and discount <= 100),
  condition   text not null default 'new' check (condition in ('new','used')),
  unit        text not null default 'PCS',
  image_url   text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category, active, created_at desc);

-- Leads = future customers (saved every time someone generates a quotation)
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  phone         text not null unique,
  email         text,
  address       text,
  quote_count   int  not null default 0,
  last_quote_at timestamptz,
  created_at    timestamptz not null default now()
);

-- Quotations
create table if not exists public.quotations (
  id               uuid primary key default gen_random_uuid(),
  seq              bigserial,
  quote_no         text not null,
  lead_id          uuid references public.leads(id) on delete set null,
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  customer_address text,
  note             text,
  items            jsonb not null,
  total_mrp        numeric(12,2) not null,
  total_discount   numeric(12,2) not null,
  grand_total      numeric(12,2) not null,
  created_at       timestamptz not null default now()
);
create index if not exists quotations_created_idx on public.quotations (created_at desc);

-- Row Level Security: the website talks to Supabase only from the server
-- using the service-role key, so we lock everything down for anon users.
alter table public.products   enable row level security;
alter table public.leads      enable row level security;
alter table public.quotations enable row level security;

-- Public storage bucket for product photos
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;
