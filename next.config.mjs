/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  // Make sure the PDF fonts, logo and watermark are deployed with the server functions (Vercel)
  outputFileTracingIncludes: {
    "/api/**/*": ["./assets/**/*"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
};
export default nextConfig;
