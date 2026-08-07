/**
 * All about-page copy, hardcoded per language.
 *
 * The Japanese strings are transcribed from the design files in `public/about`. The
 * English strings are what the language toggle shows on `/en/about` — the layout is
 * identical in both, only the words change.
 *
 * Nothing here is fetched, templated or baked into an image, so every string stays real,
 * selectable DOM text.
 *
 * Headings are arrays of lines: the designs break them at specific points and a heading
 * is short enough that the break is part of the composition, so each line is rendered as
 * its own block rather than left to reflow.
 *
 * One deliberate difference from the exports: several Japanese paragraphs in the design
 * contain a stray space mid-sentence ("本来向 き合う", "組織と産 業", "信じ ています")
 * left behind by a hard wrap in whatever the copy was pasted from. Those are dropped
 * here — the paragraphs wrap on their own at any width, and keeping the spaces would put
 * a visible gap in the middle of a word.
 */

export const mission = {
  ja: {
    eyebrow: "MISSION",
    heading: ["UNCHAIN THE", "WORLD"],
    lead: "人の可能性を、組織の可能性を解き放ち、それぞれのMISSIONをUNCHAINする。",
    body: "時間や人手の不足、分散した知識、複雑化した組織、過去の常識。本来向き合うべきMISSIONの時間が、日々の制約に奪われています。テクノロジー、とりわけAIは、そのCHAINを解くために存在する。私たちはそう信じています。",
    photos: [
      { id: "briefing", alt: "UNCHAINの社内ミーティングで説明するメンバー" },
      { id: "advisor", alt: "クライアントと打ち合わせをするメンバー" },
    ],
  },
  en: {
    eyebrow: "MISSION",
    heading: ["UNCHAIN THE", "WORLD"],
    lead: "Unchain the potential of people, the potential of organisations, and the mission each of them carries.",
    body: "Too little time and too few hands, knowledge scattered everywhere, organisations grown complex, the habits of the past. The hours that should go to the mission are taken by the constraints of the day. Technology, and AI above all, exists to break those chains. That is what we believe.",
    photos: [
      { id: "briefing", alt: "A team member presenting at an internal UNCHAIN meeting" },
      { id: "advisor", alt: "Team members in a working session with a client" },
    ],
  },
} as const;

export const vision = {
  ja: {
    // The export sets this heading in English on the Japanese page; it is Japanese here
    // instead, broken after the particle so both lines clear the body column at x=860.
    eyebrow: "VISION",
    heading: ["日本のすべての産業を", "AIネイティブに"],
    body: [
      "AIを一機能として加えるのではなく、組織と産業そのものがAIを前提に設計・進化していく状態へ。",
      "日本に蓄積された世界トップレベルの知見と技術を次世代へ継承し、ここで生まれた変革を世界へ広げます。",
    ],
  },
  en: {
    eyebrow: "VISION",
    heading: ["Make Industries AI", "Native From Japan"],
    body: [
      "Not AI bolted on as one more feature, but organisations and whole industries designed and evolving on the assumption of it.",
      "We pass Japan's world-class expertise and technology on to the next generation, and take the change born here to the rest of the world.",
    ],
  },
} as const;

export const principles = {
  ja: {
    eyebrow: "OUR PRINCIPLES",
    heading: ["私たちが大切", "にする、4つ", "の原則。"],
    items: [
      {
        n: "01",
        title: "ミッション・ファースト",
        body: "収益・成長・技術は手段。すべての意思決定をミッションに照らして評価します。",
      },
      {
        n: "02",
        title: "徹底的な明確さ",
        body: "直接的かつ正確に伝える。曖昧さを排除し、チームの速度を高めます。",
      },
      {
        n: "03",
        title: "長く残るものをつくる",
        body: "応急処置ではなく、信頼でき、保守でき、回復力のあるものを構築します。",
      },
      {
        n: "04",
        title: "人間を中心に",
        body: "AIは人間の能力を拡張するために存在します。人を意思決定の中心に保ちます。",
      },
    ],
  },
  en: {
    eyebrow: "OUR PRINCIPLES",
    heading: ["The four", "principles we", "hold to."],
    items: [
      {
        n: "01",
        title: "Mission first",
        body: "Revenue, growth and technology are means. Every decision is judged against the mission.",
      },
      {
        n: "02",
        title: "Radical clarity",
        body: "Say it directly and precisely. Remove ambiguity and the team moves faster.",
      },
      {
        n: "03",
        title: "Build what lasts",
        body: "No stopgaps: we build things that can be trusted, maintained and recovered.",
      },
      {
        n: "04",
        title: "People at the centre",
        body: "AI exists to extend human ability. We keep people at the centre of every decision.",
      },
    ],
  },
} as const;

