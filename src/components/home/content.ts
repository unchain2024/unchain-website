/**
 * All home-page copy, hardcoded per language.
 *
 * The Japanese strings are transcribed from the design files in `public/home`.
 * The English strings are the translations shown when the language toggle is
 * switched to `/en` — the layout is identical, only the copy changes.
 *
 * Nothing here is fetched or templated, so every string stays real, selectable
 * DOM text.
 */

export type Lang = "ja" | "en";

export const banner = {
  ja: {
    message: "UNCHAIN、JAPAN FUTURE GATEに出展（2026年7月8日〜10日・東京ビッグサイト）",
    href: "/news",
    dismiss: "閉じる",
  },
  en: {
    message:
      "UNCHAIN to exhibit at JAPAN FUTURE GATE (July 8–10, 2026 · Tokyo Big Sight)",
    href: "/news",
    dismiss: "Dismiss",
  },
} as const;

export const nav = {
  ja: {
    items: [
      { label: "会社概要", href: "/about" },
      { label: "事業紹介", href: "/solutions" },
      { label: "ニュース", href: "/news" },
      { label: "ブログ", href: "/blog" },
      { label: "お問い合わせ", href: "/contact" },
      { label: "採用情報", href: "/career" },
    ],
    neuron: "Neuron",
    neuronHref: "https://the-neuron.com/ja",
    demo: "デモを予約",
    language: "言語を切り替える",
  },
  en: {
    items: [
      { label: "About", href: "/about" },
      { label: "Business", href: "/solutions" },
      { label: "News", href: "/news" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/career" },
    ],
    neuron: "Neuron",
    neuronHref: "https://the-neuron.com/ja",
    demo: "Book a demo",
    language: "Switch language",
  },
} as const;

export const hero = {
  ja: {
    eyebrow: "UNCHAIN THE WORLD",
    headline: ["人と組織の可能性", "を解き放つ。"],
    primary: { label: "ソリューションを見る", href: "/solutions" },
    secondary: { label: "お問い合わせ", href: "/contact" },
    scroll: "SCROLL",
  },
  en: {
    eyebrow: "UNCHAIN THE WORLD",
    headline: ["Unlocking the potential", "of people and teams."],
    primary: { label: "See our solutions", href: "/solutions" },
    secondary: { label: "Contact us", href: "/contact" },
    scroll: "SCROLL",
  },
} as const;

export const about = {
  ja: {
    eyebrow: "ABOUT US",
    lines: [
      "可能性を、解き放つ。すべては、日本から。",
      "私たちは、組織と人の可能性をAIで解き放つAI企業です。",
      "日本から、産業そのものをAIネイティブへと変えていきます。",
    ],
    cta: { label: "ミッション・ビジョンを読む", href: "/about" },
  },
  en: {
    eyebrow: "ABOUT US",
    lines: [
      "Unlocking potential. All of it, starting from Japan.",
      "We are an AI company that unlocks the potential of people and organisations.",
      "From Japan, we are turning industry itself AI-native.",
    ],
    cta: { label: "Read our mission & vision", href: "/about" },
  },
} as const;

export const business = {
  ja: {
    eyebrow: "BUSINESS",
    heading: "事業内容",
    items: [
      {
        id: "neuron",
        title: "Neuron",
        logo: true,
        body: "NEURONは、組織の文脈を理解し、意思決定を資産に変えるAIです。",
        href: "/solutions",
      },
      {
        id: "advisor",
        title: "AI Native Advisor",
        logo: false,
        body: "戦略から定着まで伴走し、組織のAIネイティブ化を支援します。",
        href: "/solutions",
      },
    ],
  },
  en: {
    eyebrow: "BUSINESS",
    heading: "What we do",
    items: [
      {
        id: "neuron",
        title: "Neuron",
        logo: true,
        body: "NEURON is an AI that understands your organisation's context and turns decisions into assets.",
        href: "/solutions",
      },
      {
        id: "advisor",
        title: "AI Native Advisor",
        logo: false,
        body: "We walk with you from strategy to adoption, making your organisation AI-native.",
        href: "/solutions",
      },
    ],
  },
} as const;

/**
 * Only the section's own chrome. The three cards themselves are the latest
 * published articles from Supabase — see NewsSection.tsx.
 */
export const news = {
  ja: {
    eyebrow: "LATEST NEWS",
    heading: "ニュース",
    cta: { label: "すべてのニュース", href: "/news" },
  },
  en: {
    eyebrow: "LATEST NEWS",
    heading: "News",
    cta: { label: "All news", href: "/news" },
  },
} as const;

export const join = {
  ja: {
    eyebrow: "JOIN US",
    headline: ["UNCHAIN THE", "WORLDを、ともに。"],
    body: "それぞれの使命を解き放つ仲間を、私たちは探しています。",
    cta: { label: "採用情報を見る", href: "/career" },
  },
  en: {
    eyebrow: "JOIN US",
    headline: ["UNCHAIN THE", "WORLD, together."],
    body: "We are looking for people ready to unlock their own mission.",
    cta: { label: "See open roles", href: "/career" },
  },
} as const;

export const cta = {
  ja: {
    headline: ["組織を解き放つ準備は、", "できていますか？"],
    body: "まずはお気軽に、現在の課題からお聞かせください。",
    primary: { label: "お問い合わせ", href: "/contact" },
    secondary: { label: "資料をダウンロード", href: "/contact" },
  },
  en: {
    headline: ["Ready to unlock", "your organisation?"],
    body: "Start by telling us about the challenge you are facing today.",
    primary: { label: "Contact us", href: "/contact" },
    secondary: { label: "Download materials", href: "/contact" },
  },
} as const;

export const footer = {
  ja: {
    links: [
      { label: "会社概要", href: "/about" },
      { label: "ソリューション", href: "/solutions" },
      { label: "信頼・セキュリティ", href: "/terms-of-use" },
      { label: "ニュース", href: "/news" },
      { label: "採用情報", href: "/career" },
      { label: "お問い合わせ", href: "/contact" },
    ],
    copyright: "© 2026 UNCHAIN株式会社 All rights reserved.",
    legal: [
      { label: "プライバシーポリシー", href: "/privacy-policy" },
      { label: "利用規約", href: "/terms-of-use" },
      { label: "情報セキュリティ基本方針", href: "/terms-of-use" },
    ],
  },
  en: {
    links: [
      { label: "About", href: "/about" },
      { label: "Solutions", href: "/solutions" },
      { label: "Trust & security", href: "/terms-of-use" },
      { label: "News", href: "/news" },
      { label: "Careers", href: "/career" },
      { label: "Contact", href: "/contact" },
    ],
    copyright: "© 2026 UNCHAIN Inc. All rights reserved.",
    legal: [
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms of use", href: "/terms-of-use" },
      { label: "Information security policy", href: "/terms-of-use" },
    ],
  },
} as const;

export const social = [
  { id: "x", label: "X", href: "https://x.com/" },
  { id: "medium", label: "Medium", href: "https://medium.com/" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/" },
] as const;
