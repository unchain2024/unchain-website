import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import BusinessSection from "@/components/home/BusinessSection";
import NewsSection from "@/components/home/NewsSection";
import PartnersSection from "@/components/home/PartnersSection";
import JoinSection from "@/components/home/JoinSection";
import CtaSection from "@/components/home/CtaSection";
import SiteFooter from "@/components/home/SiteFooter";

/**
 * Home page — built one-to-one from the design exports in `public/home`,
 * in the order they run down the page:
 *   Information banner (in Navigation) -> Hero -> Section (Original) -> Section
 *   -> Section-1 -> Section-2 -> CTA Banner -> Footer
 */
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO organization type="website" />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <BusinessSection />
      <NewsSection />
      <PartnersSection />
      <JoinSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
};

export default Index;