/**
 * Leadership. `bio` is only shown in the detail drawer (`section1.svg`), which opens from
 * a card's arrow button; `prev`/`next` there walk this same order.
 */
export const leadership = {
  ja: {
    eyebrow: "LEADERSHIP",
    heading: ["異なる強みを、", "ひとつの使命へ。"],
    open: "プロフィールを見る",
    close: "閉じる",
    prev: "前のメンバー",
    next: "次のメンバー",
    members: [
      {
        id: "park",
        name: "朴 善優",
        role: "共同創業者 兼 CEO",
        alt: "朴 善優",
        bio: "東京大学松尾研究室の社長室にてAI研究プロジェクトを担当。同研究室で出会ったメンバーとともに、AIスタートアップ「株式会社Deepreneur」を共同創業。同社はForbes「日本のAI企業トップ50」に選出。その後同社を離れ、現在はUNCHAIN株式会社を創業し代表を務める。AIセキュリティに関する研究成果もForbesに取り上げられている。18歳という最年少でソフトバンクグループの後継者育成機関「ソフトバンクアカデミア」に選抜され、米日カウンシルではパネリストとしても登壇している。",
      },
      {
        id: "ebina",
        name: "蛯名 瑠偉",
        role: "共同創業者 兼 CTO",
        alt: "蛯名 瑠偉",
        bio: "中学卒業後すぐにIT業界へスカウトされ、10代からエンジニアとしてのキャリアを歩む。大規模データプラットフォームをゼロから設計・構築し、NTT西日本の全国規模データパイプラインや、政府記録のデジタル化を担うB2Bプラットフォームの開発を主導してきた。現在は機械学習・LLM領域の研究開発に軸足を置き、その知見をプロダクトに還元している。",
      },
      {
        id: "harada",
        name: "原田 大蔵",
        role: "共同創業者 兼 COO",
        alt: "原田 大蔵",
        bio: "15歳でアウトドア用品会社を共同設立し、4年間で販売網を400店舗以上へと拡大させた。並行して大手企業CMの作曲・プロデュースも手掛け、ブランドをつくる側とそれを届ける側の両方を経験。Fortune 500企業が主催するビジネスピッチコンテストでは複数回の優勝を果たしている。金融・コンサルティングの現場を野村證券およびProtivitiで経験し、現在に至る。",
      },
      {
        id: "saito",
        name: "斉藤 利治",
        role: "技術顧問",
        alt: "斉藤 利治",
        bio: "高校生時代にナムコ「パックマン」の開発に携わり、その後もセガ「ドリームキャスト」をはじめ、日本のゲーム産業を代表するプロダクトの開発に従事。KDDIテクノロジー株式会社では代表取締役社長を務め、現在は株式会社アスコンの取締役CTOを務めている。",
      },
    ],
  },
  en: {
    eyebrow: "LEADERSHIP",
    heading: ["Different strengths,", "one single mission."],
    open: "View profile",
    close: "Close",
    prev: "Previous member",
    next: "Next member",
    members: [
      {
        id: "park",
        name: "Sunwoo Park",
        role: "Co-Founder & CEO",
        alt: "Sunwoo Park",
        bio: "Led an AI research project in the president's office of the Matsuo Lab at the University of Tokyo. With people he met there, he co-founded the AI startup Deepreneur, which Forbes named one of Japan's top 50 AI companies. He has since left the company and now founds and leads UNCHAIN Inc. His research on AI security has also been covered by Forbes. At 18 he became the youngest person selected for SoftBank Academia, the SoftBank Group's successor-development programme, and he has spoken as a panellist for the U.S.-Japan Council.",
      },
      {
        id: "ebina",
        name: "Lui Ebina",
        role: "Co-Founder & CTO",
        alt: "Lui Ebina",
        bio: "Recruited into the IT industry straight out of junior high school, he began his engineering career in his teens. He has designed and built large-scale data platforms from nothing, leading a nationwide data pipeline for NTT West and the development of a B2B platform for digitising government records. His focus is now research and development in machine learning and LLMs, feeding what he learns back into the product.",
      },
      {
        id: "harada",
        name: "Taizo Harada",
        role: "Co-Founder & COO",
        alt: "Taizo Harada",
        bio: "At 15 he co-founded an outdoor equipment company and grew its distribution to more than 400 stores in four years. Alongside that he composed and produced commercials for major brands, experiencing both the building of a brand and the delivering of it. He has won multiple business pitch contests hosted by Fortune 500 companies, and came to UNCHAIN by way of finance and consulting at Nomura Securities and Protiviti.",
      },
      {
        id: "saito",
        name: "Toshiharu Saito",
        role: "Technical Advisor",
        alt: "Toshiharu Saito",
        bio: "While still in high school he worked on Namco's Pac-Man, and went on to build products that defined Japan's games industry, among them Sega's Dreamcast. He served as President and Representative Director of KDDI Technology, and is now Director and CTO of Ascon.",
      },
    ],
  },
} as const;

