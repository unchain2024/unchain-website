import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  // The Supabase database is provisioned through the Vercel Marketplace, which injects
  // its credentials as NEXT_PUBLIC_SUPABASE_* (browser-safe by contract). Expose that
  // narrow prefix alongside the usual VITE_ one so the client can read them.
  envPrefix: ["VITE_", "NEXT_PUBLIC_SUPABASE_"],
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
