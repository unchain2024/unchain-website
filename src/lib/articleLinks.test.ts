import { describe, it, expect } from "vitest";
import {
  slugify,
  getBaseSlug,
  buildSlugIndex,
  getArticleSlug,
  resolveArticleBySlug,
  articlePath,
  articleUrl,
  isUuid,
} from "./articleLinks";

const UUID_A = "1f2e3d4c-5b6a-4978-8899-aabbccddeeff";
const UUID_B = "9a8b7c6d-5e4f-4321-b012-112233445566";

// A real entry from articleSlugOverrides.ts, so the override path is covered
// against the map the site actually ships.
const OVERRIDDEN_ID = "6a3401ac-3d4d-4e09-babe-855098b6b5fb";
const OVERRIDDEN_SLUG = "pre-seed-round-35m-jpy";

describe("slugify", () => {
  it("builds a kebab-case slug from a title", () => {
    expect(slugify("[Recap] AI World 2026 Summer Tokyo")).toBe(
      "recap-ai-world-2026-summer-tokyo"
    );
  });

  it("drops quotes instead of turning them into separators", () => {
    expect(slugify("UNCHAIN's Roadmap")).toBe("unchains-roadmap");
  });

  it("strips diacritics", () => {
    expect(slugify("Café München")).toBe("cafe-munchen");
  });

  it("returns an empty string for titles with no latin alphanumerics", () => {
    expect(slugify("組織型AIの可能性")).toBe("ai");
    expect(slugify("組織型の可能性")).toBe("");
    expect(slugify("")).toBe("");
    expect(slugify(null)).toBe("");
  });

  it("never leaves leading or trailing separators", () => {
    expect(slugify("  --- Hello, World! --- ")).toBe("hello-world");
  });

  it("caps length without leaving a trailing separator", () => {
    const slug = slugify("a".repeat(60) + " " + "b".repeat(60));
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith("-")).toBe(false);
  });

  it("cuts at a word boundary rather than mid-word", () => {
    const slug = slugify(
      "UNCHAIN Inc. to Exhibit at JAPAN FUTURE GATE within Back Office DXPO Marketing and Sales DXPO"
    );
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug).toBe(
      "unchain-inc-to-exhibit-at-japan-future-gate-within-back-office-dxpo-marketing"
    );
  });

  it("still truncates when one word is longer than the cap", () => {
    const slug = slugify("x".repeat(100));
    expect(slug).toBe("x".repeat(80));
  });
});

describe("getBaseSlug", () => {
  it("prefers a hand-picked override when one is pinned", () => {
    expect(getBaseSlug({ id: OVERRIDDEN_ID, title_en: "Some Title" })).toBe(
      OVERRIDDEN_SLUG
    );
  });

  it("derives from the title when no override is pinned", () => {
    expect(getBaseSlug({ id: UUID_A, title_en: "Some Title" })).toBe("some-title");
  });

  it("prefers the English title over the Japanese one", () => {
    expect(
      getBaseSlug({ id: UUID_A, title: "ニュース", title_en: "Latest News" })
    ).toBe("latest-news");
  });

  it("falls back to the Japanese title when it slugifies", () => {
    expect(getBaseSlug({ id: UUID_A, title: "NEURON Update" })).toBe("neuron-update");
  });

  it("falls back to the id for a Japanese-only title", () => {
    expect(getBaseSlug({ id: UUID_A, title: "組織型の可能性" })).toBe(UUID_A);
  });
});

describe("buildSlugIndex", () => {
  it("leaves non-colliding slugs undecorated", () => {
    const index = buildSlugIndex([
      { id: UUID_A, title_en: "Latest News" },
      { id: UUID_B, title_en: "NEURON Update" },
    ]);
    expect(index.get(UUID_A)).toBe("latest-news");
    expect(index.get(UUID_B)).toBe("neuron-update");
  });

  it("disambiguates collisions so two posts never share a URL", () => {
    // Both Japanese-only titles reduce to the same latin fragment.
    const a = { id: UUID_A, title: "UNCHAIN、プレシードラウンドで調達" };
    const b = { id: UUID_B, title: "UNCHAIN、資金調達を実施" };
    expect(getBaseSlug(a)).toBe(getBaseSlug(b)); // precondition: they collide

    const index = buildSlugIndex([a, b]);
    expect(index.get(UUID_A)).toBe(`unchain-${UUID_A.slice(0, 8)}`);
    expect(index.get(UUID_B)).toBe(`unchain-${UUID_B.slice(0, 8)}`);
    expect(index.get(UUID_A)).not.toBe(index.get(UUID_B));
  });

  it("is independent of array order", () => {
    const a = { id: UUID_A, title: "UNCHAIN、プレシードラウンドで調達" };
    const b = { id: UUID_B, title: "UNCHAIN、資金調達を実施" };
    expect(buildSlugIndex([a, b]).get(UUID_A)).toBe(buildSlugIndex([b, a]).get(UUID_A));
  });

  it("passes overrides through untouched", () => {
    const index = buildSlugIndex([
      { id: OVERRIDDEN_ID, title: "UNCHAIN、調達" },
      { id: UUID_B, title: "UNCHAIN、リリース" },
    ]);
    expect(index.get(OVERRIDDEN_ID)).toBe(OVERRIDDEN_SLUG);
    expect(index.get(UUID_B)).toBe("unchain"); // no longer collides
  });

  it("makes a derived slug step aside rather than shadow an override", () => {
    const index = buildSlugIndex([
      { id: OVERRIDDEN_ID, title: "UNCHAIN、調達" },
      // This article's title derives exactly onto the pinned slug.
      { id: UUID_B, title_en: "Pre Seed Round 35m JPY" },
    ]);
    expect(index.get(OVERRIDDEN_ID)).toBe(OVERRIDDEN_SLUG);
    expect(index.get(UUID_B)).toBe(`${OVERRIDDEN_SLUG}-${UUID_B.slice(0, 8)}`);
  });

  it("getArticleSlug reads through the index", () => {
    const a = { id: UUID_A, title: "UNCHAIN、プレシードラウンドで調達" };
    const b = { id: UUID_B, title: "UNCHAIN、資金調達を実施" };
    expect(getArticleSlug([a, b], a)).toBe(`unchain-${UUID_A.slice(0, 8)}`);
  });
});

