/**
 * Hand-picked URLs for individual articles, keyed by article id.
 *
 * Slugs are normally derived from an article's title (see articleLinks.ts).
 * That works well when a post has an English title, but a Japanese-only title
 * has almost no latin text to work with — "UNCHAIN、プレシードラウンドで3500万円
 * 調達を実施" reduces to "unchain-3500". Add an entry here to pin a readable URL
 * instead.
 *
 * Also use this when you want a shorter or more memorable URL than the title
 * gives, or to freeze an article's URL before editing its title.
 *
 * Rules:
 *   - the key is the article's uuid, from the admin edit URL (/edit/<id> or
 *     /edit-blog/<id>) — it works for both news and blog posts
 *   - the value is the slug only, with no leading slash and no /blog or /news
 *   - keep values lowercase, latin, hyphen-separated
 *   - an override always wins; if a derived slug would clash with one, the
 *     *derived* one moves aside, never the override
 *
 * Changing an entry changes that article's URL. Previously shared links keep
 * working — the old derived slug and the bare id both still resolve.
 */
export const ARTICLE_SLUG_OVERRIDES: Record<string, string> = {
  // --- News: URLs kept from before the 2026-09 database rebuild -----------
  // UNCHAIN Co., Ltd. to Exhibit at "Eight EXPO 2026 Summer" — the original post
  // had a longer English title, and its URL is still linked from outside.
  "e86ad8d6-39b5-4f0a-8087-728a1247e15f": "unchain-inc-to-make-its-debut-at-the-3rd-ai-practical-applications-expo-ai-pax",

  // [Recap] Gartner Digital Workplace Summit 2026 — "[Recap]"/"[Highlights]" was dropped from the title; the URL keeps it.
  "bd191870-dd3b-46ca-bc7c-67f539ad93ac": "recap-gartner-digital-workplace-summit-2026",
  // [Recap] NEXT BUSINESS EXPO SUMMER 2026 — "[Recap]"/"[Highlights]" was dropped from the title; the URL keeps it.
  "2e51ccbe-dbf3-4a52-a086-5e9118490fbc": "recap-next-business-expo-summer-2026",
  // [Highlights] JAPAN FUTURE GATE at Back Office World / Marketing & Sales World 2026 — "[Recap]"/"[Highlights]" was dropped from the title; the URL keeps it.
  "6ea2ece1-6911-4d2c-9b52-e500c560b385": "highlights-japan-future-gate-at-back-office-world-marketing-sales-world-2026",

  // --- News: Japanese-only titles ---------------------------------------
  // NOTE: the three ids below belong to the database that was deleted in 2026-09.
  // The articles were not in the Google Drive export and have not been recreated;
  // the entries are kept so the URLs are reserved if the posts are ever re-entered
  // (insert them with these ids — see supabase/seed/import-articles.mjs).
  // UNCHAIN、AIツール「NEURON」を「読むAI」から「動くAI」へ進化。…POC導入企業を募集
  "a2b5d4cf-daaf-461d-8e66-6031cef74468": "neuron-reading-ai-to-acting-ai-poc",
  // UNCHAIN、プロダクトの意思決定を「いつ・誰が・なぜ」で可視化するAIツール「NEURON」をリリース
  "0cd7c415-1d86-4f34-9638-863ab70f7efe": "neuron-release",
  // UNCHAIN、プレシードラウンドで3500万円調達を実施 ー「継続的最適化」のAI基盤で世界に挑む
  "6a3401ac-3d4d-4e09-babe-855098b6b5fb": "pre-seed-round-35m-jpy",
};
