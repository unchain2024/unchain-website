/* Geometry generated from public/home/Hero.svg — the logo-shaped photo collage.
   Path data, gradients and the image pattern below are the untouched export; only the
   animation wrapper around them is hand-written.

   The export is one flat stack: the logo-shaped photo, then six chevron shards laid over
   it. Those same six shards were re-exported on their own into public/animation as
   Subtract*.svg, which is what makes them individually animatable — each file is this
   file's path translated to its own origin:

     Subtract-2  -> 824.666, 145.481   top bar
     Subtract-3  -> 1118.82, 145.485   right arm
     Subtract-4  -> 788.673, 693.981   bottom bar
     Subtract-5  -> 657.651, 420.285   left arm
     Subtract    -> 734.514, 159.836   faint diagonal (upper)
     Subtract-1  -> 934.734, 247.681   faint diagonal (lower)

   The loop follows public/animation.mp4: the shards draw themselves in one after the
   next, the photo sweeps in between them once the frame stands, the two hold, and then
   both leave the way they came so the cycle can start over. It runs from mount and never
   stops — see TIMELINE below for the beats.

   A shard is drawn inside a clip of its own final outline, so translating it along its
   long axis reads as a wipe running the length of the stroke rather than a slide. The
   offsets below are 0.85 of each shard's axis, pointing back the way the stroke should
   grow — top bar rightwards, right arm down, bottom bar leftwards, left arm up — which
   walks the mark round its own 180-degree symmetry. Leaving, each shard carries on past
   its resting place instead of retracting, so the stroke flows off the way it arrived. */
import { motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";
import heroPhoto from "@/assets/home/hero-collage.webp";

/** The collage's centre in export coordinates — the pivot for the photo's drift and sweep. */
const CENTRE = { x: 1019, y: 482 } as const;

/** Expo-out: a fast leading edge that coasts to a stop, matching the reference. */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** The photo's sweep holds a steadier pace than the shards, or the wipe reads as a fade. */
const SWEEP_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

/* TIMELINE — one cycle, in seconds. Paced off the reference, where the whole frame
   builds in a little over a second and the photo takes about as long again to come up.

     0.10 - 1.28   shards arrive, 0.10 apart, 0.72 each
     1.05 - 2.00   photo's edge sweeps across, once the frame stands
     1.05 - 2.55   photo keeps coming up under the sweep, so it emerges rather than lands
     2.55 - 6.60   hold, the photo drifting 1 -> 1.025
     6.60 - 7.60   photo dissolves out, the way the reference drops it
     6.90 - 7.85   sweep carries on past, leaving the mask clear for the next cycle
     6.90 - 8.08   shards leave in the order they arrived
     8.08 - 9.20   the frame sits empty, a beat before it all starts again          */
const CYCLE = 9.2;
const SHARD_DUR = 0.72;
const SHARD_FADE = 0.3;
const SHARD_FIRST_IN = 0.1;
const SHARD_FIRST_OUT = 6.9;
const PHOTO_IN = 1.05;
const PHOTO_SWEEP = 0.95;
const PHOTO_RISE = 1.5;
const PHOTO_OUT = 6.6;
const PHOTO_DROP = 1.0;
/** The sweep trails the dissolve, so it only has to clear a photo already on its way out. */
const SWEEP_OUT = 6.9;

/** Seconds to a keyframe position within the cycle. */
const at = (seconds: number) => seconds / CYCLE;

type Shard = {
  d: string;
  fill: string;
  opacity: number;
  /** Where the stroke starts, as an offset back along its own axis. */
  from: [number, number];
  /** When it starts arriving; it leaves at the same remove from SHARD_FIRST_OUT. */
  delay: number;
};

const SHARDS: Shard[] = [
  {
    // Top bar — grows rightwards off its left end.
    d: "M1213.55 145.481C1223.75 172.225 1236.06 202.143 1249.91 233.869C1141.83 252.964 971.428 268.361 825.666 269.928L824.664 176.734C957.256 175.308 1110.64 162.006 1213.55 145.481Z",
    fill: "url(#paint1_linear_96_989)",
    opacity: 0.8,
    from: [-361, 31],
    delay: 0.1,
  },
  {
    // Right arm — carries on downwards from where the top bar ended.
    d: "M1213.55 145.485C1185.29 150.023 1153.23 154.318 1118.83 158.191C1156.33 261.338 1228.2 416.607 1299.72 543.625L1380.93 497.895C1315.87 382.354 1250.7 242.873 1213.55 145.485Z",
    fill: "url(#paint2_linear_96_989)",
    opacity: 0.8,
    from: [-223, -339],
    delay: 0.2,
  },
  {
    // Bottom bar — the top bar's opposite number, so it runs the other way.
    d: "M825.033 818.428C814.832 791.684 802.518 761.766 788.673 730.041C896.753 710.945 1067.15 695.548 1212.92 693.982L1213.92 787.175C1081.32 788.601 927.945 801.903 825.033 818.428Z",
    fill: "url(#paint3_linear_96_989)",
    opacity: 0.8,
    from: [361, -31],
    delay: 0.3,
  },
  {
    // Left arm — closes the mark, climbing back towards the top bar.
    d: "M825.027 818.424C853.288 813.886 885.355 809.591 919.752 805.719C882.249 702.571 810.384 547.302 738.859 420.285L657.65 466.014C722.712 581.555 787.881 721.037 825.027 818.424Z",
    fill: "url(#paint4_linear_96_989)",
    opacity: 0.8,
    from: [223, 288],
    delay: 0.4,
  },
  {
    // The two faint diagonals fall last, from their top-right ends.
    d: "M782.576 716.192C767.877 683.017 751.644 648.134 734.513 613.039L990.423 169.791C1029.38 167.078 1067.71 163.695 1103.79 159.837L782.576 716.192Z",
    fill: "#0E3067",
    opacity: 0.2,
    from: [314, -473],
    delay: 0.48,
  },
  {
    d: "M934.734 804.037C970.815 800.179 1009.14 796.796 1048.1 794.083L1304.01 350.835C1286.88 315.739 1270.65 280.857 1255.95 247.681L934.734 804.037Z",
    fill: "#0E3067",
    opacity: 0.2,
    from: [314, -473],
    delay: 0.56,
  },
];

/** The collage outline — drawn twice, as a black backing and as the photo itself. */
const COLLAGE =
  "M1213.92 145.7C1236.1 203.837 1268.26 276.974 1304.42 351.064C1304.41 351.059 1304.39 351.055 1304.38 351.05L1048.46 794.303C1048.47 794.314 1048.49 794.325 1048.5 794.336C966.252 800.063 886.832 808.778 825.397 818.643C825.396 818.64 825.396 818.638 825.395 818.635C825.392 818.636 825.39 818.636 825.387 818.637C803.211 760.496 771.045 687.353 734.879 613.257L734.882 613.257L790.717 516.547L790.719 516.55L934.963 266.713L934.959 266.714L990.794 170.004L990.792 170.002C1073.04 164.275 1152.47 155.559 1213.91 145.694C1213.91 145.696 1213.91 145.698 1213.91 145.701C1213.92 145.7 1213.92 145.7 1213.92 145.7Z";

/** Every loop shares one clock, so the beats above stay in step. */
const loop = (times: number[], ease: Transition["ease"]): Transition => ({
  duration: CYCLE,
  repeat: Infinity,
  repeatType: "loop",
  times,
  ease,
});

const HeroArt = ({ className }: { className?: string }) => {
  const reduce = useReducedMotion();

  return (
    <svg viewBox="657 145 724 674" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <pattern id="pattern0_96_989" patternContentUnits="objectBoundingBox" width="1" height="1">
          <image width="1792" height="2400" preserveAspectRatio="none" transform="matrix(0.000558036 0 0 0.000472287 0 -0.0667445)" href={heroPhoto}/>
        </pattern>
        <linearGradient id="paint1_linear_96_989" x1="831.314" y1="220.703" x2="1214.52" y2="272.241" gradientUnits="userSpaceOnUse">
          <stop stopColor="#89B7D1"/>
          <stop offset="1" stopColor="#D9EEFA"/>
        </linearGradient>
        <linearGradient id="paint2_linear_96_989" x1="1165.8" y1="163.517" x2="1271.44" y2="538.241" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0E3067"/>
          <stop offset="1" stopColor="#D9E5FA"/>
        </linearGradient>
        <linearGradient id="paint3_linear_96_989" x1="1217.59" y1="749.15" x2="819.037" y2="704.736" gradientUnits="userSpaceOnUse">
          <stop stopColor="#89B7D1"/>
          <stop offset="1" stopColor="#D9EEFA"/>
        </linearGradient>
        <linearGradient id="paint4_linear_96_989" x1="873.394" y1="805.511" x2="773.357" y2="430.923" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0E3067"/>
          <stop offset="1" stopColor="#D9E5FA"/>
        </linearGradient>

        {/* Each shard is clipped to its own outline, so its entrance reads as a wipe. */}
        {SHARDS.map((shard, i) => (
          <clipPath key={i} id={`hero-shard-${i}`}>
            <path d={shard.d} />
          </clipPath>
        ))}

        {/* The collage's silhouette, held at the export's own coordinates. The shards are
            drawn along these very edges, so the photo only tucks under them cleanly while
            it sits exactly here — anything that moves the outline, a drift included, walks
            it out from behind the shards and shows the photo's own edge. Clipping to this
            lets the drift below scale the image without the silhouette following. */}
        <clipPath id="hero-collage-edge">
          <path fillRule="evenodd" clipRule="evenodd" d={COLLAGE} />
        </clipPath>

        {/* The photo's sweep. The collage is a slab lying along the shards' 60 degrees —
            it measures ~776 units end to end that way against ~364 across, so the sweep
            travels the long way, out of the bottom-left corner and up to the top-right,
            carrying on where the left arm stopped.

            It is a band rather than a half-plane: 1240 wide, both edges graded over 210
            of that, which leaves 820 of solid middle to cover the slab's 776 outright.
            One pass in one direction therefore brings the photo up on the leading grade,
            holds it whole while the band is centred, and takes it off the trailing one.
            The grade is deliberately wide — in the reference the edge is barely an edge,
            more a soft front that walks across the panel. */}
        <linearGradient id="hero-photo-edge" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#000" />
          <stop offset="0.169" stopColor="#fff" />
          <stop offset="0.831" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="hero-photo-wipe" maskUnits="userSpaceOnUse" x="600" y="100" width="860" height="800">
          <g transform={`rotate(-60 ${CENTRE.x} ${CENTRE.y})`}>
            <motion.g
              animate={reduce ? { x: 0 } : { x: [-1020, -1020, 0, 0, 1020, 1020] }}
              transition={
                reduce
                  ? { duration: 0 }
                  : loop(
                      [
                        0,
                        at(PHOTO_IN),
                        at(PHOTO_IN + PHOTO_SWEEP),
                        at(SWEEP_OUT),
                        at(SWEEP_OUT + PHOTO_SWEEP),
                        1,
                      ],
                      ["linear", SWEEP_EASE, "linear", SWEEP_EASE, "linear"],
                    )
              }
            >
              <rect x="399" y="-518" width="1240" height="2000" fill="url(#hero-photo-edge)" />
            </motion.g>
          </g>
        </mask>
      </defs>

      {/* Photo — the mask carries the sweep's direction, the opacity here carries its
          softness. The rise outlasts the sweep by half a second, so the photo goes on
          strengthening after the front has crossed rather than arriving finished; going
          out it is a plain dissolve, which is what the reference does. In between it
          drifts, so the hold is never quite still.

          The drift stays inside hero-collage-edge and never drops below 1.012, so the
          silhouette is always the clip's rather than the scaled shape's own — the photo
          zooms, its edges do not move, and they stay tucked under the shards throughout.
          Reduced motion sits at 1 with no clip, which is the export untouched. */}
      <g clipPath={reduce ? undefined : "url(#hero-collage-edge)"} mask={reduce ? undefined : "url(#hero-photo-wipe)"}>
        <g transform={`translate(${CENTRE.x} ${CENTRE.y})`}>
          <motion.g
            animate={
              reduce
                ? { scale: 1, opacity: 1 }
                : { scale: [1.06, 1.06, 1.012, 1.032, 1.032], opacity: [0, 0, 1, 1, 0, 0] }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    scale: loop(
                      [0, at(PHOTO_IN), at(PHOTO_IN + 1.6), at(PHOTO_OUT + PHOTO_DROP), 1],
                      ["linear", EASE, "linear", "linear"],
                    ),
                    opacity: loop(
                      [
                        0,
                        at(PHOTO_IN),
                        at(PHOTO_IN + PHOTO_RISE),
                        at(PHOTO_OUT),
                        at(PHOTO_OUT + PHOTO_DROP),
                        1,
                      ],
                      "linear",
                    ),
                  }
            }
          >
            <g transform={`translate(${-CENTRE.x} ${-CENTRE.y})`}>
              <path fillRule="evenodd" clipRule="evenodd" d={COLLAGE} fill="black"/>
              <path fillRule="evenodd" clipRule="evenodd" d={COLLAGE} fill="url(#pattern0_96_989)"/>
            </g>
          </motion.g>
        </g>
      </g>

      {/* Shards — drawn in sequence round the mark, each wiping along its own axis, then
          carried off the same way once the hold is over. */}
      {SHARDS.map((shard, i) => {
        const [fx, fy] = shard.from;
        const enter = shard.delay;
        const leave = SHARD_FIRST_OUT + shard.delay - SHARD_FIRST_IN;

        return (
          <g key={i} clipPath={reduce ? undefined : `url(#hero-shard-${i})`}>
            <motion.g
              animate={
                reduce
                  ? { x: 0, y: 0, opacity: 1 }
                  : {
                      x: [fx, fx, 0, 0, -fx, -fx],
                      y: [fy, fy, 0, 0, -fy, -fy],
                      opacity: [0, 0, 1, 1, 0, 0],
                    }
              }
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      x: loop(
                        [0, at(enter), at(enter + SHARD_DUR), at(leave), at(leave + SHARD_DUR), 1],
                        ["linear", EASE, "linear", EASE, "linear"],
                      ),
                      y: loop(
                        [0, at(enter), at(enter + SHARD_DUR), at(leave), at(leave + SHARD_DUR), 1],
                        ["linear", EASE, "linear", EASE, "linear"],
                      ),
                      opacity: loop(
                        [
                          0,
                          at(enter),
                          at(enter + SHARD_FADE),
                          at(leave + SHARD_DUR - SHARD_FADE),
                          at(leave + SHARD_DUR),
                          1,
                        ],
                        "linear",
                      ),
                    }
              }
            >
              <path opacity={shard.opacity} d={shard.d} fill={shard.fill} />
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
};

export default HeroArt;