describe("resolveArticleBySlug", () => {
  const articles = [
    { id: UUID_A, title: "組織型の可能性", title_en: "[Recap] AI World 2026 Summer Tokyo" },
    { id: UUID_B, title: "NEURON Update", title_en: null },
  ];

  it("resolves a derived slug", () => {
    expect(resolveArticleBySlug(articles, "recap-ai-world-2026-summer-tokyo")?.id).toBe(
      UUID_A
    );
  });

  it("keeps resolving bare ids so older links never break", () => {
    expect(resolveArticleBySlug(articles, UUID_B)?.id).toBe(UUID_B);
  });

  it("matches case-insensitively and tolerates percent-encoding", () => {
    expect(resolveArticleBySlug(articles, "NEURON-Update")?.id).toBe(UUID_B);
    expect(resolveArticleBySlug(articles, "neuron%2Dupdate")?.id).toBe(UUID_B);
  });

  it("resolves a pinned override", () => {
    const withOverride = [{ id: OVERRIDDEN_ID, title: "UNCHAIN、調達" }, ...articles];
    expect(resolveArticleBySlug(withOverride, OVERRIDDEN_SLUG)?.id).toBe(OVERRIDDEN_ID);
  });

  it("prefers an override over an article whose title derives the same slug", () => {
    const withOverride = [
      { id: UUID_A, title_en: "Pre Seed Round 35m JPY" },
      { id: OVERRIDDEN_ID, title: "UNCHAIN、調達" },
    ];
    expect(resolveArticleBySlug(withOverride, OVERRIDDEN_SLUG)?.id).toBe(OVERRIDDEN_ID);
  });

  it("returns null for an unknown slug or empty param", () => {
    expect(resolveArticleBySlug(articles, "does-not-exist")).toBeNull();
    expect(resolveArticleBySlug(articles, "")).toBeNull();
    expect(resolveArticleBySlug(articles, undefined)).toBeNull();
  });

  it("resolves disambiguated slugs to the right article", () => {
    const a = { id: UUID_A, title: "UNCHAIN、プレシードラウンドで調達" };
    const b = { id: UUID_B, title: "UNCHAIN、資金調達を実施" };
    const set = [a, b];
    expect(resolveArticleBySlug(set, `unchain-${UUID_A.slice(0, 8)}`)?.id).toBe(UUID_A);
    expect(resolveArticleBySlug(set, `unchain-${UUID_B.slice(0, 8)}`)?.id).toBe(UUID_B);
  });

  it("still resolves the undecorated base slug after a collision appears", () => {
    const a = { id: UUID_A, title: "UNCHAIN、プレシードラウンドで調達" };
    const b = { id: UUID_B, title: "UNCHAIN、資金調達を実施" };
    // A link minted as /news/unchain before `b` existed must not 404.
    expect(resolveArticleBySlug([a, b], "unchain")).not.toBeNull();
  });
});

describe("articlePath / articleUrl", () => {
  it("builds locale-aware paths", () => {
    expect(articlePath("blog", "latest-news")).toBe("/blog/latest-news");
    expect(articlePath("blog", "latest-news", "en")).toBe("/en/blog/latest-news");
    expect(articlePath("news", "latest-news", "en")).toBe("/en/news/latest-news");
  });

  it("builds absolute urls", () => {
    expect(articleUrl("blog", "latest-news", "en")).toBe(
      "https://the-unchain.com/en/blog/latest-news"
    );
  });
});

describe("isUuid", () => {
  it("recognises uuids", () => {
    expect(isUuid(UUID_A)).toBe(true);
    expect(isUuid("recap-ai-world")).toBe(false);
  });
});
