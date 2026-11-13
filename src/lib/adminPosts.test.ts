import { describe, expect, it, vi } from "vitest";

// The real client needs Supabase credentials from the environment; these helpers don't.
vi.mock("@/lib/supabase", () => ({ supabase: {} }));

import { authorName, editPath, fromDateTimeInput, otherKind, toDateTimeInput } from "./adminPosts";

describe("date input round trip", () => {
  it("turns an ISO timestamp into a local datetime-local value and back", () => {
    const iso = new Date(2026, 4, 20, 12, 30).toISOString();
    const input = toDateTimeInput(iso);
    expect(input).toBe("2026-05-20T12:30");
    expect(fromDateTimeInput(input)).toBe(iso);
  });

  it("treats empty or invalid values as missing", () => {
    expect(toDateTimeInput(null)).toBe("");
    expect(toDateTimeInput("not a date")).toBe("");
    expect(fromDateTimeInput("")).toBeNull();
    expect(fromDateTimeInput("2026-13-45T99:99")).toBeNull();
  });
});

describe("post helpers", () => {
  it("routes each kind to its editor", () => {
    expect(editPath("news", "abc")).toBe("/edit/abc");
    expect(editPath("blog", "abc")).toBe("/edit-blog/abc");
    expect(otherKind("news")).toBe("blog");
    expect(otherKind("blog")).toBe("news");
  });

  it("joins author names, skipping blanks", () => {
    expect(authorName({ author_first_name: "Aiko", author_last_name: "Sato" })).toBe("Aiko Sato");
    expect(authorName({ author_first_name: "Aiko", author_last_name: null })).toBe("Aiko");
    expect(authorName({})).toBe("");
  });
});
