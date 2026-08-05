import { describe, expect, it } from "vitest";
import { pageItems } from "./pageItems";

describe("pageItems", () => {
  it("reproduces the shape the design draws for page 1 of 25", () => {
    expect(pageItems(1, 25)).toEqual([1, 2, null, 25]);
  });

  it("puts a gap on both sides once the reader is in the middle", () => {
    expect(pageItems(10, 25)).toEqual([1, null, 10, 11, null, 25]);
  });

  it("does not run past the last page", () => {
    expect(pageItems(25, 25)).toEqual([1, null, 25]);
    expect(pageItems(24, 25)).toEqual([1, null, 24, 25]);
  });

  it("never repeats a page or emits an ellipsis for a single missing number", () => {
    expect(pageItems(1, 3)).toEqual([1, 2, 3]);
    expect(pageItems(2, 3)).toEqual([1, 2, 3]);
    expect(pageItems(1, 1)).toEqual([1]);
    expect(pageItems(1, 2)).toEqual([1, 2]);
  });

  it("emits an ellipsis only where more than one page is hidden", () => {
    expect(pageItems(1, 4)).toEqual([1, 2, null, 4]);
    expect(pageItems(2, 4)).toEqual([1, 2, 3, 4]);
  });
});
