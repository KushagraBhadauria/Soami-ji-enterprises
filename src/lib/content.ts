/** Editable website copy (services, FAQs, values). */

export const services = [
  {
    icon: "Cctv",
    title: "CCTV Camera Installation",
    text: "Complete setup for homes, shops, offices, schools and factories — site survey, camera placement, wiring, DVR/NVR and mobile viewing.",
    points: ["Free site survey", "HD / IP / Wi-Fi cameras", "Live view on your phone"],
  },
  {
    icon: "Wrench",
    title: "CCTV Service & AMC",
    text: "We service cameras installed by anyone — not just us. Repairs, re-wiring, DVR issues, hard-disk replacement and yearly maintenance (AMC).",
    points: ["Any brand, any installer", "Annual maintenance plans", "Quick breakdown support"],
  },
  {
    icon: "Laptop",
    title: "Laptop, Computer & Printer Repair",
    text: "Chip-level and part-level repair for laptops, desktops and printers: screen, keyboard, battery, motherboard, paper jams, print-head cleaning and data recovery.",
    points: ["All major brands", "Genuine & compatible parts", "Transparent pricing"],
  },
  {
    icon: "Cpu",
    title: "Upgrades & Installation",
    text: "Make old machines fast again — SSD and RAM upgrades, Windows/OS installation, software setup, antivirus and data transfer.",
    points: ["SSD & RAM upgrades", "OS & software setup", "Data backup & transfer"],
  },
  {
    icon: "Recycle",
    title: "Second-hand Laptops & Cameras",
    text: "Quality-checked refurbished laptops, desktops and CCTV equipment at great prices — tested, cleaned and backed by shop warranty.",
    points: ["Tested & certified", "Shop warranty", "Exchange offers"],
  },
  {
    icon: "Network",
    title: "Networking & Accessories",
    text: "Wi-Fi routers, LAN cabling, switches and all CCTV and laptop accessories — chargers, batteries, cables, hard disks and more.",
    points: ["Home & office Wi-Fi", "Structured cabling", "Accessories in stock"],
  },
] as const;

export const brands = ["Hikvision", "CP Plus", "Dahua", "Honeywell", "Godrej", "TP-Link", "HP", "Dell", "Lenovo", "Asus", "Acer", "Apple", "Seagate", "WD", "Canon", "Epson", "Brother", "Quick Heal", "K7", "Microsoft"];

export const faqs = [
  {
    q: "Do you service CCTV cameras installed by someone else?",
    a: "Yes. We repair and maintain cameras, DVRs and NVRs of all brands, no matter who installed them. We also offer annual maintenance contracts (AMC).",
  },
  {
    q: "How does the online quotation work?",
    a: "Add the products you need to your quotation list, choose quantities, enter your name and mobile number and click Generate. You get a PDF quotation instantly — no payment is taken online. Our team will call you to confirm.",
  },
  {
    q: "Are the prices on the website final?",
    a: "Website prices include our current discount. Installation, wiring and accessories depend on your site, so we confirm the final amount after a free site survey.",
  },
  {
    q: "Do second-hand laptops and cameras come with warranty?",
    a: "Yes. Every second-hand product is tested and cleaned before sale and carries a shop warranty. The warranty period is mentioned at the time of purchase.",
  },
  {
    q: "Do you provide doorstep service?",
    a: "Yes, for CCTV installation and service we come to your home or office. Laptop and computer repairs can be done at our shop or picked up on request.",
  },
];

export const steps = [
  { title: "Pick your products", text: "Browse cameras, laptops and accessories and add what you need — any mix, any quantity." },
  { title: "Enter name & mobile", text: "Just two details. No sign-up, no payment, no spam." },
  { title: "Download your quotation", text: "Get a professional PDF quotation instantly. We'll call you to finalise." },
];
