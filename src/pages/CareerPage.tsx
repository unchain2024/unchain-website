import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import CareerHero from "@/components/career/CareerHero";
import WhySection from "@/components/career/WhySection";
import RolesSection from "@/components/career/RolesSection";
import ProcessSection from "@/components/career/ProcessSection";
import CtaSection from "@/components/home/CtaSection";
import SiteFooter from "@/components/home/SiteFooter";

/**
 * Career page — built one-to-one from the design exports in `public/carrers`, in the order
 * they run down the page:
 *   Navigation (drawn over the hero)
 *   -> Frame 2147226133 (the hero) -> Section (why UNCHAIN) -> Section-1 (open positions)
 *   -> Section-2 (selection process) -> CTA Banner -> Footer
 *
 * The CTA banner export is byte-identical to the about and news pages' once Figma's
 * generated ids are normalised, and the footer export is identical to the news page's, so
 * `CtaSection` and `SiteFooter` are reused rather than rebuilt. As on those pages the hero
 * reserves the 68px header height itself.
 */
const CareerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO type="website" />
      <Navigation />
      <CareerHero />
      <WhySection />
      <RolesSection />
      <ProcessSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
};

export default CareerPage;
