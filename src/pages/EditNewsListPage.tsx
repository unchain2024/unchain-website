import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2, Edit3, Calendar, FileText, Trash2, ExternalLink, EyeOff, Globe, UserRound } from "lucide-react";
import MovePostButton from "@/components/admin/MovePostButton";
import { authorName } from "@/lib/adminPosts";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { getCategoryColor } from "./NewsPage";

type StatusFilter = "all" | "draft" | "published";

const EditNewsListPage = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    fetchMyArticles();
  }, [navigate]);

  const fetchMyArticles = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    // Every admin manages every post, not just their own.
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setArticles(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this article? This action cannot be undone.");
    if (!isConfirmed) return;

    setDeletingId(id);

    try {
      if (imageUrl) {
        try {
          const parsedUrl = new URL(imageUrl);
          const pathSegments = parsedUrl.pathname.split("/");
          const fileName = decodeURIComponent(pathSegments[pathSegments.length - 1]);
          const userId = decodeURIComponent(pathSegments[pathSegments.length - 2]);
          const filePath = `${userId}/${fileName}`;
          const { error: storageError } = await supabase.storage.from("article-media").remove([filePath]);
          if (storageError) console.error("Storage deletion error: ", storageError);
        } catch (e) {
          console.error("Failed to delete media, continuing to delete article row.", e);
        }
      }

      try {
        const { data: listData, error: listError } = await supabase.storage.from("article-media").list(id);
        if (!listError && listData && listData.length > 0) {
          const filesToRemove = listData
            .filter(file => file.name && file.name !== ".emptyFolderPlaceholder")
            .map(file => `${id}/${file.name}`);
          if (filesToRemove.length > 0) {
            const { error: batchRemoveError } = await supabase.storage.from("article-media").remove(filesToRemove);
            if (batchRemoveError) console.error("Batch folder deletion error: ", batchRemoveError);
          }
        }
      } catch (e) {
        console.error("Failed to delete article folder media", e);
      }

      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;

      toast.success("Article deleted successfully.");
      setArticles(articles.filter(a => a.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete article.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getLocalizedTitle = (article: any) => {
    if (lang === "en" && article.title_en) return article.title_en;
    return article.title || article.title_en || "Untitled Article";
  };

  const drafts = articles.filter(a => a.is_draft);
  const published = articles.filter(a => !a.is_draft);

  const filteredArticles = statusFilter === "draft"
    ? drafts
    : statusFilter === "published"
      ? published
      : articles;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const filterTabs: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: articles.length },
    { id: "published", label: "Published", count: published.length },
    { id: "draft", label: "Drafts", count: drafts.length },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navigation />

      <section data-nav-theme="light" className="bg-secondary pt-32 pb-24 px-6 md:px-12 flex-grow relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* amount 0: a long form can never be 30% on screen, and would stay hidden */}
          <ScrollReveal amount={0}>
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
              <div>
                <span className="label text-light-label mb-3 block">Admin Portal</span>
                <h1 className="heading-1 text-light-heading mb-4">Manage News</h1>
                <p className="body text-light-body max-w-lg">
                  Edit, hide, move, or delete any article or draft. Keep your content up to date.
                </p>
              </div>

              <div className="flex gap-4">
                <Link to="/publish" className="btn-primary">
                  <FileText size={18} /> New Article
                </Link>
              </div>
            </div>

            {/* Filter Tabs */}
            {articles.length > 0 && (
              <div className="flex gap-2 mb-8 bg-white border border-border/50 rounded-xl p-1.5 w-fit shadow-sm">
                {filterTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      statusFilter === tab.id
                        ? "bg-primary text-white shadow-sm"
                        : "text-light-body hover:text-light-heading hover:bg-secondary/50"
                    }`}
                  >
                    {tab.label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      statusFilter === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-secondary text-light-body"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {filteredArticles.length === 0 ? (
              <div className="bg-white border border-border/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm relative">
                <FileText className="w-16 h-16 text-light-body/30 mb-6" />
                <h3 className="heading-2 text-light-heading mb-4">
                  {statusFilter === "draft" ? "No drafts yet" : statusFilter === "published" ? "No published articles yet" : "No articles yet"}
                </h3>
                <p className="body text-light-body mb-8 max-w-sm">
                  {statusFilter === "all" ? "You haven't published any news yet. Start writing your first update today!" : `No ${statusFilter} articles found.`}
                </p>
                {statusFilter === "all" && (
                  <Link to="/publish" className="btn-primary">Write now</Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article, i) => {
                  const articleCats = article.category ? article.category.split(",").map((c: string) => c.trim()) : [];
                  
                  return (
                    <ScrollReveal key={article.id} delay={i * 0.07}>
                      <div className="bg-white border border-border/50 rounded-2xl overflow-hidden flex flex-col shadow-sm group relative h-full hover:shadow-md transition-all duration-300">
                        
                        <div className="w-full h-48 bg-secondary border-b border-border/50 relative overflow-hidden">
                          {article.image_url ? (
                            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-12 h-12 text-light-body/20" />
                            </div>
                          )}

                          {/* Status badges */}
                          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                            {article.is_draft ? (
                              <div className="bg-white/90 backdrop-blur-sm border border-border/50 px-3 py-1 font-semibold text-primary text-xs rounded-full shadow-sm uppercase tracking-wider">
                                Draft
                              </div>
                            ) : (
                              <div className="bg-emerald-50/90 backdrop-blur-sm border border-emerald-200 px-3 py-1 font-semibold text-emerald-700 text-xs rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
                                <Globe className="w-3 h-3" /> Published
                              </div>
                            )}
                            {article.is_hidden && (
                              <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 px-3 py-1 font-semibold text-white text-xs rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
                                <EyeOff className="w-3 h-3" /> Hidden
                              </div>
                            )}
                          </div>

                          {article.is_external && (
                            <div className="absolute top-4 right-4 bg-amber-50 border border-amber-200 px-3 py-1 font-semibold text-amber-700 text-xs rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" /> External
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 text-xs text-light-body mb-4">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(article.created_at)}
                            {authorName(article) && (
                              <>
                                <span aria-hidden="true">·</span>
                                <UserRound className="w-3.5 h-3.5" />
                                <span className="truncate">{authorName(article)}</span>
                              </>
                            )}
                          </div>

                          {articleCats.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {articleCats
                                .filter((cat: string) => cat.toLowerCase() !== "external")
                                .slice(0, 2)
                                .map((cat: string) => (
                                <span key={cat} className={`text-[10px] font-bold border rounded-full px-2 py-0.5 whitespace-nowrap uppercase ${getCategoryColor(cat)}`}>
                                  {cat}
                                </span>
                              ))}
                              {articleCats.filter((cat: string) => cat.toLowerCase() !== "external").length > 2 && (
                                <span className="text-[10px] font-bold border rounded-full px-2 py-0.5 whitespace-nowrap uppercase bg-secondary text-light-body border-border/50">
                                  +{articleCats.filter((cat: string) => cat.toLowerCase() !== "external").length - 2}
                                </span>
                              )}
                            </div>
                          )}

                          <h3 className="heading-3 text-light-heading mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            {getLocalizedTitle(article)}
                          </h3>

                          <div className="mt-auto grid grid-cols-2 gap-3 pt-6 border-t border-border/50">
                            <Link 
                              to={`/edit/${article.id}`} 
                              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-light-heading font-medium transition-colors text-sm"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </Link>
                            
                            <button 
                              onClick={() => handleDelete(article.id, article.image_url)}
                              disabled={deletingId === article.id}
                              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-colors text-sm disabled:opacity-50"
                            >
                              {deletingId === article.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              Delete
                            </button>
                            <MovePostButton
                              id={article.id}
                              kind="news"
                              lang={lang}
                              onMoved={() => setArticles((prev) => prev.filter((a) => a.id !== article.id))}
                              className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/50 hover:bg-secondary text-light-heading font-medium transition-colors text-sm disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EditNewsListPage;
