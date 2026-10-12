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
    body: "AIが人に寄り添うとき、組織も個人も、本当に成し遂げたいことをUNCHAINできる。私たちは、プロダクト（NEURON、Pulse）と伴走支援（AI Native Advisor）の両輪で、組織のAI活用を支えます。",
    links: [
      { label: "Neuron", href: "#neuron" },
      { label: "AI アドバイザー", href: "#advisor" },
      { label: "Pulse", href: "#pulse" },
    ],
  },
  en: {
    heading: "Our business",
    body: "When AI stands beside people, organisations and individuals can unchain what they truly set out to achieve. We support AI adoption on two fronts: our products (NEURON and Pulse) and hands-on guidance (AI Native Advisor).",
    links: [
      { label: "Neuron", href: "#neuron" },
      { label: "AI Advisor", href: "#advisor" },
      { label: "Pulse", href: "#pulse" },
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
      cta: { label: "仕組みを詳しく見る", href: "https://the-neuron.com/ja/ai-driven-ontology" },
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
      cta: { label: "See how it works", href: "https://the-neuron.com/en/ai-driven-ontology" },
    },
  },
} as const;

/**
 * Every word inside the ontology figure. The export outlines these to paths in
 * English only; the Japanese set is the localised diagram Neuron publishes at
 * the-neuron.com/ja/ai-driven-ontology.
 *
 * Because the two sets have very different measures, the figure's pills size to
 * their content and are anchored on the centre the design drew them on rather than
 * on a fixed width — see `OntologyDiagram`.
 */
export const ontologyLabels = {
  ja: {
    sources: "データソース",
    platform: "AIネイティブ オントロジ",
    nodes: {
      pm: "プロジェクト管理ツール",
      workforce: "人材管理",
      docs: "ドキュメントストレージ",
      erp: "ERP",
      warehouse: "データウェアハウス",
      chat: "チャットツール",
      email: "メール",
      crm: "CRM",
      sheets: "スプレッドシート",
      decision: "決定",
      "open-item": "未解決項目",
      task: "タスク",
      risk: "リスク",
      person: "人物",
      lesson: "教訓",
      project: "プロジェクト",
      outcome: "成果",
    },
  },
  en: {
    sources: "DATA SOURCE",
    platform: "AI-NATIVE ONTOLOGY",
    nodes: {
      pm: "Project management tools",
      workforce: "Workforce management",
      docs: "Document storage",
      erp: "ERP",
      warehouse: "Data warehouse",
      chat: "Chat tools",
      email: "Email",
      crm: "CRM",
      sheets: "Spreadsheets",
      decision: "Decision",
      "open-item": "Open Item",
      task: "Task",
      risk: "Risk",
      person: "Person",
      lesson: "Lesson",
      project: "Project",
      outcome: "Outcome",
    },
  },
} as const;

/**
 * Pulse — copy drawn from pulse.co.jp (en and ja), condensed to the measure the
 * Neuron and Advisor blocks set. The product site's Japanese pages live under `/ja`.
 */
export const pulse = {
  ja: {
    index: "03",
    name: "Pulse",
    lead: "議事録から始まるコンテキストAIエージェント。",
    body: "ボットを招待することなく会議を記録し、会話と社内情報から仕事の背景を理解。ブリーフ、議事録、次のアクションまで、チームがすぐ動ける形にします。",
    cta: { label: "仕組みを詳しく見る", href: "https://www.pulse.co.jp/ja" },
    photoAlt: "会議の様子。誰が何を話したかをPulseがひとつのノートにまとめる",
    features: {
      eyebrow: "WHAT PULSE DOES",
      heading: ["会議から、", "次のアクションまで。"],
      body: "会議の前・最中・あとでPulseが働き、会話の文脈を失うことなく、フォローアップが自然に始まります。",
      cards: [
        { id: "brief", title: "ミーティング前のブリーフ", body: "カレンダー・顧客情報・過去の会話から、参加者と今回の確認事項を整理します。" },
        { id: "notes", title: "文字起こしとノート", body: "端末の音声から文字起こしし、自分のメモと資料リンクを会話と一緒に保存。ボットの招待は不要です。" },
        { id: "followup", title: "フォローアップとタスク", body: "フォローメールとタスクを準備し、決まった条件・担当・期限をCRMなどの連携ツールへ反映します。" },
        { id: "chat", title: "Pulse ChatとMCP連携", body: "過去の会話と関連資料を横断して根拠付きで回答。蓄積した文脈をClaude、ChatGPT、Cursorから参照できます。" },
      ],
    },
    steps: {
      eyebrow: "HOW IT WORKS",
      items: [
        { n: "01", title: "会議の前", body: "予定と過去の会話から、参加者の背景と確認事項をまとめたブリーフを準備します。" },
        { n: "02", title: "会議の最中", body: "端末の音声で記録し、会話とメモを整理します。" },
        { n: "03", title: "会議のあと", body: "ノートから次のアクションを確認し、フォローメールやタスク、CRM更新を用意します。" },
      ],
    },
  },
  en: {
    index: "03",
    name: "Pulse",
    lead: "The context AI agent that starts with meeting notes.",
    body: "Pulse captures your meetings without a bot, understands the context behind your work from conversations and company knowledge, and turns it into briefs, notes and next actions your team can act on.",
    cta: { label: "See how it works", href: "https://www.pulse.co.jp/en" },
    photoAlt: "A team in a meeting, with Pulse keeping who said what in one note",
    features: {
      eyebrow: "WHAT PULSE DOES",
      heading: ["From the meeting", "to the next action."],
      body: "Pulse works before, during and after every meeting, so the context of each conversation is never lost and the follow-up starts on its own.",
      cards: [
        { id: "brief", title: "Pre-meeting briefs", body: "Calendar events, customer information and earlier conversations, turned into attendee context and open questions." },
        { id: "notes", title: "Transcription and notes", body: "Audio transcribed on your device, with your own notes and document links kept with the conversation. No bot to invite." },
        { id: "followup", title: "Follow-up drafts and tasks", body: "Follow-up emails and tasks drafted for you, with terms, owners and deadlines carried into tools such as your CRM." },
        { id: "chat", title: "Pulse Chat and MCP", body: "Ask across your meeting history and documents with sources, and open that context to Claude, ChatGPT and Cursor." },
      ],
    },
    steps: {
      eyebrow: "HOW IT WORKS",
      items: [
        { n: "01", title: "Before the meeting", body: "A brief with attendee context and open questions, built from your calendar and past conversations." },
        { n: "02", title: "In the meeting", body: "Audio captured on your device, with your notes organised alongside the conversation." },
        { n: "03", title: "After the meeting", body: "Notes and next steps reviewed, follow-ups drafted and connected tools updated." },
      ],
    },
  },
} as const;

export const advisor = {
  ja: {
    index: "02",
    heading: "AI Native Advisor",
    body: "提言で終わらない。戦略から実装、定着までチームの中で伴走します。",
    cta: { label: "仕組みを詳しく見る", href: "https://the-aiadviser.com/jp" },
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
    cta: { label: "See how it works", href: "https://the-aiadviser.com/en" },
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
