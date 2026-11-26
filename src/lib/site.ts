/**
 * ============================================================
 *  SHOP DETAILS — edit this one file to update the whole site
 *  (header, footer, contact page, About page and quotation PDF)
 * ============================================================
 */
export const site = {
  name: "SOAMI JI ENTERPRISES",
  shortName: "SOAMI JI",
  /** Parent brand — shown on the logo and as the "advertisement" on quotations */
  brand: "SOAMI JI ENTERPRISES",
  /** Slogan */
  tagline: "Sales and Fast Service",
  description:
    "CCTV camera installation, laptop & computer sales and repair, new and second-hand products with great discounts — all under one roof in Kanpur.",
  logo: "/logo.jpg",

  // ---- Contact ----
  phone: "+91 97922 78383",
  whatsapp: "919792278383", // digits only, with country code
  email: "soamijicomputer@rediffmail.com",
  address: "EWS 537, Double Storey Colony, Barra 2, Kanpur - 208027, Uttar Pradesh",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Double%20Storey%20Colony%20Barra%202%20Kanpur%20208027&output=embed",
  hours: "Mon – Sat: 10:00 AM – 8:00 PM",
  gstin: "09CLRPP8429A1ZN",
  established: 2010,

  // ---- Quotation settings ----
  quotation: {
    // Website quotations: SJ/QO/26-27/W1, W2 … ("W" keeps them separate from your billing-app series)
    prefix: "SJ/QO",
    serialPrefix: "W",
    validityDays: 3,
    terms: [
      "Please Pay seventy percent advance of total estimate.",
      "Physical damage and burning no warranty.",
      "For any types of warranty contact service centre Dealer will not be responsible for warranty.",
      "Please insure the location before installing of cctv camera, in case of any changes in location additional charges will be applicable.",
      "Quotation/Estimate valid for 3 days from the generated Date.",
      "All subjects to kanpur jurisdiction only.",
    ],
  },

  social: {
    facebook: "",
    instagram: "",
    youtube: "",
  },
};

export const units = ["PCS", "MTR", "BDL", "SET", "BOX", "ROLL", "NOS", "LICENSE", "USER"] as const;

export type Category = "camera" | "laptop" | "camera-accessories" | "laptop-accessories" | "printers" | "software";

export const categories: {
  slug: Category;
  title: string;
  short: string;
  blurb: string;
  icon: "cctv" | "laptop" | "cable" | "mouse" | "printer" | "shield";
}[] = [
  {
    slug: "camera",
    title: "CCTV Cameras",
    short: "Cameras",
    blurb: "Dome, bullet, Wi-Fi, PTZ and IP cameras — new & second-hand.",
    icon: "cctv",
  },
  {
    slug: "laptop",
    title: "Laptops & Computers",
    short: "Laptops",
    blurb: "Business, student and gaming laptops, desktops — new & refurbished.",
    icon: "laptop",
  },
  {
    slug: "camera-accessories",
    title: "Camera Accessories",
    short: "Camera Acc.",
    blurb: "DVR/NVR, hard disks, SMPS, cables, connectors, racks and more.",
    icon: "cable",
  },
  {
    slug: "laptop-accessories",
    title: "Laptop Accessories",
    short: "Laptop Acc.",
    blurb: "Chargers, batteries, keyboards, mice, RAM, SSDs, bags and more.",
    icon: "mouse",
  },
  {
    slug: "printers",
    title: "Printers & Accessories",
    short: "Printers",
    blurb: "Inkjet, laser & ink-tank printers, cartridges, toner, ink and cables.",
    icon: "printer",
  },
  {
    slug: "software",
    title: "Antivirus & Software",
    short: "Software",
    blurb: "Genuine antivirus, Windows, MS Office and other licences — installed for you.",
    icon: "shield",
  },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
