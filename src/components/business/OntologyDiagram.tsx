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
 * The figure is a scale drawing: `x/y/w` and the icon offset are the export's own
 * numbers, rebased so the panel's top-left is 0,0. Pill widths are fixed rather
 * than intrinsic because the node names are entity labels that read the same in
 * both locales, so nothing here reflows.
 *
 * The whole group was drawn at 0.863845 scale in Figma, which is why the constants
 * are awkward: a 40px pill is 34.55, a 20px icon slot 17.28, a 16px label 13.82.
 */
type Chip = {
  id: string;
  label: string;
  /** Pill origin and width, in panel coordinates. */
  x: number;
  y: number;
  w: number;
  /** Left offset of the glyph inside the pill — it is not a uniform slot. */
  ix: number;
  Icon: (p: { className?: string }) => JSX.Element;
};

/* The nine data sources feeding the graph. Labels sit 41.4 in from the pill edge. */
const SOURCES: Chip[] = [
  { id: "pm", label: "Project management tools", x: 92.01, y: 86.32, w: 213.29, ix: 17.28, Icon: glyph.IconProjectTools },
  { id: "workforce", label: "Workforce management", x: 357.21, y: 86.32, w: 201.29, ix: 15.55, Icon: glyph.IconWorkforce },
  { id: "docs", label: "Document storage", x: 71.28, y: 148.51, w: 167.29, ix: 15.55, Icon: glyph.IconDocStorage },
  { id: "erp", label: "ERP", x: 289.83, y: 148.51, w: 81.29, ix: 15.55, Icon: glyph.IconErp },
  { id: "warehouse", label: "Data warehouse", x: 422.86, y: 148.51, w: 153.29, ix: 15.55, Icon: glyph.IconWarehouse },
  { id: "chat", label: "Chat tools", x: 32.47, y: 210.71, w: 117.29, ix: 16.41, Icon: glyph.IconChat },
  { id: "email", label: "Email", x: 200.92, y: 210.71, w: 88.29, ix: 15.55, Icon: glyph.IconEmail },
  { id: "crm", label: "CRM", x: 341.03, y: 210.71, w: 86.29, ix: 15.55, Icon: glyph.IconCrm },
  { id: "sheets", label: "Spreadsheets", x: 479.25, y: 210.71, w: 138.29, ix: 16.41, Icon: glyph.IconSpreadsheet },
];

/* The eight entity nodes on the platform slab. Their glyphs are a smaller slot,
   so their labels sit 36.3 in rather than 41.4. */
const NODES: Chip[] = [
  { id: "decision", label: "Decision", x: 110.55, y: 360.55, w: 102.1, ix: 15.12, Icon: glyph.IconDecision },
  { id: "open-item", label: "Open Item", x: 320.46, y: 351.05, w: 114.1, ix: 15.12, Icon: glyph.IconOpenItem },
  { id: "task", label: "Task", x: 460.41, y: 379.55, w: 78.1, ix: 16.41, Icon: glyph.IconTask },
  { id: "risk", label: "Risk", x: 225.44, y: 387.33, w: 76.1, ix: 14.93, Icon: glyph.IconRisk },
  { id: "person", label: "Person", x: 342.06, y: 436.57, w: 92.1, ix: 16.41, Icon: glyph.IconPerson },
  { id: "lesson", label: "Lesson", x: 84.64, y: 444.34, w: 94.1, ix: 15.11, Icon: glyph.IconLesson },
  { id: "project", label: "Project", x: 471.64, y: 453.84, w: 93.1, ix: 15.11, Icon: glyph.IconProject },
  { id: "outcome", label: "Outcome", x: 205.57, y: 456.44, w: 106.1, ix: 16.42, Icon: glyph.IconOutcome },
];

/** Hairline width. The offsets above are measured from the pill's outer edge, but an
 *  absolutely-positioned child is placed from the padding box, so it is deducted. */
const BORDER = 0.86;

/**
 * A pill: 40% white over a top-lit gradient hairline, exactly as the export strokes
 * it. The two background layers are what produce the gradient border — the flat one
 * is clipped to the padding box, the gradient to the border box.
 */
const Pill =({ label, x, y, w, ix, Icon, labelX }: Chip & { labelX: number }) => (
  <div
    style={{ left: `${x}px`, top: `${y}px`, width: `${w}px` }}
    className="absolute h-[34.55px] rounded-full border-[0.86px] border-transparent shadow-[0_3.46px_8.64px_rgba(0,0,0,0.05)] backdrop-blur-[9.56px] [background-clip:padding-box,border-box] [background-image:linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),linear-gradient(180deg,#fff,rgba(255,255,255,0))] [background-origin:border-box]"
  >
    <span
      style={{ left: `${ix - BORDER}px` }}
      className="absolute top-1/2 -translate-y-1/2"
    >
      <Icon />
    </span>
    {/* The export's label metrics are ~9% tighter than plain Inter at this size;
        the group was drawn with negative tracking before being scaled down. */}
    <span
      style={{ left: `${labelX - BORDER}px` }}
      className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[13.82px] leading-none tracking-[-0.042em] text-hd-ink"
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

  return (
    <div
      style={style}
      className={`relative h-[579px] w-[642px] rounded-2xl bg-hd-panel ${className}`}
    >
      <OntologyLines className="absolute inset-0 h-full w-full" />

      <p className="absolute left-[277.99px] top-[35.5px] font-mono text-[14px] leading-none text-hd-banner">
        {t.sources}
      </p>

      {SOURCES.map((c) => (
        <Pill key={c.id} {...c} labelX={41.4} />
      ))}
      {NODES.map((c) => (
        <Pill key={c.id} {...c} labelX={36.3} />
      ))}

      <p className="absolute left-[66.15px] top-[521.9px] font-mono text-[14px] leading-none text-hd-banner">
        {t.platform}
      </p>
      <NeuronMarkSmall className="absolute left-[573.7px] top-[519.27px] h-[18.15px] w-[16.36px] text-hd-eyebrow-ink" />
    </div>
  );
};

export default OntologyDiagram;
