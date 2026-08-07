import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "@/components/home/icons";
import { ChevronLeft, CloseCross } from "./icons";
import { DrawerMosaic } from "./art/LeaderArt";
import { LEADER_PHOTOS } from "./leaderPhotos";

type Member = {
  id: string;
  name: string;
  role: string;
  alt: string;
  bio: string;
};

type Labels = {
  close: string;
  prev: string;
  next: string;
};

type Props = {
  members: readonly Member[];
  /** Index of the open member, or null when the drawer is closed. */
  index: number | null;
  onClose: () => void;
  onSelect: (index: number) => void;
  labels: Labels;
};

/**
 * Where the panel sits, so it opens over the card that was clicked: the first member's
 * on the left, the last member's on the right, anything between centred.
 *
 * All three are `left` values rather than a mix of `left`/`right`/translate, which is what
 * lets the panel slide between them when prev/next changes the member — a transition
 * cannot animate to or from `auto`, and a translate would fight the enter animation's own
 * transform. `calc(100% - 512px)` is the 480px panel plus its 32px inset, so at the
 * design's 1440 width the right-hand position lands on the export's own x=928.
 */
const PANEL_X = {
  left: "sm:left-8",
  center: "sm:left-[calc(50%-240px)]",
  right: "sm:left-[calc(100%-512px)]",
} as const;

/** Slide in from the nearest edge; the centred one just rises. */
const PANEL_FROM = {
  left: { x: -24 },
  center: { y: 24 },
  right: { x: 24 },
} as const;

/**
 * Leader detail drawer — `public/about/section1.svg`, with the two 480x836 variants in
 * `Frame 2147226178*.svg`.
 *
 * A 480px panel inset 32px from the top and bottom of the viewport over a dimmed, blurred
 * page (5% black plus the export's own `backdrop-filter: blur(50px)`). Inside: name and
 * role on 40px padding, a 299x329.75 photo frame holding the mosaic and the portrait, then
 * the bio.
 *
 * The export draws prev/next as a pair centred off the bottom; they sit hard against the
 * panel's left and right edges instead, level with the portrait, so the reading column
 * keeps its full measure.
 *
 * Horizontally it tracks the open member's card — see PANEL_X. The export only draws the
 * third card's state, which is the right-hand position.
 *
 * The portrait overhangs the frame's left edge by 10.76px and is clipped by it, exactly
 * as the export draws it.
 */
const LeaderDrawer = ({ members, index, onClose, onSelect, labels }: Props) => {
  const open = index !== null;
  const member = open ? members[index] : null;
  const panelRef = useRef<HTMLDivElement>(null);
  const place: keyof typeof PANEL_X =
    index === null || members.length < 2
      ? "right"
      : index === 0
        ? "left"
        : index === members.length - 1
          ? "right"
          : "center";

  // Escape to close, arrows to walk the list — the drawer takes the page over while it is
  // open, so it owns the keyboard.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onSelect(index - 1);
      if (e.key === "ArrowRight" && index < members.length - 1) onSelect(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, members.length, onClose, onSelect]);

  // Move focus into the panel so the close button is the next tab stop.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open, index]);

  const photo = member ? LEADER_PHOTOS[member.id] : null;

  return (
    <AnimatePresence>
      {open && member && (
        <div className="fixed inset-0 z-[60]">
          <motion.button
            type="button"
            aria-label={labels.close}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 h-full w-full cursor-default bg-black/5 backdrop-blur-[50px]"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={member.name}
            initial={{ opacity: 0, ...PANEL_FROM[place] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...PANEL_FROM[place] }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className={`absolute inset-x-4 bottom-4 top-4 flex flex-col overflow-y-auto rounded-2xl border border-hd-card-line bg-white p-6 outline-none sm:bottom-8 sm:right-auto sm:top-8 sm:w-[480px] sm:px-10 sm:pb-10 sm:pt-[46px] sm:transition-[left] sm:duration-300 ${PANEL_X[place]}`}
          >
            {/* The export sets the name 8.8px below the 40px padding — it is drawn on a
                taller line than its 32px type — so the panel's top padding carries that
                and the close button is pinned to the 40px inset it is actually drawn on. */}
            <button
              type="button"
              onClick={onClose}
              aria-label={labels.close}
              className="absolute right-6 top-6 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full border border-hd-hairline text-hd-chevron transition-colors hover:bg-black/5 sm:right-10 sm:top-10"
            >
              <CloseCross />
            </button>

            <div className="pr-[70px]">
              <p
                data-probe="drawer-name"
                className="text-[26px] font-bold leading-none text-black sm:text-[32px]"
              >
                {member.name}
              </p>
              <p className="mt-[22px] text-[14px] leading-none text-hd-eyebrow-ink">
                {member.role}
              </p>
            </div>

            {/* The photo's row, which is also what the prev/next arrows flank.

                The negative margins cancel the panel's own padding so this one row runs
                the full width of the panel: that is what lets the arrows sit hard against
                its left and right edges while the frame stays centred on `mx-auto`. They
                keep the leader cards' translucent plate, since on a narrow panel there is
                no gutter left and they ride over the photo. */}
            <div className="relative -mx-6 mt-[42.6px] shrink-0 sm:-mx-10">
              <button
                type="button"
                onClick={() => onSelect(index - 1)}
                disabled={index === 0}
                aria-label={labels.prev}
                className="absolute left-2 top-1/2 z-10 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-hd-hairline bg-white/80 backdrop-blur-sm transition-colors enabled:text-hd-chevron enabled:hover:bg-white disabled:cursor-default disabled:text-hd-eyebrow"
              >
                <ChevronLeft />
              </button>

              <button
                type="button"
                onClick={() => onSelect(index + 1)}
                disabled={index === members.length - 1}
                aria-label={labels.next}
                className="absolute right-2 top-1/2 z-10 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full border border-hd-hairline bg-white/80 backdrop-blur-sm transition-colors enabled:text-hd-chevron enabled:hover:bg-white disabled:cursor-default disabled:text-hd-eyebrow"
              >
                <ChevronRight />
              </button>

              {/* 299 x 329.75 frame, centred in the panel's 400px measure. */}
              {/* Border on an overlay, not the frame: the portrait is placed as a share of
                  the 299 x 329.746 box and a border would shrink that basis. */}
              <div className="relative mx-auto aspect-[299/329.746] w-full max-w-[299px] overflow-hidden rounded-[12px]">
                <DrawerMosaic className="pointer-events-none absolute inset-0 h-full w-full select-none" />
                {/* A member with no portrait yet still opens — the frame shows the mosaic. */}
                {photo && (
                  <img
                    src={photo.src}
                    alt={member.alt}
                    className="absolute left-[-3.597%] top-[15.427%] w-[107.455%] max-w-none object-cover"
                    style={{ aspectRatio: "1 / 1" }}
                  />
                )}
                <div className="pointer-events-none absolute inset-0 rounded-[12px] border-[0.77px] border-hd-card-line" />
              </div>
            </div>

            <p
              data-probe="drawer-bio"
              className="mt-[44.7px] text-[14px] leading-[20px] text-hd-eyebrow-ink"
            >
              {member.bio}
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeaderDrawer;
