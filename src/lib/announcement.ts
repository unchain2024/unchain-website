import { useSyncExternalStore } from "react";

/**
 * Visibility of the information banner.
 *
 * The banner is painted by the fixed header but occupies 40px at the very top of
 * the page in the design, so the hero reserves that space. Both need the same
 * answer, and it has to update the moment the banner is dismissed — hence a tiny
 * shared store rather than each component reading sessionStorage on its own.
 */
const KEY = "announcement-dismissed";
const listeners = new Set<() => void>();

let dismissed =
  typeof sessionStorage !== "undefined" && sessionStorage.getItem(KEY) === "true";

export const dismissAnnouncement = () => {
  if (dismissed) return;
  dismissed = true;
  try {
    sessionStorage.setItem(KEY, "true");
  } catch {
    /* private mode — visibility still updates for this session */
  }
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useAnnouncementVisible = () =>
  useSyncExternalStore(
    subscribe,
    () => !dismissed,
    () => true
  );
