import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import BusinessHero from "@/components/business/BusinessHero";
import NeuronSection from "@/components/business/NeuronSection";
import AdvisorSection from "@/components/business/AdvisorSection";
import CtaSection from "@/components/home/CtaSection";
import SiteFooter from "@/components/home/SiteFooter";

/**
 * Business page — built one-to-one from the design exports in `public/business`,
 * in the order they run down the page:
 *   Information banner (in Navigation) -> Frame 2147226132 (hero) -> Section
 *   -> Section-1 -> CTA Banner -> Footer
 *
 * The CTA banner and footer exports are byte-for-byte the same artwork as the home
 * page's, so those two components are reused rather than rebuilt.
 */
const SolutionsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO type="website" />
      <Navigation />
      <BusinessHero />
      <NeuronSection />
      <AdvisorSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
};

export default SolutionsPage;
