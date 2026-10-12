import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * The language lives in the URL as an `/en` prefix, so the same page has two paths.
 * This is what a location looks like with that prefix stripped: two locations with the
 * same bare path are the same page, and moving between them is a language switch,
 * not a page change.
 */
const barePath = (pathname: string) =>
  pathname.replace(/^\/en(?=\/|$)/, "") || "/";

/**
 * Remembered across mounts on purpose. The Japanese and English trees are separate
 * route elements, so switching language remounts this component, and a ref would
 * forget where the reader was.
 */
let lastBare: string | null = null;

/**
 * Scroll handling on navigation.
 *
 *   - A new page starts at the top, or at the section its hash names.
 *   - A language switch keeps the reader exactly where they were — the page is the
 *     same, only the words change.
 *   - A same-page hash jump is left to the browser.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const bare = barePath(pathname);
    const samePage = lastBare === bare;
    lastBare = bare;

    if (samePage) return;

    if (hash) {
      // The target is in the DOM once this effect runs; a frame later its layout is
      // settled enough to land on. `scroll-mt` on the section keeps it clear of the bar.
      const id = decodeURIComponent(hash.slice(1));
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
        } else {
          window.scrollTo(0, 0);
        }
      });
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
