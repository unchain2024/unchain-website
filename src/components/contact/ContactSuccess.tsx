import { motion } from "framer-motion";
import { useLang } from "@/lib/language";
import { success } from "./content";
import { Download, Tick } from "./icons";
import { ArrowUpRight } from "@/components/home/icons";

/**
 * Contact — the sent state.
 *
 * The design exports in `public/contact` stop at the submit button, so this is built
 * from the vocabulary the rest of the site already owns rather than invented: the
 * form's own 50px pill and 25px radius for every button, the black fill the submit
 * button uses, the #D5D7DA and #E9EAEB hairlines, and the 16/22 standfirst ink.
 * Nothing green, nothing new in the palette.
 *
 * It fills the card the form vacated — `min-h` matches the form's own height at `lg`
 * so the page does not jump on submit — and centres one column inside it: the tick,
 * the confirmation, the two one-pagers, then a rule and NEURON as the next step.
 */

/**
 * The PDFs are named as they were handed over — spaces, parentheses and Japanese
 * characters and all — so the segment is percent-encoded rather than dropped into the
 * href raw. `encodeURIComponent` is right here because the filename is one path segment
 * and carries no `/` of its own; `encodeURI` would leave the space and the `(` alone.
 */
const downloadHref = (file: string) => `/downloads/${encodeURIComponent(file)}`;

/* The form's submit button, reused: same box, same radius, same fill. */
const PILL =
  "inline-flex h-[50px] items-center justify-center gap-2 rounded-full text-[16px] font-medium leading-none transition-all";

const ContactSuccess = () => {
  const { lang } = useLang();
  const t = success[lang];

  return (
    <div
      role="status"
      aria-live="polite"
      data-probe="sent"
      className="flex flex-col items-center justify-center px-2 py-10 text-center sm:px-6 lg:min-h-[732px] lg:py-0"
    >
      {/* The consent tick, given a ring and scaled up. Drawing the confirmation out of
          the checkbox glyph keeps the state in the same hand as the form it replaces. */}
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        aria-hidden
        className="flex h-16 w-16 items-center justify-center rounded-full border-[1.5px] border-hd-ink text-hd-ink"
      >
        <Tick className="h-7 w-7" />
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full"
      >
        <h2 className="mt-8 text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-black lg:text-[28px]">
          {t.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-[420px] text-[16px] leading-[22px] text-hd-eyebrow-ink">
          {t.body}
        </p>

        {/* However many decks the language offers — one on `/en`, both on the Japanese
            site — they carry equal weight, since the choice is a language and not a
            hierarchy, so each takes the submit button's fill. `flex-1` means the single
            English button fills the measure exactly as the submit button did, and the
            row stacks below `sm`, where the card is too narrow for two labels. */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {t.downloads.map((file) => (
            <a
              key={file.lang}
              href={downloadHref(file.file)}
              download
              hrefLang={file.lang}
              data-probe={`download-${file.lang}`}
              className={`${PILL} flex-1 bg-black px-6 text-white hover:opacity-90`}
            >
              <Download className="h-5 w-5" />
              {file.label}
            </a>
          ))}
        </div>

        {/* The rule separates "you are done here" from "here is where to go next", the
            same job the hairline does between the footer's rows. */}
        <div className="mt-10 border-t border-hd-card-line pt-8">
          <p className="text-[16px] leading-[22px] text-hd-eyebrow-ink">{t.nextPrompt}</p>
          <a
            href={t.nextHref}
            target="_blank"
            rel="noopener noreferrer"
            data-probe="next"
            className={`${PILL} mt-4 border border-hd-hairline px-6 text-black hover:border-black`}
          >
            {t.nextLabel}
            <ArrowUpRight className="text-hd-eyebrow" />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactSuccess;
