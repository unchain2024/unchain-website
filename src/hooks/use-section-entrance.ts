import type { RefObject } from "react";
import { useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

/**
 * Progress of a section's arrival, 0 -> 1, for scroll-linked decoration.
 *
 * "Arrived" means the reader has the section in front of them, which is two different
 * moments depending on how the section and the viewport compare:
 *
 *   section shorter than the viewport — it has arrived when its bottom edge reaches the
 *   bottom of the viewport, the point at which the whole thing is on screen;
 *
 *   section taller than the viewport — that never happens, so it has arrived when its
 *   top edge reaches the top of the viewport and it fills the screen instead.
 *
 * Both are measured and the faster of the two wins, so the ratio picks itself and the
 * gesture always lands on the earlier moment rather than running on past it. On a
 * desktop viewport that is always the first, so the hook reduces to it exactly; on a
 * phone, where a 700px band is taller than the window, it is the second. Nothing is
 * keyed to a breakpoint, so it holds at any aspect ratio, and it re-reads on resize —
 * which covers the iOS URL bar collapsing mid-scroll.
 *
 * A spring takes the edge off a flicked wheel, stiff enough that its own settle does
 * not trail past the end of the window.
 */
export function useSectionEntrance(target: RefObject<HTMLElement>): MotionValue<number> {
  const { scrollYProgress: whole } = useScroll({
    target,
    offset: ["start end", "end end"],
  });
  const { scrollYProgress: filling } = useScroll({
    target,
    offset: ["start end", "start start"],
  });

  const arrival = useTransform<number, number>(
    [whole, filling],
    ([a, b]) => Math.max(a, b),
  );

  return useSpring(arrival, { stiffness: 200, damping: 34, mass: 0.3 });
}
