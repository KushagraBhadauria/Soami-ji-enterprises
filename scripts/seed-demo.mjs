// Writes SAMPLE products for local demo mode only. Delete them from the admin panel before launch.
import { writeFileSync, mkdirSync } from "fs";
import { randomUUID } from "crypto";
const P = (category, name, description, mrp, discount, image, condition = "new") => ({
  id: randomUUID(), category, name, description, location: "Main shop, Kanpur", mrp, discount, condition, unit: "PCS",
  image_url: `/demo/${image}.svg`, active: true, created_at: new Date(Date.now() - Math.random() * 1e9).toISOString(),
});
const items = [
  P("camera", "Sample 2MP HD Dome Camera", "Model SJ-D2MP · full HD indoor dome, 20m night vision, 1-year warranty", 1899, 22, "dome"),
  P("camera", "Sample 5MP Bullet Camera", "Model SJ-B5MP · outdoor weatherproof IP67, 30m IR night vision, metal body", 3499, 18, "bullet"),
  P("camera", "Sample Wi-Fi Smart Camera", "Model SJ-W360 · 360° pan-tilt, two-way talk, mobile app, SD card", 2799, 25, "dome"),
  P("camera", "Sample 2MP Bullet Camera (Used)", "Model SJ-B2MP · tested & cleaned, outdoor, IR night vision, shop warranty", 1499, 45, "bullet", "used"),
  P("laptop", "Sample Business Laptop 14\"", "Model SJ-BL14 · Core i5, 8GB RAM, 512GB SSD, Windows 11", 52990, 12, "laptop"),
  P("laptop", "Sample Student Laptop 15.6\"", "Model SJ-SL15 · Ryzen 3, 8GB RAM, 256GB SSD, full HD display", 34990, 10, "laptop"),
  P("laptop", "Refurbished Laptop i5 8th Gen", "Model SJ-R8 · Core i5, 8GB RAM, 256GB SSD, 6-month shop warranty", 32000, 50, "laptop", "used"),
  P("camera-accessories", "Sample 8-Channel DVR", "Model SJ-DVR8 · supports 5MP, H.265+, mobile view, 1 SATA port", 6499, 20, "dvr"),
  P("camera-accessories", "Sample 1TB Surveillance Hard Disk", "Model SJ-HD1T · 24×7 recording drive for DVR/NVR, 3-year warranty", 4599, 15, "hdd"),
  P("laptop-accessories", "Sample Wireless Mouse", "Model SJ-M100 · 2.4GHz silent click, 12-month battery life", 699, 30, "mouse"),
  P("laptop-accessories", "Sample 65W Laptop Charger", "Model SJ-C65 · universal pin set, overload protection, 6-month warranty", 1499, 28, "charger"),
  P("laptop-accessories", "Sample USB Keyboard", "Model SJ-K200 · full-size spill-resistant keyboard, quiet keys, plug-and-play", 799, 20, "keyboard"),
];
mkdirSync("data", { recursive: true });
writeFileSync("data/products.json", JSON.stringify(items, null, 2));
console.log(`Seeded ${items.length} sample products into data/products.json`);
