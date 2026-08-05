import { useState } from "react";
import { useLang } from "@/lib/language";
import { ChevronRight, Close } from "@/components/home/icons";
import { apply } from "./content";

/**
 * The application form a role row opens.
 *
 * `public/carrers` stops at the row — there is no drawing of a form anywhere in the set —
 * so this is the one piece of the page the design does not fix. It keeps the application
 * flow the page already had (the same Web3Forms endpoint) and is dressed only in tokens the
 * exports do define: a white 16px-radius card on the #E9EAEB hairline, #D5D7DA controls,
 * #535862 labels and the CTA banner's 50px black pill. Nothing here invents a colour.
 */
const ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = "dadc5e81-7afc-4929-bcbb-a92765419252";

const FIELD =
  "h-[50px] w-full rounded-xl border border-hd-hairline bg-white px-4 text-[16px] leading-none text-black outline-none transition-colors placeholder:text-hd-eyebrow focus:border-hd-navy";

const ApplyPanel = ({ role, onClose }: { role: string; onClose: () => void }) => {
  const { lang } = useLang();
  const t = apply[lang];

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", note: "", consent: false });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Job Application: ${role} — ${form.name}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          role,
          cover_note: form.note,
        }),
      });
      const data = await res.json();
      if (data.success) setSent(true);
      else setError(data.message || t.failed);
    } catch {
      setError(t.failed);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-hd-card-line bg-white p-6 lg:mt-[24px] lg:p-10">
      {sent ? (
        <div className="text-center">
          <h3 className="text-[20px] font-bold leading-none text-black">{t.doneTitle}</h3>
          <p className="mx-auto mt-[15.5px] max-w-[470px] text-[14px] leading-[20px] text-hd-eyebrow-ink">
            {t.doneBody}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-6">
            <div>
              <h3 className="text-[20px] font-bold leading-none text-black">{t.title}</h3>
              <p className="mt-[15.5px] text-[14px] leading-[20px] text-hd-eyebrow-ink">
                {t.role}: {role}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-hd-hairline text-hd-chevron transition-colors hover:border-hd-chevron"
            >
              <Close />
            </button>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="block text-[16px] leading-none text-hd-eyebrow-ink">
                  {t.name}
                </span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={t.namePlaceholder}
                  className={`mt-[15px] ${FIELD}`}
                />
              </label>

              <label className="block">
                <span className="block text-[16px] leading-none text-hd-eyebrow-ink">
                  {t.email}
                </span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className={`mt-[15px] ${FIELD}`}
                />
              </label>
            </div>

            <label className="block">
              <span className="block text-[16px] leading-none text-hd-eyebrow-ink">{t.note}</span>
              <textarea
                rows={4}
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                placeholder={t.notePlaceholder}
                className="mt-[15px] w-full resize-none rounded-xl border border-hd-hairline bg-white px-4 py-3 text-[16px] leading-[22px] text-black outline-none transition-colors placeholder:text-hd-eyebrow focus:border-hd-navy"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                required
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
                className="h-[18px] w-[18px] shrink-0 accent-black"
              />
              <span className="text-[14px] leading-[20px] text-hd-eyebrow-ink">{t.consent}</span>
            </label>

            {error && <p className="text-[14px] leading-[20px] text-hd-navy">{error}</p>}

            <button
              type="submit"
              disabled={sending}
              className="inline-flex h-[50px] items-center gap-[14px] rounded-full bg-black pl-[17px] pr-[23px] text-[16px] leading-none text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {sending ? t.sending : t.submit}
              <ChevronRight className="text-white" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ApplyPanel;
