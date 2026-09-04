/**
 * All contact-page copy, hardcoded per language.
 *
 * The Japanese strings are transcribed from the design files in `public/contact`. The
 * English strings are what the language toggle shows on `/en/contact` — the layout is
 * identical in both, only the words change.
 *
 * Nothing here is drawn, templated or baked into an image: every string is real DOM text,
 * so it can be selected, copied, read by a screen reader and swapped by the toggle.
 */

export const hero = {
  ja: {
    heading: "まずは、現在の課題から。",
    body: "NEURONのデモ、AI Native Advisorのご相談、採用や取材について、お気軽にお問い合わせください。",
  },
  en: {
    heading: "Start with the problem in front of you.",
    body: "A NEURON demo, an AI Native Advisor consultation, a role, or a press enquiry — whatever it is, get in touch.",
  },
} as const;

/**
 * The four pills in the export's first field. `value` is what the form submits, so it
 * stays the same in both languages while the label follows the toggle.
 */
export const topics = {
  ja: [
    { value: "neuron-demo", label: "NEURONのデモ" },
    { value: "ai-consulting", label: "AI活用のご相談" },
    { value: "careers", label: "採用について" },
    { value: "press-other", label: "取材・その他" },
  ],
  en: [
    { value: "neuron-demo", label: "NEURON demo" },
    { value: "ai-consulting", label: "AI consulting" },
    { value: "careers", label: "Careers" },
    { value: "press-other", label: "Press & other" },
  ],
} as const;

export const form = {
  ja: {
    topic: "お問い合わせ内容",
    company: "会社名",
    companyPlaceholder: "UNCHAIN株式会社",
    name: "お名前",
    namePlaceholder: "山田 太郎",
    email: "メールアドレス",
    emailPlaceholder: "you@company.com",
    message: "ご相談内容",
    messagePlaceholder: "現在の課題やご希望をお聞かせください。",
    /* The consent line is one sentence with the policy link inside it, so it is stored in
       three parts rather than as a template — Japanese puts the link first, English last. */
    consentBefore: "",
    consentLink: "プライバシーポリシー",
    consentAfter: "に同意する",
    submit: "内容を送信する",
    sending: "送信中",
    successHeading: "送信しました。",
    successBody: "お問い合わせありがとうございます。2営業日以内にご連絡いたします。",
    error: "送信に失敗しました。時間をおいて、もう一度お試しください。",
  },
  en: {
    topic: "What is this about?",
    company: "Company",
    companyPlaceholder: "UNCHAIN Inc.",
    name: "Name",
    namePlaceholder: "Taro Yamada",
    email: "Email",
    emailPlaceholder: "you@company.com",
    message: "How can we help?",
    messagePlaceholder: "Tell us about the problem you are working on.",
    consentBefore: "I agree to the ",
    consentLink: "Privacy Policy",
    consentAfter: "",
    submit: "Review your message",
    sending: "Sending",
    successHeading: "Message sent.",
    successBody: "Thank you for reaching out. We will come back to you within two business days.",
    error: "Something went wrong. Please wait a moment and try again.",
  },
} as const;

/**
 * The sent state — what replaces the form once the message is away.
 *
 * The submission is confirmed first, then the overview one-pager is offered as a
 * download in either language, then NEURON as the one thing worth doing next.
 *
 * `file` is the PDF's real name in `public/downloads`, verbatim — spaces, parentheses
 * and Japanese characters included. It is stored unescaped and percent-encoded where
 * the href is built, so the name here stays greppable against the file on disk and the
 * bare `download` attribute saves it under exactly that name.
 */
export const success = {
  ja: {
    heading: "送信しました。",
    body:
      "お問い合わせありがとうございます。2営業日以内にご連絡いたします。それまでの間、UNCHAINの会社概要をご覧ください。言語をお選びください。",
    downloads: [
      { lang: "en" as const, label: "英語版をダウンロード", file: "New_UNCHAIN_Company_Deck_EN (2).pdf" },
      { lang: "ja" as const, label: "日本語版をダウンロード", file: "Copy of NEURON_向けご提案資料_統合版.pptx.pdf" },
    ],
    nextPrompt: "NEURONの実際の動きもご覧いただけます。",
    nextLabel: "NEURONを見る",
    nextHref: "https://the-neuron.com/ja",
  },
  en: {
    heading: "Message sent.",
    body:
      "Thank you for reaching out. We will come back to you within two business days. In the meantime, here is the UNCHAIN overview — pick your language.",
    downloads: [
      { lang: "en" as const, label: "Download (English)", file: "New_UNCHAIN_Company_Deck_EN (2).pdf" },
      { lang: "ja" as const, label: "Download (日本語)", file: "Copy of NEURON_向けご提案資料_統合版.pptx.pdf" },
    ],
    nextPrompt: "Want to see NEURON in action?",
    nextLabel: "Explore NEURON",
    nextHref: "https://the-neuron.com/ja",
  },
} as const;

export const meta = {
  ja: {
    title: "お問い合わせ",
    description:
      "NEURONのデモ、AI Native Advisorのご相談、採用や取材について、お気軽にお問い合わせください。",
  },
  en: {
    title: "Contact",
    description:
      "Get in touch about a NEURON demo, an AI Native Advisor consultation, careers or press.",
  },
} as const;