export const dei = {
  ja: {
    eyebrow: "DIVERSITY, EQUITY & INCLUSION",
    heading: "一人ひとりの違いを、組織の力へ。",
    items: [
      {
        id: "diversity",
        title: "ダイバーシティ",
        body: "多様な背景、経験、視点を持つ人が集い、それぞれの強みを発揮できる組織を目指します。",
      },
      {
        id: "equity",
        title: "エクイティ",
        body: "一人ひとりが能力を発揮するために必要な機会と支援へ、公平にアクセスできる環境を整えます。",
      },
      {
        id: "inclusion",
        title: "インクルージョン",
        body: "誰もが尊重され、安心して意見を伝え、意思決定に参加できる文化を育てます。",
      },
    ],
  },
  en: {
    eyebrow: "DIVERSITY, EQUITY & INCLUSION",
    heading: "Every difference, a strength of the whole.",
    items: [
      {
        id: "diversity",
        title: "Diversity",
        body: "We want an organisation where people of many backgrounds, experiences and perspectives come together and play to their strengths.",
      },
      {
        id: "equity",
        title: "Equity",
        body: "We build an environment with fair access to the opportunities and support each person needs to do their best work.",
      },
      {
        id: "inclusion",
        title: "Inclusion",
        body: "We grow a culture where everyone is respected, can speak up safely, and takes part in decisions.",
      },
    ],
  },
} as const;

/** Company facts. A value that is an array is drawn on its own line per entry. */
export const company = {
  ja: {
    eyebrow: "COMPANY",
    heading: "会社情報",
    rows: [
      { label: "企業名", value: "UNCHAIN株式会社" },
      { label: "代表取締役", value: "朴 善優" },
      { label: "設立", value: "2025年7月" },
      { label: "資本金", value: "200万円" },
      { label: "従業員数", value: "10名（業務委託を含む）" },
      { label: "所在地", value: "東京都中央区日本橋蛎殻町1丁目5-1オイスタービル2階" },
      { label: "主要取引銀行", value: ["住信SBIネット銀行", "みずほ銀行"] },
      { label: "顧問弁護士", value: "AZX総合法律事務所" },
    ],
  },
  en: {
    eyebrow: "COMPANY",
    heading: "Company information",
    rows: [
      { label: "Company name", value: "UNCHAIN Inc." },
      { label: "Representative director", value: "Sunwoo Park" },
      { label: "Founded", value: "July 2025" },
      { label: "Capital", value: "¥2,000,000" },
      { label: "Employees", value: "10 (including contractors)" },
      { label: "Address", value: "Oyster Building 2F, 1-5-1 Nihonbashi Kakigaracho, Chuo-ku, Tokyo" },
      { label: "Banks", value: ["SBI Sumishin Net Bank", "Mizuho Bank"] },
      { label: "Legal counsel", value: "AZX Law Offices" },
    ],
  },
} as const;

export const japan = {
  ja: {
    heading: ["すべては、", "日本から。"],
    body: "私たちは、組織と人の可能性をAIで解き放つAIカンパニーです。日本から、産業そのものをAIネイティブへと変えていきます。",
  },
  en: {
    heading: ["All of it,", "from Japan."],
    body: "We are an AI company that unlocks the potential of organisations and the people in them. From Japan, we are turning industry itself AI-native.",
  },
} as const;
