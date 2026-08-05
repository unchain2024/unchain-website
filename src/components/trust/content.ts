/**
 * All trust & security page copy, hardcoded per language.
 *
 * The Japanese strings are transcribed from the design files in `public/trust-security`.
 * The English strings are what the language toggle shows on `/en/trust-security` — the
 * layout is identical in both, only the words change.
 *
 * Nothing here is fetched, templated or baked into an image, so every string stays real,
 * selectable DOM text.
 *
 * Headings are arrays of lines. The designs break them at specific points and a heading is
 * short enough that the break is part of the composition, so each line is rendered as its
 * own block rather than left to reflow.
 *
 * One transcription note: the hero paragraph reads "人による コントロール" in the export,
 * with a stray space left over from a hard wrap in whatever the copy was pasted from — the
 * same artifact several about-page paragraphs carry. It is dropped here, which is why the
 * built line breaks a character later than the export's.
 */

export const hero = {
  ja: {
    heading: ["信頼は、", "機能ではなく", "設計思想。"],
    body: "組織の重要な文脈を扱うからこそ、セキュリティ、透明性、人によるコントロールを設計の中心に置きます。",
  },
  en: {
    heading: ["Trust is not a feature.", "It is a design", "philosophy."],
    body: "Because we handle the context an organisation depends on, security, transparency and human control sit at the centre of everything we design.",
  },
} as const;

export const approach = {
  ja: {
    eyebrow: "OUR APPROACH",
    heading: ["安心してAIを使え", "る、4つの基本原則。"],
    cards: [
      {
        id: "readonly",
        title: "読み取り専用連携",
        body: "既存ツールの権限を尊重し、必要な情報だけを安全に参照します。",
      },
      {
        id: "encryption",
        title: "暗号化",
        body: "通信時・保存時のデータを暗号化し、組織の情報を保護します。",
      },
      {
        id: "notraining",
        title: "学習に使用しない",
        body: "お客様のデータを基盤モデルの学習に使用することはありません。",
      },
      {
        id: "human",
        title: "人が最終判断",
        body: "AIは判断を支援し、重要な意思決定の主導権は人に残します。",
      },
    ],
  },
  en: {
    eyebrow: "OUR APPROACH",
    heading: ["Four principles that make", "AI safe to rely on."],
    cards: [
      {
        id: "readonly",
        title: "Read-only access",
        body: "We honour the permissions in your tools and read only what is needed.",
      },
      {
        id: "encryption",
        title: "Encryption",
        body: "Data is encrypted in transit and at rest, protecting your information.",
      },
      {
        id: "notraining",
        title: "Never used for training",
        body: "Your data is never used to train foundation models.",
      },
      {
        id: "human",
        title: "People decide",
        body: "AI supports the judgement; the final call always stays with people.",
      },
    ],
  },
} as const;

export const layers = {
  ja: {
    eyebrow: "SECURITY LAYERS",
    heading: ["データの入口から、", "意思決定の出口まで。"],
    /* `num` is drawn into the plate it labels, so it is part of the diagram's copy. */
    items: [
      { id: "tools", num: "01", title: "あなたのツール", body: "Slack・ドキュメント・タスク" },
      { id: "access", num: "02", title: "安全なアクセス", body: "読み取り専用・権限" },
      { id: "neuron", num: "03", title: "ニューロン", body: "暗号化されたコンテキスト層" },
      { id: "team", num: "04", title: "あなたのチーム", body: "人間の判断" },
    ],
  },
  en: {
    eyebrow: "SECURITY LAYERS",
    heading: ["From where data enters,", "to where decisions leave."],
    items: [
      { id: "tools", num: "01", title: "Your tools", body: "Slack · documents · tasks" },
      { id: "access", num: "02", title: "Secure access", body: "Read-only · permissions" },
      { id: "neuron", num: "03", title: "Neuron", body: "The encrypted context layer" },
      { id: "team", num: "04", title: "Your team", body: "Human judgement" },
    ],
  },
} as const;

/**
 * The three documents the page links out to. `/terms-of-use` carries the information
 * security policy on this site, and the footer's legal row points its 利用規約 entry at the
 * same page, so these hrefs mirror the footer rather than inventing new routes.
 */
export const policies = {
  ja: {
    eyebrow: "POLICIES",
    heading: ["私たちの約束を、", "明文化しています。"],
    rows: [
      { id: "security", label: "情報セキュリティ基本方針", href: "/terms-of-use" },
      { id: "privacy", label: "プライバシーポリシー", href: "/privacy-policy" },
      { id: "terms", label: "利用規約", href: "/terms-of-use" },
    ],
  },
  en: {
    eyebrow: "POLICIES",
    heading: ["Our commitments,", "written down."],
    rows: [
      { id: "security", label: "Information security policy", href: "/terms-of-use" },
      { id: "privacy", label: "Privacy policy", href: "/privacy-policy" },
      { id: "terms", label: "Terms of use", href: "/terms-of-use" },
    ],
  },
} as const;
