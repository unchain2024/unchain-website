/**
 * All business-page copy, hardcoded per language.
 *
 * The Japanese strings are transcribed from the design files in `public/business`.
 * The English strings are what the language toggle shows on `/en/solutions` — the
 * layout is identical in both, only the words change.
 *
 * Nothing here is fetched, templated or baked into an image, so every string stays
 * real, selectable DOM text.
 *
 * Headings are arrays of lines. The designs break them at specific points and a
 * heading is short enough that the break is part of the composition, so each line
 * is rendered as its own block rather than left to reflow.
 */

export const hero = {
  ja: {
    heading: "事業紹介",
    body: "AIが人に寄り添うとき、組織も個人も、本当に成し遂げたいことをUNCHAINできる。私たちは、プロダクト（NEURON）と伴走支援（AI Native Advisor）の両輪で、組織のAI活用を支えます。",
    links: [
      { label: "Neuron", href: "#neuron" },
      { label: "AI アドバイザー", href: "#advisor" },
    ],
  },
  en: {
    heading: "Our business",
    body: "When AI stands beside people, organisations and individuals can unchain what they truly set out to achieve. We support AI adoption on two fronts: our product (NEURON) and hands-on guidance (AI Native Advisor).",
    links: [
      { label: "Neuron", href: "#neuron" },
      { label: "AI Advisor", href: "#advisor" },
    ],
  },
} as const;

export const neuron = {
  ja: {
    index: "01",
    lead: "組織の文脈を理解し、意思決定を資産へ変えるAI。",
    body: "チャットや会議、ドキュメントに散在する情報をつなぎ、組織の文脈を理解。時間とともに失われる意思決定の背景を、誰もが活用できる知識資産として残します。",
    cta: { label: "サービスサイト", href: "https://the-neuron.com/ja" },
    photoAlt: "ノートPCに表示されたNEURONのダッシュボード",
    features: {
      eyebrow: "WHAT NEURON DOES",
      heading: ["分散した情報をつな", "ぎ、組織を理解する。"],
      body: "毎週行われる何百もの意思決定。その背景はチャット、会議、誰かの頭の中に分散し、担当者が離れれば失われてしまいます。",
      cards: [
        { id: "risk", title: "リスクレーダー", body: "問題を未然に検知。重要度・影響範囲・履歴を可視化。" },
        { id: "memory", title: "意思決定の記憶", body: "すべての意思決定を、根拠と結果とともに自動で記録・関連付けます。" },
        { id: "context", title: "あらゆるタスクに文脈を", body: "背景、過去の判断、依存関係、誰に聞けばよいかを一瞬で引き出します。" },
        { id: "ask", title: "何でも聞ける", body: "普段の言葉で質問すると、組織の履歴に基づく答えを出典付きで返します。" },
      ],
    },
    ontology: {
      eyebrow: "AI-DRIVEN ONTOLOGY",
      heading: ["言葉と言葉をつな", "ぎ、組織の文脈を理", "解する。"],
      body: "会話・ドキュメント・タスクから「誰が・何を・なぜ決定したのか」を読み解く、組織の意味の地図。情報を保存するだけでなく、関係性まで理解します。",
      cta: { label: "仕組みを詳しく見る", href: "/contact" },
    },
  },
  en: {
    index: "01",
    lead: "An AI that understands your organisation's context and turns decisions into assets.",
    body: "It connects the information scattered across chats, meetings and documents to understand your organisation's context, and keeps the reasoning behind decisions — normally lost over time — as knowledge anyone can use.",
    cta: { label: "Visit the product site", href: "https://the-neuron.com/ja" },
    photoAlt: "The NEURON dashboard shown on a laptop",
    features: {
      eyebrow: "WHAT NEURON DOES",
      heading: ["Connect scattered work,", "understand the org."],
      body: "Hundreds of decisions are made every week. The reasoning behind them is spread across chats, meetings and people's heads — and it leaves when they do.",
      cards: [
        { id: "risk", title: "Risk radar", body: "Catch problems early, with severity, blast radius and history made visible." },
        { id: "memory", title: "Decision memory", body: "Every decision recorded and linked automatically, with its rationale and outcome." },
        { id: "context", title: "Context for every task", body: "Surface the background, past calls, dependencies and who to ask, instantly." },
        { id: "ask", title: "Ask anything", body: "Ask in plain language and get answers grounded in your org's history, with sources." },
      ],
    },
    ontology: {
      eyebrow: "AI-DRIVEN ONTOLOGY",
      heading: ["Link meaning to", "meaning, and read", "the organisation."],
      body: "A map of what your organisation means, read out of conversations, documents and tasks — who decided what, and why. It does not just store information, it understands the relationships.",
      cta: { label: "See how it works", href: "/contact" },
    },
  },
} as const;

/**
 * The ontology figure. Positions are the design's own, in the 642x579 coordinate
 * space of `public/business/Section.svg`, translated so the panel's top-left is 0,0.
 * Node names are product/entity labels and stay in English in both locales, exactly
 * as the design has them, but they are still real text rather than baked artwork.
 */
export const ontologyLabels = {
  ja: { sources: "DATA SOURCE", platform: "AI-NATIVE ONTOLOGY" },
  en: { sources: "DATA SOURCE", platform: "AI-NATIVE ONTOLOGY" },
} as const;

export const advisor = {
  ja: {
    index: "02",
    heading: "AI Native Advisor",
    body: "提言で終わらない。戦略から実装、定着までチームの中で伴走します。",
    photoAlt: "打ち合わせをする2人のビジネスパーソン",
    steps: [
      { n: "01", title: "発見する", body: "AI課題の棚卸しと優先順位づけ" },
      { n: "02", title: "プロトタイプ", body: "1週間で試せる動くプロトタイプ" },
      { n: "03", title: "変革する", body: "意思決定・知識・働き方の再設計" },
      { n: "04", title: "可能にする", body: "チームが自走する運用とトレーニング" },
    ],
    audience: {
      eyebrow: "WHO IT'S FOR",
      heading: ["こんな課題をお", "持ちの企業へ"],
      items: [
        { id: "target", body: "全社的にAIを推進したいが、着手点が定まっていない" },
        { id: "experiment", body: "PoCは実施したものの、現場の定着まで進んでいない" },
        { id: "sparkle", body: "現場の知見や熟練技術をAIで次世代へ継承したい" },
      ],
    },
  },
  en: {
    index: "02",
    heading: "AI Native Advisor",
    body: "We do not stop at recommendations. We work inside your team from strategy through implementation to adoption.",
    photoAlt: "Two business people in a meeting",
    steps: [
      { n: "01", title: "Discover", body: "Take stock of AI opportunities and prioritise them" },
      { n: "02", title: "Prototype", body: "A working prototype you can try within a week" },
      { n: "03", title: "Transform", body: "Redesign decisions, knowledge and ways of working" },
      { n: "04", title: "Enable", body: "Operations and training so the team runs on its own" },
    ],
    audience: {
      eyebrow: "WHO IT'S FOR",
      heading: ["Built for teams", "facing this"],
      items: [
        { id: "target", body: "You want to drive AI company-wide but cannot settle on where to start" },
        { id: "experiment", body: "You ran a PoC, but it never reached adoption on the ground" },
        { id: "sparkle", body: "You want AI to pass field knowledge and craft on to the next generation" },
      ],
    },
  },
} as const;
