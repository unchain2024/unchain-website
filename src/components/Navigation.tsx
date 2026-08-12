import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Check } from "lucide-react";
import { useLang } from "@/lib/language";
import { nav as navContent, languages } from "@/components/home/content";
import { UnchainLogo } from "@/components/home/Logo";
import { Globe, ArrowUpRight, ChevronRight } from "@/components/home/icons";
import { FlagUS, FlagJP } from "@/components/home/flags";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

/**
 * Site header — matches the navigation drawn at the top of `public/home/Hero.svg`
 * (page top) and `public/Navigation PC - Scrolling.svg` (scrolled).
 *
 * Design geometry at 1440w: 40px side gutters, 68px tall, a 141x31.4 logo, then
 * 37px to the 16px links which sit 36px apart, then a 36px globe button, a 98x36
 * "Neuron" pill and a 94x36 white "Book a demo" button, each separated by 8px.
 * Outlines are #D5D7DA. The bar never hides; once the page scrolls it gains the
 * 68px-tall `black @ 50%` scrim the scrolling SVG draws behind the row.
 *
 * Mobile geometry, from the exports in `public/mobile` — all ten draw the same bar:
 * 63.3px tall on a 24px gutter, the same 141x31.4 logo at the left and a 24px
 * hamburger at the right, closed off by a 1px #E9EAEB hairline. (The exports also
 * draw an information banner above it; the site does not carry one, so it is not
 * built here.)
 */
const NAV_H = "h-[63.3px] lg:h-[68px]";

