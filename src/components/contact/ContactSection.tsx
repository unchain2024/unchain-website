import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { hero, topics, form } from "./content";
import { BladeTopRight, BladeBottomLeft } from "./art/HeroArt";
import { Chevron, Tick } from "./icons";

/**
 * Contact — `public/contact/Frame 21472261322.svg` (empty) and `Frame 2147226132.svg`
 * (filled), both 1440x1052. The two exports are the same drawing in its two states, so
 * they are built as one component; the filled export is what fixes the value styling.
 *
 * Geometry at 1440w, read off the exports:
 *   120px gutters, so the row is 460 (copy) + 120 (gap) + 620 (card) = 1200.
 *   Card 700..1320 x 120..932, 16px radius, 1px #E9EAEB, 40px padding -> a 540px column.
 *   Inside it every field is a 24px-leading label, 6px, then the control; the blocks sit
 *   32px apart, and the consent row and the button each sit 33px below what precedes it.
 *   Pills are 50px tall, 25px radius, 24px side padding and 16px apart both ways.
 *   Inputs are a 45px box with a 1px #D5D7DA rule on the bottom edge; the message box is
 *   the same thing 170px tall. Value text sits 14px below each box's top edge.
 *   That stack sums to the export's 812px card exactly, and 120 + 812 + 120 = 1052.
 *
 * Type, measured against the exports rather than guessed (tools/design/contact_fit.json):
 *   heading 72/600 on 79px leading, tracked -0.044em — the export's Japanese face sets
 *   tighter than Noto Sans JP, the same correction the business and news heroes carry;
 *   copy, labels and the consent line 16/400; the pills and the button label 16/500;
 *   field values and placeholders 20/400.
 *
 * Being the page's only section above the footer it reserves the fixed header's height
 * itself, the same way the about and news heroes do.
 */

const WEB3FORMS_KEY = "dadc5e81-7afc-4929-bcbb-a92765419252";

/**
 * Shared field chrome.
 *
 * The export draws no focus state; this adds one — a field cannot be keyboard-usable
 * without it — out of the palette the design already uses: the rule goes black, which is
 * exactly how the export marks the selected pill.
 *
 * `block` matters. Left inline, a textarea sits on its parent's baseline and adds a
 * descender's worth of space under the message box, which walks the consent row and the
 * button 7.6px down the card.
 */
const FIELD =
  "block w-full border-b border-hd-hairline bg-transparent text-[20px] leading-[28px] text-black outline-none transition-colors placeholder:text-hd-eyebrow focus:border-black";

/**
 * The export puts the ink of every field's text 14px below the top of its box, and 10px
 * of padding above a 28px line whose own half-leading is 4 is what gets there.
 *
 * The textarea takes that directly. An input needs the padding on both sides: given room
 * to spare, Chrome centres an input's line in the content box, and it does not put the
 * placeholder and the typed value in quite the same place when it does — the value lands
 * 2px lower. Padding the 45px box to exactly one 28px line (45 - 1 rule - 10 - 6) leaves
 * nothing to centre, so both sit at the padding edge and both match the export.
 */
const INPUT = `h-[45px] pt-[10px] pb-[6px] ${FIELD}`;
const TEXTAREA = `h-[170px] resize-none pt-[10px] ${FIELD}`;

/**
 * A field label and its required mark. The export sets the mark in #D92D20 after a normal
 * word space, so it is a span in the same line box rather than a pseudo-element, and the
 * 24px leading is what puts the label's ink where the export draws it.
 */
const Label = ({ children, probe }: { children: React.ReactNode; probe?: string }) => (
  <span data-probe={probe} className="block text-[16px] leading-6 text-hd-eyebrow-ink">
    {children} <span className="text-hd-required">*</span>
  </span>
);

