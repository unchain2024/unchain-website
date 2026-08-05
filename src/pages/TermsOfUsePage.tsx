import Navigation from "@/components/Navigation";
import TermsHero from "@/components/terms/TermsHero";
import TermsBody from "@/components/terms/TermsBody";
import SiteFooter from "@/components/home/SiteFooter";

/**
 * Terms of use — built one-to-one from the design exports in `public/termofuse`, in the
 * order they run down the page:
 *   Navigation (its own 68px band, which TermsHero reserves the height of)
 *   -> Frame 2147226133 (the hero) -> Section (the policy panel)
 *   -> Footer
 *
 * That set carries no footer export of its own, so the page closes with the shared
 * `SiteFooter` every other page uses; there is no CTA banner in the export, so none is
 * drawn here either.
 */
const TermsOfUsePage = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <TermsHero />
    <TermsBody />
    <SiteFooter />
  </div>
);

export default TermsOfUsePage;
