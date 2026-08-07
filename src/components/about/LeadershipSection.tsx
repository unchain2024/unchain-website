import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { leadership } from "./content";
import { ChevronRight } from "@/components/home/icons";
import { LeaderMosaic } from "./art/LeaderArt";
import { LEADER_PHOTOS } from "./leaderPhotos";
import LeaderDrawer from "./LeaderDrawer";

/**
 * Leadership — `public/about/Section-3.svg` (1440x892).
 *
 * Three 389.333 x 460 cards, 16px apart, on the 120px gutter. Each holds the name and
 * role on 24px padding, a 50px arrow button 24px in from the top-right, and the portrait
 * over the export's gradient mosaic — both overhang the card and are clipped by it.
 *
 * The arrow opens the detail drawer drawn in `section1.svg`.
 */
const LeadershipSection = () => {
  const { lang } = useLang();
  const t = leadership[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section data-nav-theme="light" data-probe="s-leadership" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-[clamp(48px,8.3333vw,120px)] lg:pb-[101px] lg:pt-[101px]">
        <ScrollReveal>
          <p
            data-probe="leadership-eyebrow"
            className="font-mono text-[14px] leading-none text-hd-eyebrow-ink"
          >
            {t.eyebrow}
          </p>

          <h2
            data-probe="leadership-heading"
            className="mt-[23px] text-[36px] font-bold leading-[1.11] text-black sm:text-[44px] lg:text-[clamp(38px,3.75vw,54px)] lg:leading-[1.0925926]"
          >
            {t.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </ScrollReveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-[76px] lg:grid-cols-3">
          {t.members.map((member, i) => {
            const photo = LEADER_PHOTOS[member.id];
            return (
              <li key={member.id}>
                <ScrollReveal delay={i * 0.08}>
                  {/* No border on the card itself: the mosaic and portrait are placed as
                      a share of the 389.333 x 460 box the export measures from, and a
                      border would shrink that basis by 2px. The export draws its stroke
                      inside the box, so it goes on an overlay instead. */}
                  <div
                    data-probe={`leader-card-${member.id}`}
                    className="relative aspect-[389.333/460] overflow-hidden rounded-2xl bg-white"
                  >
                    <LeaderMosaic className="pointer-events-none absolute inset-0 h-full w-full select-none" />

                    {/* A member with no portrait yet keeps the card — just the mosaic. */}
                    {photo && (
                      <img
                        src={photo.src}
                        alt={member.alt}
                        loading="lazy"
                        className="pointer-events-none absolute max-w-none select-none object-cover"
                        style={{
                          left: photo.card.left,
                          top: photo.card.top,
                          width: photo.card.width,
                          aspectRatio: photo.card.aspect,
                        }}
                      />
                    )}

                    <div className="pointer-events-none absolute inset-0 rounded-2xl border border-hd-card-line" />

                    <div className="absolute left-[24px] top-[30px] right-[24px]">
                      <p className="text-[20px] font-bold leading-none text-black">
                        {member.name}
                      </p>
                      <p className="mt-[19px] text-[14px] leading-none text-hd-eyebrow-ink">
                        {member.role}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenIndex(i)}
                      aria-label={`${member.name} — ${t.open}`}
                      className="absolute right-[24px] top-[29px] flex h-[50px] w-[50px] items-center justify-center rounded-full border border-hd-hairline bg-white/80 text-hd-chevron backdrop-blur-sm transition-colors hover:bg-white"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>
      </div>

      <LeaderDrawer
        members={t.members}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onSelect={setOpenIndex}
        labels={{ close: t.close, prev: t.prev, next: t.next }}
      />
    </section>
  );
};

export default LeadershipSection;
