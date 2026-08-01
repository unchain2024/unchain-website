import { Link } from "react-router-dom";
import { useLang } from "@/lib/language";
import {
  dismissAnnouncement,
  useAnnouncementVisible,
} from "@/lib/announcement";
import { banner } from "@/components/home/content";
import { ArrowRight, Close } from "@/components/home/icons";

/**
 * Information banner — `public/home/Information banner.svg`.
 * 1440x40, solid black, centred message + trailing arrow, dismiss at the right.
 */
const AnnouncementBar = () => {
  const { lang, localePath } = useLang();
  const t = banner[lang];
  const visible = useAnnouncementVisible();

  if (!visible) return null;

  const dismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dismissAnnouncement();
  };

  return (
    <div className="relative h-10 bg-black">
      <Link
        to={localePath(t.href)}
        className="flex h-full items-center justify-center gap-4 pl-6 pr-14 transition-opacity hover:opacity-80 sm:pl-14"
      >
        <span className="truncate text-[12px] leading-none text-white sm:text-[14px]">
          {t.message}
        </span>
        <ArrowRight className="hidden shrink-0 text-hd-banner sm:block" />
      </Link>
      <button
        onClick={dismiss}
        aria-label={t.dismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-hd-banner transition-colors hover:text-white sm:right-8"
      >
        <Close />
      </button>
    </div>
  );
};

export default AnnouncementBar;
