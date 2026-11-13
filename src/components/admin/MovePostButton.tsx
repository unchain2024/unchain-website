import { useState } from "react";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { movePost, otherKind, type PostKind } from "@/lib/adminPosts";

/**
 * Moves a post from news to blog or back. The post keeps its id, content, dates and
 * history, so its public URL stays the same — only the section it is filed under changes.
 */
interface MovePostButtonProps {
  id: string;
  kind: PostKind;
  lang: "ja" | "en";
  /** Runs before the move; return false to abort (e.g. a pending save failed). */
  beforeMove?: () => Promise<boolean>;
  onMoved: (to: PostKind) => void;
  className?: string;
}

const copy = {
  ja: {
    toBlog: "ブログに移動",
    toNews: "ニュースに移動",
    confirm: (to: string) => `この記事を${to}に移動しますか？URL・内容・日付・履歴はそのまま引き継がれます。`,
    done: (to: string) => `${to}に移動しました。`,
    failed: "移動に失敗しました。",
    blog: "ブログ",
    news: "ニュース",
  },
  en: {
    toBlog: "Move to Blog",
    toNews: "Move to News",
    confirm: (to: string) =>
      `Move this post to ${to}? Its URL, content, dates and history are kept.`,
    done: (to: string) => `Moved to ${to}.`,
    failed: "Failed to move the post.",
    blog: "Blog",
    news: "News",
  },
};

const MovePostButton = ({ id, kind, lang, beforeMove, onMoved, className }: MovePostButtonProps) => {
  const [moving, setMoving] = useState(false);
  const t = copy[lang];
  const to = otherKind(kind);
  const toLabel = t[to];

  const handleClick = async () => {
    if (!window.confirm(t.confirm(toLabel))) return;
    setMoving(true);
    try {
      if (beforeMove && !(await beforeMove())) return;
      await movePost(id, to);
      toast.success(t.done(toLabel));
      onMoved(to);
    } catch (error) {
      const message = (error as { message?: string } | null)?.message;
      toast.error(message ? `${t.failed} ${message}` : t.failed);
    } finally {
      setMoving(false);
    }
  };

  return (
    <button type="button" onClick={handleClick} disabled={moving} className={className}>
      {moving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRightLeft className="h-4 w-4" />}
      {kind === "news" ? t.toBlog : t.toNews}
    </button>
  );
};

export default MovePostButton;
