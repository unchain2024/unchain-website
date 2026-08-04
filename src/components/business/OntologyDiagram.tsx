import { useLang } from "@/lib/language";
import { ontologyLabels } from "./content";
import { OntologyLines } from "./art/OntologyArt";
import { NeuronMarkSmall } from "./art/Marks";
import * as glyph from "./art/OntologyIcons";

/**
 * The AI-driven-ontology figure — the 642x579 panel at 682,1247 in
 * `public/business/Section.svg`.
 *
 * Everything that is a line or a surface (the dashed source connectors, the graph
 * edges, the platform slab) is the export's own vector art, drawn as one layer
 * underneath. Everything that is a word is a real DOM node on top, so the labels
 * can be selected, searched and translated — the design outlines them to paths,
 * which would have made the whole figure a picture.
 *
 * The figure is a scale drawing: every number below is the export's own, rebased so
 * the panel's top-left is 0,0.
 *
 * Pills are anchored on their *centre* and sized to their content rather than pinned
 * to the export's left edge and width. In English that lands within a pixel of the
 * drawing (the padding and gap below are the export's, so the intrinsic width comes
 * out the same); in Japanese the labels have wildly different measures, and growing
 * symmetrically about the drawn centre is what keeps them from colliding with their
 * neighbours or running off the panel.
 *
 * The whole group was drawn at 0.863845 scale in Figma, which is why the constants
 * are awkward: a 40px pill is 34.55, a 20px icon slot 17.28, a 16px label 13.82.
 */
type Chip = {
  id: keyof typeof ontologyLabels.en.nodes;
  /** Pill centre, in panel coordinates. */
  cx: number;
  y: number;
  Icon: (p: { className?: string }) => JSX.Element;
};

/** Width of the glyph slot: 20px for a source, 14px for a graph node, both scaled. */
const SOURCE_SLOT = 17.28;
const NODE_SLOT = 12.09;

/* The nine data sources feeding the graph. */
const SOURCES: Chip[] = [
  { id: "pm", cx: 198.655, y: 86.32, Icon: glyph.IconProjectTools },
  { id: "workforce", cx: 457.855, y: 86.32, Icon: glyph.IconWorkforce },
  { id: "docs", cx: 154.925, y: 148.51, Icon: glyph.IconDocStorage },
  { id: "erp", cx: 330.475, y: 148.51, Icon: glyph.IconErp },
  { id: "warehouse", cx: 499.505, y: 148.51, Icon: glyph.IconWarehouse },
  { id: "chat", cx: 91.115, y: 210.71, Icon: glyph.IconChat },
  { id: "email", cx: 245.065, y: 210.71, Icon: glyph.IconEmail },
  { id: "crm", cx: 384.175, y: 210.71, Icon: glyph.IconCrm },
  { id: "sheets", cx: 548.395, y: 210.71, Icon: glyph.IconSpreadsheet },
];

/* The eight entity nodes on the platform slab. */
const NODES: Chip[] = [
  { id: "decision", cx: 161.6, y: 360.55, Icon: glyph.IconDecision },
  { id: "open-item", cx: 377.51, y: 351.05, Icon: glyph.IconOpenItem },
  { id: "task", cx: 499.46, y: 379.55, Icon: glyph.IconTask },
  { id: "risk", cx: 263.49, y: 387.33, Icon: glyph.IconRisk },
  { id: "person", cx: 388.11, y: 436.57, Icon: glyph.IconPerson },
  { id: "lesson", cx: 131.69, y: 444.34, Icon: glyph.IconLesson },
  { id: "project", cx: 518.19, y: 453.84, Icon: glyph.IconProject },
  { id: "outcome", cx: 258.62, y: 456.44, Icon: glyph.IconOutcome },
];

/**
 * A pill: 40% white over a top-lit gradient hairline, exactly as the export strokes
 * it. The two background layers are what produce the gradient border — the flat one
 * is clipped to the padding box, the gradient to the border box.
 */
const Pill = ({
  label,
  cx,
  y,
  slot,
  Icon,
  tight,
}: Omit<Chip, "id"> & { label: string; slot: number; tight: boolean }) => (
  <div
    style={{ left: `${cx}px`, top: `${y}px` }}
    className="absolute flex h-[34.55px] -translate-x-1/2 items-center gap-[8.61px] rounded-full border-[0.86px] border-transparent px-[14.69px] shadow-[0_3.46px_8.64px_rgba(0,0,0,0.05)] backdrop-blur-[9.56px] [background-clip:padding-box,border-box] [background-image:linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),linear-gradient(180deg,#fff,rgba(255,255,255,0))] [background-origin:border-box]"
  >
    <span
      style={{ width: `${slot}px` }}
      className="flex shrink-0 items-center justify-center"
    >
      <Icon />
    </span>
    {/* `tight` is the export's own tracking, which only applies to its English
        labels — they measure ~9% narrower than plain Inter at this size, because the
        group was drawn tighter before being scaled to 0.863845. The Japanese set is
        not in the export, so it is left at the font's natural metrics. */}
    <span
      className={`whitespace-nowrap text-[13.82px] leading-none text-hd-ink ${
        tight ? "tracking-[-0.042em]" : ""
      }`}
    >
      {label}
    </span>
  </div>
);

const OntologyDiagram = ({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { lang } = useLang();
  const t = ontologyLabels[lang];
  const tight = lang === "en";

  return (
    <div
      style={style}
      className={`relative h-[579px] w-[642px] rounded-2xl bg-hd-panel ${className}`}
    >
      <OntologyLines className="absolute inset-0 h-full w-full" />

      {/* Centred on the caption's own centre in the export (325.12), which is not
          quite the panel's centre — and centred rather than left-pinned so the
          Japanese caption stays over the group it labels. */}
      <p className="absolute left-[325.12px] top-[35.5px] -translate-x-1/2 font-mono text-[14px] leading-none text-hd-banner">
        {t.sources}
      </p>

      {SOURCES.map((c) => (
        <Pill key={c.id} {...c} label={t.nodes[c.id]} slot={SOURCE_SLOT} tight={tight} />
      ))}
      {NODES.map((c) => (
        <Pill key={c.id} {...c} label={t.nodes[c.id]} slot={NODE_SLOT} tight={tight} />
      ))}

      <p className="absolute left-[66.15px] top-[521.9px] font-mono text-[14px] leading-none text-hd-banner">
        {t.platform}
      </p>
      <NeuronMarkSmall className="absolute left-[573.7px] top-[519.27px] h-[18.15px] w-[16.36px] text-hd-eyebrow-ink" />
    </div>
  );
};

export default OntologyDiagram;