const ContactSection = () => {
  const { lang, localePath } = useLang();
  const copy = hero[lang];
  const t = form[lang];
  const pills = topics[lang];

  const [values, setValues] = useState({
    topic: pills[0].value as string,
    company: "",
    name: "",
    email: "",
    message: "",
    consent: false,
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const set = (field: string, value: string | boolean) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFailed(false);
    try {
      const topicLabel = pills.find((p) => p.value === values.topic)?.label ?? values.topic;
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Contact: ${topicLabel} — ${values.name}`,
          from_name: values.name,
          topic: topicLabel,
          company: values.company,
          name: values.name,
          email: values.email,
          message: values.message,
        }),
      });
      const data = await res.json();
      if (data.success) setSent(true);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      data-nav-theme="light"
      data-probe="s-contact"
      className="w-full overflow-hidden bg-white pt-[68px]"
    >
      <div className="relative mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:h-[1052px] lg:px-[120px] lg:py-0">
        {/* Both blades run off the canvas at their corner; the section clips them. */}
        <BladeTopRight className="pointer-events-none absolute left-[1170.12px] top-[-45px] hidden h-[356.7px] w-[469.16px] select-none lg:block" />
        <BladeBottomLeft className="pointer-events-none absolute left-[-198.887px] top-[579px] hidden h-[356.7px] w-[469.16px] select-none lg:block" />

        <div className="relative lg:flex lg:gap-[120px] lg:pt-[120px]">
          {/* ── left column: heading + standfirst ─────────────────────────── */}
          {/* Above the fold, so these reveal on mount rather than on scroll. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:w-[460px] lg:shrink-0 lg:pt-[5px]"
          >
            <h1
              data-probe="hero-heading"
              className="text-[40px] font-semibold leading-[1.1] tracking-[-0.044em] text-black sm:text-[56px] lg:text-[72px] lg:leading-[79px]"
            >
              {copy.heading}
            </h1>
            <p
              data-probe="hero-body"
              className="mt-6 text-[16px] leading-[22px] text-hd-eyebrow-ink lg:mt-9"
            >
              {copy.body}
            </p>
          </motion.div>

          {/* ── right column: the card ──────────────────────────────────────
              39px of padding plus the 1px border is the export's 40px from the card's
              outer edge to its 540px column; `p-10` would put it at 41. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            data-probe="card"
            className="mt-12 rounded-2xl border border-hd-card-line bg-white p-6 sm:p-10 lg:mt-0 lg:w-[620px] lg:shrink-0 lg:p-[39px]"
          >
            {sent ? (
              /* The exports stop at the submit button, so the sent state is built from
                 the scale the card already uses rather than invented: the value size for
                 the confirmation, the standfirst's for the line under it. */
              <div className="lg:min-h-[732px]">
                <p className="text-[20px] leading-[28px] text-black">{t.successHeading}</p>
                <p className="mt-3 text-[16px] leading-[22px] text-hd-eyebrow-ink">
                  {t.successBody}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* topic — the four pills */}
                <div role="radiogroup" aria-labelledby="contact-topic-label">
                  <Label probe="label-topic">
                    <span id="contact-topic-label">{t.topic}</span>
                  </Label>
                  <div data-probe="pills" className="mt-[10px] flex flex-wrap gap-4">
                    {pills.map((pill) => {
                      const selected = values.topic === pill.value;
                      return (
                        <label
                          key={pill.value}
                          className={`inline-flex h-[50px] cursor-pointer items-center rounded-full border px-6 text-[16px] font-medium leading-none transition-colors ${
                            selected
                              ? "border-black text-black"
                              : "border-hd-card-line text-hd-banner hover:border-hd-hairline"
                          }`}
                        >
                          <input
                            type="radio"
                            name="topic"
                            value={pill.value}
                            checked={selected}
                            onChange={(e) => set("topic", e.target.value)}
                            className="sr-only"
                          />
                          {pill.label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* company */}
                <label className="mt-8 block">
                  <Label probe="label-company">{t.company}</Label>
                  <input
                    data-probe="input-company"
                    type="text"
                    required
                    value={values.company}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder={t.companyPlaceholder}
                    className={`mt-[6px] ${INPUT}`}
                  />
                </label>

                {/* name + email, on the export's 254 / 32 / 254 split */}
                <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <label className="block">
                    <Label probe="label-name">{t.name}</Label>
                    <input
                      data-probe="input-name"
                      type="text"
                      required
                      value={values.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder={t.namePlaceholder}
                      className={`mt-[6px] ${INPUT}`}
                    />
                  </label>
                  <label className="block">
                    <Label probe="label-email">{t.email}</Label>
                    <input
                      data-probe="input-email"
                      type="email"
                      required
                      value={values.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className={`mt-[6px] ${INPUT}`}
                    />
                  </label>
                </div>

                {/* message — the same field, 170px tall */}
                <label className="mt-8 block">
                  <Label probe="label-message">{t.message}</Label>
                  <textarea
                    data-probe="input-message"
                    required
                    value={values.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder={t.messagePlaceholder}
                    className={`mt-[6px] ${TEXTAREA}`}
                  />
                </label>

                {/* consent */}
                <div data-probe="consent" className="mt-[33px] flex items-center gap-3">
                  <label className="relative flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center">
                    <input
                      type="checkbox"
                      required
                      checked={values.consent}
                      onChange={(e) => set("consent", e.target.checked)}
                      className="peer sr-only"
                    />
                    <span
                      className={`absolute inset-0 rounded-[6px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-black/30 ${
                        values.consent ? "border-black bg-black" : "border-hd-hairline bg-white"
                      }`}
                    />
                    {values.consent && <Tick className="relative h-5 w-5 text-white" />}
                  </label>
                  <span className="text-[16px] leading-none text-hd-eyebrow-ink">
                    {t.consentBefore}
                    <Link
                      to={localePath("/privacy-policy")}
                      className="underline decoration-[0.8px] underline-offset-2 transition-colors hover:text-black"
                    >
                      {t.consentLink}
                    </Link>
                    {t.consentAfter}
                  </span>
                </div>

                {/* submit */}
                <button
                  data-probe="submit"
                  type="submit"
                  disabled={sending}
                  className="mt-[33px] inline-flex h-[50px] w-full items-center justify-center gap-1 rounded-full bg-black text-[16px] font-medium leading-none text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {sending ? t.sending : t.submit}
                  <Chevron className="h-6 w-6" />
                </button>

                {failed && (
                  <p role="alert" className="mt-4 text-[16px] leading-[22px] text-hd-required">
                    {t.error}
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
