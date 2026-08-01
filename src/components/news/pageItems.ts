/**
 * The page numbers the pager shows, with `null` standing in for an ellipsis circle.
 *
 * The design draws page 1 of 25 as `< 1 2 … 25 >` — the current page, the one after it,
 * a gap, and the last — so that is the shape this reproduces, widening to
 * `1 … n n+1 … last` once the reader is somewhere in the middle.
 */
export const pageItems = (current: number, total: number): (number | null)[] => {
  const pages: number[] = [];
  const push = (p: number) => {
    if (p >= 1 && p <= total && !pages.includes(p)) pages.push(p);
  };
  push(1);
  push(current);
  push(current + 1);
  push(total);
  pages.sort((a, b) => a - b);

  const out: (number | null)[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
};
