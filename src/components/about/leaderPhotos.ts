import ebinaShot from "@/assets/about/leader-ebina.webp";
import haradaShot from "@/assets/about/leader-harada.webp";

/**
 * Where each portrait sits, taken from the export's own rects.
 *
 * The cut-outs are not a uniform crop: Figma places each one individually inside the card
 * and lets it overhang the edges, so every leader has their own box. `card` is that box as
 * a share of the 389.333 x 460 card, which keeps it correct as the card scales.
 *
 * Section-3.svg draws them at:
 *   ebina   584.662, 443     418.313 square   (card at 525.333, 332)
 *   harada  992.877, 392     428.84 x 571.786 (card at 930.666, 332)
 *
 * The drawer reuses the same images in one shared box — see LeaderDrawer.
 *
 * Advisor portraits are not in the export, so they are served from `public/about` rather
 * than imported. `advisor-ujwal.webp` is an 837px square cut-out with a transparent
 * background, framed like leader-ebina (head top at ~10% of the canvas), so it reuses
 * Ebina's box. To replace it, overwrite the file with a cut-out framed the same way.
 */
export type LeaderPhoto = {
  src: string;
  /** Position and size inside the card, in percent, plus the image's own aspect. */
  card: { left: string; top: string; width: string; aspect: string };
};

export const LEADER_PHOTOS: Record<string, LeaderPhoto> = {
  ebina: {
    src: ebinaShot,
    card: { left: "15.239%", top: "17.391%", width: "107.443%", aspect: "1 / 1" },
  },
  harada: {
    src: haradaShot,
    card: { left: "15.980%", top: "6.304%", width: "110.147%", aspect: "428.84 / 571.786" },
  },
  kumar: {
    src: `${import.meta.env.BASE_URL}about/advisor-ujwal.webp`,
    card: { left: "15.239%", top: "17.391%", width: "107.443%", aspect: "1 / 1" },
  },
};
