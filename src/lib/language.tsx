import { createContext, useContext, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type Lang = "ja" | "en";

interface LanguageContextType {
  lang: Lang;
  /** Go to the current page in a specific language. */
  setLang: (next: Lang) => void;
  /** Swap to the other language. */
  toggleLang: () => void;
  localePath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ja",
  setLang: () => {},
  toggleLang: () => {},
  localePath: (p) => p,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const lang: Lang = location.pathname.startsWith("/en") ? "en" : "ja";

  const localePath = (path: string) => {
    if (lang === "en") {
      return path === "/" ? "/en" : `/en${path}`;
    }
    return path;
  };

  /**
   * Language lives in the URL, so switching means navigating to the same page
   * under (or out of) the `/en` prefix. Selecting the language already showing
   * is a no-op rather than a redundant navigation.
   */
  const setLang = (next: Lang) => {
    if (next === lang) return;

    const bare = location.pathname.replace(/^\/en(?=\/|$)/, "") || "/";
    const target = next === "en" ? (bare === "/" ? "/en" : `/en${bare}`) : bare;

    navigate(`${target}${location.search}${location.hash}`);
  };

  const toggleLang = () => setLang(lang === "en" ? "ja" : "en");

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, localePath }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
