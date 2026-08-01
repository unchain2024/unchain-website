import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import MissionHero from "@/components/about/MissionHero";
import VisionSection from "@/components/about/VisionSection";
import PrinciplesSection from "@/components/about/PrinciplesSection";
import LeadershipSection from "@/components/about/LeadershipSection";
import DeiSection from "@/components/about/DeiSection";
import CompanySection from "@/components/about/CompanySection";
import JapanSection from "@/components/about/JapanSection";
import CtaSection from "@/components/home/CtaSection";
import SiteFooter from "@/components/home/SiteFooter";

/**
 * About page — built one-to-one from the design exports in `public/about`, in the order
 * they run down the page:
 *   Information banner + Navigation (both drawn by Navigation)
 *   -> Frame 2147226133 (from Japan, the hero) -> Section (mission)
 *   -> Section-1 (vision) -> Section-2 (principles) -> Section-3 (leadership, whose
 *   detail drawer is section1.svg) -> Section-4 (DEI) -> Section-5 (company)
 *   -> CTA Banner -> Footer
 *
 * The banner, CTA banner and footer exports are pixel-identical to the home page's, so
 * those components are reused rather than rebuilt. Unlike the home and business heroes,
 * the navigation here is its own 68px export sitting above the first section rather than
 * over it, so JapanSection — being the hero — reserves that height.
 */
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO type="website" />
      <Navigation />
      <JapanSection />
      <MissionHero />
      <VisionSection />
      <PrinciplesSection />
      <LeadershipSection />
      <DeiSection />
      <CompanySection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
};

export default AboutPage;
