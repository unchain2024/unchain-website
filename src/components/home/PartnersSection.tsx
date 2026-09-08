import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { partners } from "./content";
import microsoft from "@/assets/partners/microsoft-for-startups.webp";
import cic from "@/assets/partners/cic.webp";
import jStarX from "@/assets/partners/j-starx.webp";
import ibi from "@/assets/partners/institute-for-business-innovation.webp";
import nvidia from "@/assets/partners/nvidia-inception.webp";
import berkeley from "@/assets/partners/berkeley.webp";
import aws from "@/assets/partners/aws-startups.webp";
import chintai from "@/assets/partners/chintai.webp";
import ascon from "@/assets/partners/ascon.webp";
import aoyama from "@/assets/partners/aoyama-shoji.webp";
import tanaka from "@/assets/partners/tanaka-engineering.webp";

/**
 * Our partners — `public/our partners/Our Partners.svg` (1440x411).
 *
 * A #F5F5F5 band, centred eyebrow and heading, then a row of 178x73 white cards on a
 * 24px gutter, rounded 12 with a 1px #E9EAEB hairline.
 *
 * The export draws the row mid-scroll — its cards start at x=-177 and run past x=1439,
 * bleeding off both edges — so the row is a marquee rather than a static strip. The
 * section shows seven of them; the full set is the eleven in the companion
 * `Logo List.svg`, and all eleven ride the track.
 *
 * Each logo keeps the exact box the sheet gives it rather than a common size, which is
 * what stops the wordmarks reading as different weights next to each other. Two
 * identical copies ride one track animated 0 -> -50%: at -50% the second copy sits
 * exactly where the first began, so the wrap is invisible. The 24px gutter is a margin
 * on every card rather than a flex `gap`, which is what makes half the track a whole
 * number of cards — with `gap` it would be half a gutter short and the loop would jump.
 */

/** Logo boxes are the rects `Logo List.svg` gives each one, in its own 1440x170 units. */
const PARTNERS = [
  { name: "Microsoft for Startups Founders Hub", src: microsoft, w: 101.74, h: 57.11 },
  { name: "CIC", src: cic, w: 103.56, h: 68.94 },
  { name: "J-StarX", src: jStarX, w: 152.11, h: 55.97 },
  { name: "Institute for Business Innovation", src: ibi, w: 118.13, h: 40.56 },
  { name: "NVIDIA Inception Program", src: nvidia, w: 124.6, h: 52.72 },
  { name: "Berkeley, University of California", src: berkeley, w: 131.07, h: 48.67 },
  { name: "AWS Startups", src: aws, w: 148.06, h: 49.48 },
  { name: "CHINTAI", src: chintai, w: 132.69, h: 50.29 },
  { name: "ascon", src: ascon, w: 89.8, h: 30.6 },
  { name: "青山商事株式会社", src: aoyama, w: 136.69, h: 13.04 },
  { name: "TANAKA ENGINEERING INC.", src: tanaka, w: 153.73, h: 15.41 },
] as const;

const PartnersSection = () => {
  const { lang } = useLang();
  const t = partners[lang];

  return (
    <section id="s-partners" data-nav-theme="light" className="w-full bg-hd-panel">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-16 text-center sm:px-6 lg:pt-[100px]">
        <ScrollReveal>
          <p className="font-mono text-[14px] leading-none text-hd-eyebrow-ink">
            {t.eyebrow}
          </p>

          <h2 className="mt-[24px] text-[24px] font-bold leading-none text-black sm:text-[32px] lg:text-[clamp(28px,2.7778vw,40px)]">
            {t.heading}
          </h2>
        </ScrollReveal>
      </div>

      <ScrollReveal className="mt-10 overflow-hidden pb-16 lg:mt-[60px] lg:pb-[100px]">
        <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...PARTNERS, ...PARTNERS].map((partner, i) => {
            // The second copy is scenery: it repeats what the first already announced.
            const duplicate = i >= PARTNERS.length;
            return (
              <div
                key={i}
                aria-hidden={duplicate || undefined}
                className="mr-6 flex h-[73px] w-[178px] shrink-0 items-center justify-center rounded-xl border border-hd-card-line bg-white"
              >
                <img
                  src={partner.src}
                  alt={duplicate ? "" : partner.name}
                  loading="lazy"
                  style={{ width: partner.w, height: partner.h }}
                  className="max-w-none object-contain"
                />
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default PartnersSection;
