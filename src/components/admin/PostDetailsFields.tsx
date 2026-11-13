import { CalendarClock, UserRound } from "lucide-react";

/**
 * Author and published-date fields for the news/blog editors.
 *
 * The published date is the row's `created_at`: it is what the site prints on the card
 * and article, and what the news list is sorted by.
 */
interface PostDetailsFieldsProps {
  lang: "ja" | "en";
  authorFirstName: string;
  authorLastName: string;
  publishedAt: string; // datetime-local value
  onAuthorFirstNameChange: (v: string) => void;
  onAuthorLastNameChange: (v: string) => void;
  onPublishedAtChange: (v: string) => void;
  /** Fill the author with the signed-in admin's name; hidden when not provided. */
  onUseMyName?: () => void;
}

const inputClass =
  "w-full bg-secondary/30 rounded-xl px-4 py-3 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-medium border border-transparent focus:border-border/30 placeholder-light-body/40";

const copy = {
  ja: {
    heading: "記事の詳細",
    date: "公開日時",
    dateHint: "サイト上に表示される日付です。一覧の並び順にも使われます。",
    author: "執筆者",
    first: "名",
    last: "姓",
    useMine: "自分の名前を使う",
  },
  en: {
    heading: "Post details",
    date: "Published date",
    dateHint: "Shown on the site and used to order the news list.",
    author: "Author",
    first: "First name",
    last: "Last name",
    useMine: "Use my name",
  },
};

const PostDetailsFields = ({
  lang,
  authorFirstName,
  authorLastName,
  publishedAt,
  onAuthorFirstNameChange,
  onAuthorLastNameChange,
  onPublishedAtChange,
  onUseMyName,
}: PostDetailsFieldsProps) => {
  const t = copy[lang];

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-light-heading ml-1">{t.heading}</label>
      <div className="grid gap-6 rounded-xl border border-border/50 p-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="post-published-at" className="flex items-center gap-2 text-xs font-semibold text-light-heading ml-1">
            <CalendarClock className="h-4 w-4 text-primary" /> {t.date}
          </label>
          <input
            id="post-published-at"
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => onPublishedAtChange(e.target.value)}
            className={inputClass}
          />
          <p className="text-xs text-light-body ml-1">{t.dateHint}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-xs font-semibold text-light-heading ml-1">
              <UserRound className="h-4 w-4 text-primary" /> {t.author}
            </span>
            {onUseMyName && (
              <button type="button" onClick={onUseMyName} className="text-xs font-medium text-primary hover:underline">
                {t.useMine}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              aria-label={t.first}
              placeholder={t.first}
              value={authorFirstName}
              onChange={(e) => onAuthorFirstNameChange(e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              aria-label={t.last}
              placeholder={t.last}
              value={authorLastName}
              onChange={(e) => onAuthorLastNameChange(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsFields;
