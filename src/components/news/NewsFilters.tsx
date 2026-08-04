import { useLang } from "@/lib/language";
import { filters, kinds } from "./content";

/**
 * The two filter dropdowns — `public/news/Section.svg`, the pair of 570x50 pills at
 * (120,134) and (750,134) under their 16px labels.
 *
 * Native `<select>`s: the export draws nothing a custom listbox would be needed for, and
 * this way the control is keyboard- and mobile-native and every option label stays real
 * DOM text. The chevron is the export's own — 12x6, stroke 2, round caps, #414651 — drawn
 * over the control because `appearance-none` removes the platform one.
 */

type Option = { value: string; label: string };

const Chevron = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-hd-chevron"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Field = ({
  label,
  value,
  options,
  onChange,
  probe,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  probe: string;
}) => (
  <label className="block">
    <span data-probe={`${probe}-label`} className="block text-[16px] leading-none text-hd-eyebrow-ink">
      {label}
    </span>
    <span className="relative mt-[15px] block">
      <select
        data-probe={probe}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[50px] w-full cursor-pointer appearance-none rounded-full border border-hd-hairline bg-white pl-4 pr-12 text-[16px] text-black outline-none transition-colors hover:border-hd-chevron focus-visible:border-hd-navy"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Chevron />
    </span>
  </label>
);

const NewsFilters = ({
  language,
  category,
  onLanguage,
  onCategory,
}: {
  language: string;
  category: string;
  onLanguage: (v: string) => void;
  onCategory: (v: string) => void;
}) => {
  const { lang } = useLang();
  const t = filters[lang];
  const k = kinds[lang];

  return (
    // 570 + 60 + 570 across the 1200 content width.
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-[60px]">
      <Field
        probe="filter-language"
        label={t.language}
        value={language}
        onChange={onLanguage}
        options={[
          { value: "all", label: t.all },
          { value: "ja", label: t.japanese },
          { value: "en", label: t.english },
        ]}
      />
      {/* Two categories, plus the "all" default that shows both together. */}
      <Field
        probe="filter-category"
        label={t.category}
        value={category}
        onChange={onCategory}
        options={[
          { value: "all", label: t.all },
          { value: "news", label: k.news },
          { value: "blog", label: k.blog },
        ]}
      />
    </div>
  );
};

export default NewsFilters;
