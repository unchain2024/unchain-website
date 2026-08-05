import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import TrustHero from "@/components/trust/TrustHero";
import ApproachSection from "@/components/trust/ApproachSection";
import LayersSection from "@/components/trust/LayersSection";
import PoliciesSection from "@/components/trust/PoliciesSection";
import CtaSection from "@/components/home/CtaSection";
import SiteFooter from "@/components/home/SiteFooter";

/**
 * Trust & security page — built one-to-one from the design exports in
 * `public/trust-security`, in the order they run down the page:
 *   Frame 2147226132 (hero) -> Section -> Section-1 -> Section-2 -> CTA Banner -> Footer
 *
 * The CTA banner and footer exports are pixel-identical to the home page's, so those two
 * components are reused rather than rebuilt.
 */
const TrustSecurityPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO type="website" />
      <Navigation />
      <TrustHero />
      <ApproachSection />
      <LayersSection />
      <PoliciesSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
};

export default TrustSecurityPage;
