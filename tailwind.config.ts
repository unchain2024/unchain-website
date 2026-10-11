import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "5vw",
      screens: {},
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      colors: {
        /* Lifted verbatim from the home-page design SVGs — do not re-derive. */
        hd: {
          "hero-top": "#1F2B42",
          eyebrow: "#A4A7AE",
          "eyebrow-ink": "#535862",
          "eyebrow-light": "#D5D7DA",
          hairline: "#D5D7DA",
          chevron: "#414651",
          panel: "#F5F5F5",
          join: "#314768",
          banner: "#717680",
          navy: "#0E3067",
          /* Added by the business page — same provenance, from public/business. */
          "card-line": "#E9EAEB",
          ink: "#0A0D12",
          /* Added by the article page, from public/news/pernews. The same ink as
             `chevron`, named for the job it does there: article body copy. */
          "body-ink": "#414651",
          /* Added by the contact page, from public/contact. The red the form's required
             marks are drawn in, and the only place the design uses it. */
          required: "#D92D20",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        dark: {
          bg: "hsl(var(--dark-bg))",
          fg: "hsl(var(--dark-fg))",
          muted: "hsl(var(--dark-muted))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        /* The join strip's drift. It runs to 0 from -50% rather than the other way
           round because the photos travel left to right; the track is two identical
           copies, so half its width is one full set and the loop has no seam. */
        "marquee-right": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        /* The partner wall's drift, the mirror of the join strip: the logos travel
           right to left, so the track runs from 0 to -50%. Same two-copy trick — half
           the track is one whole set, so the wrap has no seam. */
        "marquee-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "marquee-right": "marquee-right 45s linear infinite",
        "marquee-left": "marquee-left 55s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
