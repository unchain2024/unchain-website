import Navigation from "@/components/Navigation";
import PrivacyHero from "@/components/privacy/PrivacyHero";
import PolicyBody from "@/components/privacy/PolicyBody";
import SiteFooter from "@/components/home/SiteFooter";

/**
 * Privacy policy — built one-to-one from the design exports in `public/privacy-policy`, in
 * the order they run down the page:
 *   Navigation (drawn over the page, 68px, reserved by the hero)
 *   -> Frame 2147226133 (the hero) -> Section (the policy card) -> Footer
 *
 * The export has no CTA banner and no footer of its own, so the page ends on the shared
 * `SiteFooter` the other design-built pages use.
 */
const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <PrivacyHero />
      <PolicyBody />
      <SiteFooter />
    </div>
  );
};

export default PrivacyPolicyPage;
