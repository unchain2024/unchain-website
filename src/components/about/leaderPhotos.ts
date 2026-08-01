import parkShot from "@/assets/about/leader-park.webp";
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
 *   park    177.002, 429.18  418 x 418        (card at 120, 332)
 *   ebina   584.662, 443     418.313 square   (card at 525.333, 332)
 *   harada  992.877, 392     428.84 x 571.786 (card at 930.666, 332)
 *
 * The drawer reuses the same three images in one shared box — see LeaderDrawer.
 */
export type LeaderPhoto = {
  src: string;
  /** Position and size inside the card, in percent, plus the image's own aspect. */
  card: { left: string; top: string; width: string; aspect: string };
};

export const LEADER_PHOTOS: Record<string, LeaderPhoto> = {
  park: {
    src: parkShot,
    card: { left: "14.641%", top: "21.126%", width: "107.363%", aspect: "1 / 1" },
  },
  ebina: {
    src: ebinaShot,
    card: { left: "15.239%", top: "17.391%", width: "107.443%", aspect: "1 / 1" },
  },
  harada: {
    src: haradaShot,
    card: { left: "15.980%", top: "6.304%", width: "110.147%", aspect: "428.84 / 571.786" },
  },
};
