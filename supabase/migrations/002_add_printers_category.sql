-- Adds the "Printers & Accessories" catalogue.
-- Run once in Supabase → SQL Editor → New query → Run (safe to run again).
alter table public.products drop constraint if exists products_category_check;
alter table public.products
  add constraint products_category_check
  check (category in ('camera','laptop','camera-accessories','laptop-accessories','printers'));
