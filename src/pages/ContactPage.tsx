import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import ContactSection from "@/components/contact/ContactSection";
import SiteFooter from "@/components/home/SiteFooter";
import { meta } from "@/components/contact/content";
import { useLang } from "@/lib/language";
import { SITE_URL } from "@/lib/articleLinks";

/**
 * Contact — built one-to-one from the design exports in `public/contact`, in the order
 * they run down the page:
 *   Navigation -> Frame 21472261322 / Frame 2147226132 (the form, empty and filled)
 *   -> Footer
 *
 * There is no CTA banner in this set — the form is the call to action — and the footer
 * export is pixel-identical to the home page's, so `SiteFooter` is reused rather than
 * rebuilt. As on the about and news pages the navigation is not part of the exports, so
 * `ContactSection` reserves the header's height itself.
 */
const ContactPage = () => {
  const { lang, localePath } = useLang();
  const t = meta[lang];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${t.title} | UNCHAIN`}
        description={t.description}
        canonical={`${SITE_URL}${localePath("/contact")}`}
        alternates={{ ja: `${SITE_URL}/contact`, en: `${SITE_URL}/en/contact` }}
      />
      <Navigation />
      <ContactSection />
      <SiteFooter />
    </div>
  );
};

export default ContactPage;
