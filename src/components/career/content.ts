/**
 * All career-page copy, hardcoded per language.
 *
 * The Japanese strings are transcribed from the design files in `public/carrers`. The
 * English strings are what the language toggle shows on `/en/career` — the layout is
 * identical in both, only the words change.
 *
 * Nothing here is fetched, templated or baked into an image, so every string stays real,
 * selectable DOM text.
 *
 * Headings are arrays because the exports break them by hand: Japanese breaks anywhere,
 * so letting the browser wrap them would not reproduce the design's lines. Each entry is
 * one line as Figma drew it.
 *
 * Three of the exports' card paragraphs carry a stray mid-sentence space
 * ("プロジェクト を評価", "リモー ト ファースト", "エクイティ を付与") left over from a hard
 * wrap in whatever the copy was pasted from. They are dropped here, exactly as
 * `src/components/about/content.ts` drops the same artefact.
 */

export const hero = {
  ja: {
    heading: ["私たちと、", "未来をつくる。"],
    body: "人々が本当に成し遂げたいことをUNCHAINするテクノロジーを、一緒に。そんな志を持つチームを、私たちは築いています。",
  },
  en: {
    heading: ["Build the future", "with us."],
    body: "We are building a team that wants to make the technology that UNCHAINs what people truly set out to achieve.",
  },
} as const;

export const why = {
  ja: {
    eyebrow: "WHY UNCHAIN",
    heading: ["大きな使命を、", "自分たちの手で。"],
    cards: [
      {
        id: "mission",
        title: "ミッションドリブン",
        body: "実際の組織と人々への影響で、プロジェクトを評価します。",
      },
      {
        id: "flexible",
        title: "柔軟な働き方",
        body: "東京とサンフランシスコを拠点とする、リモートファーストなチームです。",
      },
      {
        id: "equity",
        title: "共に成功する",
        body: "フルタイムメンバーには、意味のあるエクイティを付与します。",
      },
    ],
  },
  en: {
    eyebrow: "WHY UNCHAIN",
    heading: ["A big mission,", "in our own hands."],
    cards: [
      {
        id: "mission",
        title: "Mission-driven",
        body: "We measure a project by its impact on real organisations and real people.",
      },
      {
        id: "flexible",
        title: "Flexible by default",
        body: "A remote-first team, with bases in Tokyo and San Francisco.",
      },
      {
        id: "equity",
        title: "We succeed together",
        body: "Every full-time member is granted meaningful equity.",
      },
    ],
  },
} as const;

/** The department a role belongs to, and what the filter row offers. */
export type DeptKey = "all" | "engineering" | "sales" | "management" | "design";

export const roles = {
  ja: {
    eyebrow: "OPEN POSITIONS",
    heading: ["募集中のポジ", "ション"],
    filters: [
      { key: "all", label: "すべて" },
      { key: "engineering", label: "エンジニアリング" },
      { key: "sales", label: "セールス" },
      { key: "management", label: "マネジメント" },
      { key: "design", label: "デザイン" },
    ],
    /** Shown when a department has nothing open; the export draws no such state. */
    empty: "この職種で募集中のポジションはありません。",
    /** Announced to screen readers on each row's button. */
    open: "このポジションに応募する",
    items: [
      {
        id: "ai-llm",
        dept: "engineering",
        badge: "Engineering",
        title: "AI / LLMエンジニア",
        location: "Tokyo · Remote",
      },
      {
        id: "fullstack",
        dept: "engineering",
        badge: "Engineering",
        title: "フルスタックエンジニア",
        location: "Tokyo · Remote",
      },
      {
        id: "enterprise-ae",
        dept: "sales",
        badge: "Sales",
        title: "エンタープライズアカウントエグゼクティブ",
        location: "Tokyo · Hybrid",
      },
      {
        id: "product-designer",
        dept: "design",
        badge: "Design",
        title: "プロダクトデザイナー",
        location: "Tokyo · Remote",
      },
    ],
  },
  en: {
    eyebrow: "OPEN POSITIONS",
    heading: ["Open", "positions"],
    filters: [
      { key: "all", label: "All" },
      { key: "engineering", label: "Engineering" },
      { key: "sales", label: "Sales" },
      { key: "management", label: "Management" },
      { key: "design", label: "Design" },
    ],
    empty: "There are no open positions in this department right now.",
    open: "Apply for this role",
    items: [
      {
        id: "ai-llm",
        dept: "engineering",
        badge: "Engineering",
        title: "AI / LLM Engineer",
        location: "Tokyo · Remote",
      },
      {
        id: "fullstack",
        dept: "engineering",
        badge: "Engineering",
        title: "Full-Stack Engineer",
        location: "Tokyo · Remote",
      },
      {
        id: "enterprise-ae",
        dept: "sales",
        badge: "Sales",
        title: "Enterprise Account Executive",
        location: "Tokyo · Hybrid",
      },
      {
        id: "product-designer",
        dept: "design",
        badge: "Design",
        title: "Product Designer",
        location: "Tokyo · Remote",
      },
    ],
  },
} as const;

