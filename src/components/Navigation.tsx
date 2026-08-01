import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLang } from "@/lib/language";
import AnnouncementBar from "./AnnouncementBar";
import { nav as navContent } from "@/components/home/content";
import { UnchainLogo } from "@/components/home/Logo";
import { Globe, ArrowUpRight } from "@/components/home/icons";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

/**
 * Site header — matches the navigation drawn at the top of `public/home/Hero.svg`.
 *
 * Design geometry at 1440w: 40px side gutters, 68px tall, 16px links spaced 35px
 * apart, then a 36px globe button, a 98x36 "Neuron" pill and a 94x36 white
 * "Book a demo" button, each separated by 8px. Outlines are #D5D7DA.
 */
const Navigation = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [hidden, setHidden] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const lastScrollY = useRef(0);
  const { lang, toggleLang, localePath } = useLang();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
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

  const isLight = theme === "light";
  const t = navContent[lang];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 bg-transparent transition-transform duration-300"
      style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}
    >
      <AnnouncementBar />

      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between px-6 lg:px-10">
        {/* Logo + primary links */}
        <div className="flex items-center gap-10 xl:gap-[27px]">
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

          <button
            onClick={toggleLang}
            aria-label={t.language}
            title={lang === "ja" ? "English" : "日本語"}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-hd-hairline transition-colors duration-500 ${
              isLight
                ? "text-black hover:bg-black/5"
                : "text-white hover:bg-white/10"
            }`}
          >
            <Globe />
          </button>

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
            className="flex h-9 items-center rounded-full bg-white px-[13px] text-[14px] leading-none text-black transition-opacity hover:opacity-90"
          >
            {t.demo}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={`transition-colors duration-500 md:hidden ${
            isLight ? "text-black" : "text-white"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-background xl:hidden"
          >
            <div className="flex w-full flex-col gap-4 px-6 py-6 sm:px-8 lg:px-12">
              {t.items.map((item) => (
                <Link
                  key={item.href}
                  to={localePath(item.href)}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-lg text-foreground"
                >
                  {item.label}
                </Link>
              ))}

              {user && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-lg font-bold text-primary"
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="py-2 text-left text-lg text-destructive"
                  >
                    Logout
                  </button>
                </>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={toggleLang}
                  className="rounded-full border border-foreground/30 px-4 py-1.5 text-sm font-medium text-foreground transition-all hover:bg-foreground hover:text-background"
                >
                  {lang === "ja" ? "Switch to English" : "日本語に切替"}
                </button>
                <Link
                  to={localePath("/contact")}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-black px-4 py-1.5 text-sm text-white"
                >
                  {t.demo}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