const Navigation = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { lang, setLang, localePath } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-nav-theme]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const t = entry.target.getAttribute("data-nav-theme");
            if (t === "light" || t === "dark") setTheme(t);
          }
        }
      },
      { rootMargin: "-0px 0px -90% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* The drawer covers the page, so the page behind it must not scroll under it. */
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const isLight = theme === "light";
  const t = navContent[lang];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50">
      {/* Scrolled scrim — the full-bleed 68px `black @ 50%` rect from
          `public/Navigation PC - Scrolling.svg`, mirrored to white over the
          light sections so the dark ink stays legible.

          Below `lg` the mobile exports draw the bar itself: solid white with a
          #E9EAEB hairline on the light pages, and nothing at all over the home
          hero, where the dark gradient shows through. */}
      <div className={`relative ${NAV_H}`}>
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 transition-colors duration-300 ${
            isLight
              ? "border-b border-hd-card-line bg-white lg:border-0 lg:bg-transparent"
              : ""
          } ${
            scrolled
              ? isLight
                ? "lg:bg-white/50"
                : "bg-black/50"
              : "lg:bg-transparent"
          }`}
        />

        <div className="relative mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-6 lg:px-10">
        {/* Logo + primary links */}
        <div className="flex items-center gap-10 xl:gap-[37px]">
          <Link to={localePath("/")} aria-label="UNCHAIN">
            <UnchainLogo
              className={`h-[31.4px] w-[141px] transition-colors duration-500 ${
                isLight ? "text-black" : "text-white"
              }`}
            />
          </Link>

          <div className="hidden items-center gap-6 xl:flex xl:gap-[36px]">
            {t.items.map((item) => (
              <Link
                key={item.href}
                to={localePath(item.href)}
                className={`whitespace-nowrap text-[16px] leading-none transition-colors duration-500 ${
                  isLight
                    ? "text-black hover:text-black/60"
                    : "text-white hover:text-white/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="hidden items-center gap-2 md:flex">
          {user && (
            <>
              <Link
                to="/admin"
                className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[13px] font-bold text-primary transition-colors hover:bg-primary/20"
              >
                ADMIN
              </Link>
              <button
                onClick={handleLogout}
                className={`px-2 text-[14px] transition-colors duration-500 ${
                  isLight
                    ? "text-black hover:text-destructive"
                    : "text-white hover:text-red-400"
                }`}
              >
                Logout
              </button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label={t.language}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-hd-hairline outline-none transition-colors duration-500 ${
                  isLight
                    ? "text-black hover:bg-black/5"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Globe />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-[140px]">
              {languages.map((option) => {
                const Flag = option.code === "en" ? FlagUS : FlagJP;
                return (
                  <DropdownMenuItem
                    key={option.code}
                    onSelect={() => setLang(option.code)}
                    className="cursor-pointer gap-2.5"
                  >
                    <Flag className="h-[14px] w-5 shrink-0 rounded-[2px]" />
                    <span className="text-[14px] font-medium">
                      {option.label}
                    </span>
                    {lang === option.code && (
                      <Check className="ml-auto h-4 w-4 shrink-0" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <a
            href={t.neuronHref}
            target="_blank"
            rel="noreferrer"
            className={`flex h-9 items-center gap-[11px] rounded-full border border-hd-hairline pl-[13px] pr-[18px] text-[14px] leading-none transition-colors duration-500 ${
              isLight
                ? "text-black hover:bg-black/5"
                : "text-white hover:bg-white/10"
            }`}
          >
            {t.neuron}
            <ArrowUpRight className="text-hd-eyebrow" />
          </a>

          <Link
            to={localePath("/contact")}
            className="flex h-9 items-center rounded-full bg-white px-[12px] text-[14px] leading-none text-black transition-opacity hover:opacity-90"
          >
            {t.demo}
          </Link>
        </div>

        {/* Mobile toggle — the exports draw a 24px, 2px-stroke hamburger whose ink
            runs x 348..366, i.e. flush to the same 24px gutter as the logo. */}
        <button
          className={`-mr-[3px] transition-colors duration-500 xl:hidden ${
            mobileOpen || isLight ? "text-black" : "text-white"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </div>

      {/* Mobile menu.

          The exports draw the closed header only, so the sheet is built from the
          same parts the rest of the mobile design uses: the 24px gutter, #E9EAEB
          hairlines between rows, and the full-measure 50px pill the mobile buttons
          are drawn as. It fills the rest of the viewport under the bar so the page
          behind it is never half-visible. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="max-h-[calc(100svh-var(--nav-h))] overflow-y-auto overscroll-contain border-t border-hd-card-line bg-white xl:hidden"
          >
            <div className="flex w-full flex-col px-6 pb-10 pt-2">
              {t.items.map((item) => (
                <Link
                  key={item.href}
                  to={localePath(item.href)}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b border-hd-card-line py-[18px] text-[18px] leading-none text-black"
                >
                  {item.label}
                  <ChevronRight className="text-hd-chevron" />
                </Link>
              ))}

              {user && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-hd-card-line py-[18px] text-[18px] font-bold leading-none text-primary"
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="border-b border-hd-card-line py-[18px] text-left text-[18px] leading-none text-destructive"
                  >
                    Logout
                  </button>
                </>
              )}

              <div className="mt-6 flex items-center gap-2">
                {languages.map((option) => {
                  const Flag = option.code === "en" ? FlagUS : FlagJP;
                  const active = lang === option.code;
                  return (
                    <button
                      key={option.code}
                      onClick={() => {
                        setLang(option.code);
                        setMobileOpen(false);
                      }}
                      aria-current={active ? "true" : undefined}
                      className={`flex h-[42px] flex-1 items-center justify-center gap-2 rounded-full border text-[15px] leading-none transition-colors ${
                        active
                          ? "border-black bg-black text-white"
                          : "border-hd-hairline text-black"
                      }`}
                    >
                      <Flag className="h-[14px] w-5 shrink-0 rounded-[2px]" />
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <a
                href={t.neuronHref}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-4 flex h-[50px] items-center justify-center gap-[11px] rounded-full border border-hd-hairline text-[16px] leading-none text-black"
              >
                {t.neuron}
                <ArrowUpRight className="text-hd-eyebrow" />
              </a>

              <Link
                to={localePath("/contact")}
                onClick={() => setMobileOpen(false)}
                className="mt-4 flex h-[50px] items-center justify-center rounded-full bg-black text-[16px] leading-none text-white"
              >
                {t.demo}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