/**
 * The application panel a role row opens.
 *
 * The exports stop at the row — there is no drawing of an application form — so this is
 * the page's one piece of chrome the design does not fix. It keeps the form that was on
 * the page before, restyled in the exports' own tokens (white card, #E9EAEB hairline,
 * #D5D7DA controls, the CTA banner's black pill) rather than inventing any.
 */
export const apply = {
  ja: {
    title: "このポジションに応募",
    role: "応募ポジション",
    name: "氏名",
    namePlaceholder: "お名前",
    email: "メールアドレス",
    emailPlaceholder: "you@email.com",
    note: "カバーレター",
    notePlaceholder: "このポジションに興味を持った理由をお聞かせください...",
    consent: "個人情報の取り扱いに同意します",
    submit: "応募する",
    sending: "送信中...",
    close: "閉じる",
    doneTitle: "応募を受け付けました",
    doneBody: "ご応募ありがとうございます。5営業日以内に選考結果をご連絡いたします。",
    failed: "送信できませんでした。時間をおいて再度お試しください。",
  },
  en: {
    title: "Apply for this position",
    role: "Role",
    name: "Full name",
    namePlaceholder: "Your full name",
    email: "Email",
    emailPlaceholder: "you@email.com",
    note: "Cover note",
    notePlaceholder: "Tell us why you're interested in this role...",
    consent: "I agree to the handling of my personal information",
    submit: "Submit application",
    sending: "Submitting...",
    close: "Close",
    doneTitle: "Application received",
    doneBody:
      "Thank you for applying. We'll review your application and get back to you within 5 business days.",
    failed: "Something went wrong. Please try again later.",
  },
} as const;

export const process = {
  ja: {
    eyebrow: "PROCESS",
    heading: ["選考プロセス"],
    steps: [
      {
        id: "application",
        title: "書類選考",
        body: "履歴書と、UNCHAINに興味を持った理由を簡潔にお送りください。",
      },
      {
        id: "intro",
        title: "カジュアル面談",
        body: "チームメンバーとの30分の会話で、お互いを知りましょう。",
      },
      {
        id: "founder",
        title: "創業者面談＆オファー",
        body: "創業者とお会いいただきます。フィットすれば、48時間以内に結果をお伝えします。",
      },
    ],
  },
  en: {
    eyebrow: "PROCESS",
    heading: ["Selection process"],
    steps: [
      {
        id: "application",
        title: "Application",
        body: "Send us your resume and a brief note on what draws you to UNCHAIN.",
      },
      {
        id: "intro",
        title: "Intro call",
        body: "A 30-minute conversation with a team member, to get to know each other.",
      },
      {
        id: "founder",
        title: "Founder meeting & offer",
        body: "Meet a founder. If it is a fit, we come back to you within 48 hours.",
      },
    ],
  },
} as const;
