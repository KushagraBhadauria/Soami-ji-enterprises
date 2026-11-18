# SOAMI JI ENTERPRISES — Website

CCTV • Laptops • Computers • Service. Built with **Next.js 15 + Tailwind + Supabase**.

## What's inside
| Area | URL | What it does |
|---|---|---|
| Home | `/` | Hero, 4 catalogues, latest products, services, top discounts, quote steps, brands, FAQ |
| Products | `/products`, `/products/camera`, `/products/laptop`, `/products/camera-accessories`, `/products/laptop-accessories` | 4 separate catalogues with search, New/Second-hand filter, sorting |
| Services / About / Contact | `/services`, `/about`, `/contact` | Content pages (contact form opens WhatsApp) |
| Quotation | `/quote` → `/quotation/<id>` | Cart → name + mobile (required) → instant PDF quotation |
| **Owner panel** | `/admin` | Password login |
| ↳ Upload product | `/admin/products/new` | Photo + name + description (with model no.) + location + MRP + discount % → live instantly |
| ↳ Future customers | `/admin/leads` | Everyone who generated a quote (name, mobile…), call/WhatsApp buttons, CSV export |
| ↳ Quotations | `/admin/quotations` | All quotations with PDF download |

When a customer generates a quotation:
1. Their name & mobile are saved in **Future customers** (repeat customers are matched by mobile number).
2. A PDF quotation is created in the shop's format with a running number like `SJ/QO/26-27/W1` (the "W" keeps website quotes separate from the billing-app series).
3. The owner gets an **email** with customer details, item list and the PDF attached.

## Where to edit things
- **Shop name, phone, WhatsApp, address, GSTIN, hours, quotation terms** → `src/lib/site.ts`
- **Services, FAQs, brand list** → `src/lib/content.ts`
- **Quotation PDF layout** → `src/lib/quotation-pdf.tsx` (one file)
- Colours → `tailwind.config.ts`

## Run locally (demo mode — no setup needed)
```bash
npm install
node scripts/seed-demo.mjs   # optional: adds 12 SAMPLE products
npm run dev                  # http://localhost:3000   admin password: admin123
```
Without Supabase keys the site stores data in `data/*.json` and photos in `public/uploads`. Delete the sample products from `/admin` before going live.

## Go live
1. **Supabase**: create a free project → SQL Editor → paste `supabase/schema.sql` → Run. Copy the URL and *service_role* key from Project Settings → API.
2. **Email alerts**: create (or use) a Gmail account just for the website, turn on 2-Step Verification, create an App Password, and put it in `SMTP_USER` / `SMTP_PASS`. Alerts are delivered to that same Gmail inbox.
3. Copy `.env.example` to `.env.local` and fill everything in.
4. **Deploy to Vercel**: push to GitHub → import in Vercel → add the same environment variables → Deploy. Add your domain in Vercel → Domains.

Security notes: prices on quotations are always taken from the database (not the browser); the admin area is protected by a password cookie; Supabase tables have RLS on and are accessed only from the server.
