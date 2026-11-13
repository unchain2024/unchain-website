import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { 
  Loader2, Edit3, Calendar, FileText, Trash2, ExternalLink, 
  EyeOff, Globe, Newspaper, LayoutTemplate, Plus, UserRound
} from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang } from "@/lib/language";
import { getCategoryColor } from "./NewsPage";
import MovePostButton from "@/components/admin/MovePostButton";
import { authorName, editPath as postEditPath, POST_TABLE } from "@/lib/adminPosts";

type ContentType = "news" | "blog";
type StatusFilter = "all" | "draft" | "published";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { lang } = useLang();
  
  const [activeTab, setActiveTab] = useState<ContentType>("news");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    fetchItems();
  }, [activeTab, navigate]);

  const fetchItems = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    // Every admin manages every post, not just their own.
    const { data, error } = await supabase
      .from(POST_TABLE[activeTab])
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data);
    } else if (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      toast.error(`Failed to fetch ${activeTab} items.`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    const typeLabel = activeTab === "news" ? "article" : "blog post";
    const isConfirmed = window.confirm(`Are you sure you want to delete this ${typeLabel}? This action cannot be undone.`);
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
          await supabase.storage.from("article-media").remove([filePath]);
        } catch (e) {
          console.error("Failed to delete media", e);
        }
      }

      // Cleanup additional media folder
      const { data: listData, error: listError } = await supabase.storage.from("article-media").list(id);
      if (!listError && listData && listData.length > 0) {
        const filesToRemove = listData
          .filter(file => file.name && file.name !== ".emptyFolderPlaceholder")
          .map(file => `${id}/${file.name}`);
        if (filesToRemove.length > 0) {
          await supabase.storage.from("article-media").remove(filesToRemove);
        }
      }

      const { data: deleted, error } = await supabase.from(POST_TABLE[activeTab]).delete().eq("id", id).select("id");
      if (error) throw error;
      if (!deleted || deleted.length === 0) throw new Error("You don't have permission to delete this post.");

      toast.success(`${activeTab === "news" ? "Article" : "Blog post"} deleted successfully.`);
      setItems(items.filter(a => a.id !== id));
    } catch (error: any) {
      toast.error(error.message || `Failed to delete ${typeLabel}.`);
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

  const getLocalizedTitle = (item: any) => {
    if (lang === "en" && item.title_en) return item.title_en;
    return item.title || item.title_en || "Untitled";
  };

  const drafts = items.filter(a => a.is_draft);
  const published = items.filter(a => !a.is_draft);

  const filteredItems = statusFilter === "draft"
    ? drafts
    : statusFilter === "published"
      ? published
      : items;

  const labels = {
    ja: {
      title: "管理ダッシュボード",
      desc: "コンテンツの作成、編集、管理をここで行えます。",
      news: "ニュース",
      blog: "ブログ",
      newBtn: activeTab === "news" ? "ニュースを作成" : "ブログを作成",
      all: "すべて",
      published: "公開中",
      drafts: "下書き",
    },
    en: {
      title: "Admin Dashboard",
      desc: "Create, edit, and manage your content from one place.",
      news: "News",
      blog: "Blog",
      newBtn: activeTab === "news" ? "New Article" : "New Blog Post",
      all: "All",
      published: "Published",
      drafts: "Drafts",
    }
  };

  const l = labels[lang as keyof typeof labels] || labels.en;

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
                <h1 className="heading-1 text-light-heading mb-4">{l.title}</h1>
                <p className="body text-light-body max-w-lg">{l.desc}</p>
              </div>
              <div className="flex gap-4">
                <Link to={activeTab === "news" ? "/publish" : "/publish-blog"} className="btn-primary">
                  <Plus size={18} /> {l.newBtn}
                </Link>
              </div>
            </div>

            {/* Content Type Tabs */}
            <div className="flex border-b border-border/50 mb-8 gap-8">
              <button
                onClick={() => { setActiveTab("news"); setStatusFilter("all"); }}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  activeTab === "news" 
                    ? "text-primary" 
                    : "text-light-body hover:text-light-heading"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Newspaper size={18} />
                  {l.news}
                </div>
                {activeTab === "news" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => { setActiveTab("blog"); setStatusFilter("all"); }}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  activeTab === "blog" 
                    ? "text-primary" 
                    : "text-light-body hover:text-light-heading"
                }`}
              >
                <div className="flex items-center gap-2">
                  <LayoutTemplate size={18} />
                  {l.blog}
                </div>
                {activeTab === "blog" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </div>

            {/* Status Filter Tabs */}
            {!loading && items.length > 0 && (
              <div className="flex gap-2 mb-8 bg-white border border-border/50 rounded-xl p-1.5 w-fit shadow-sm">
                {[
                  { id: "all", label: l.all, count: items.length },
                  { id: "published", label: l.published, count: published.length },
                  { id: "draft", label: l.drafts, count: drafts.length },
                ].map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => setStatusFilter(tab.id as StatusFilter)} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      statusFilter === tab.id 
                        ? "bg-primary text-white shadow-sm" 
                        : "text-light-body hover:text-light-heading hover:bg-secondary/50"
                    }`}
                  >
                    {tab.label} 
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      statusFilter === tab.id ? "bg-white/20 text-white" : "bg-secondary text-light-body"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white border border-border/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-sm relative">
                <FileText className="w-16 h-16 text-light-body/30 mb-6" />
                <h3 className="heading-2 text-light-heading mb-4">
                  {statusFilter === "draft" ? "No drafts yet" : statusFilter === "published" ? "No published items yet" : "No items yet"}
                </h3>
                <p className="body text-light-body mb-8 max-w-sm">
                  {statusFilter === "all" ? `There are no ${activeTab} posts yet.` : `No ${statusFilter} ${activeTab} found.`}
                </p>
                {statusFilter === "all" && (
                  <Link to={activeTab === "news" ? "/publish" : "/publish-blog"} className="btn-primary">
                    Create now
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, i) => {
                  const itemCats = item.category ? item.category.split(",").map((c: string) => c.trim()) : [];
                  const editPath = postEditPath(activeTab, item.id);
                  const author = authorName(item);
                  
                  return (
                    <ScrollReveal key={item.id} delay={i * 0.07}>
                      <div className="bg-white border border-border/50 rounded-2xl overflow-hidden flex flex-col shadow-sm group relative h-full hover:shadow-md transition-all duration-300">
                        <div className="w-full h-48 bg-secondary border-b border-border/50 relative overflow-hidden">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-12 h-12 text-light-body/20" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                            {item.is_draft ? (
                              <div className="bg-white/90 backdrop-blur-sm border border-border/50 px-3 py-1 font-semibold text-primary text-xs rounded-full shadow-sm uppercase tracking-wider">
                                Draft
                              </div>
                            ) : (
                              <div className="bg-emerald-50/90 backdrop-blur-sm border border-emerald-200 px-3 py-1 font-semibold text-emerald-700 text-xs rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
                                <Globe className="w-3 h-3" /> Published
                              </div>
                            )}
                            {item.is_hidden && (
                              <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 px-3 py-1 font-semibold text-white text-xs rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
                                <EyeOff className="w-3 h-3" /> Hidden
                              </div>
                            )}
                          </div>
                          {item.is_external && (
                            <div className="absolute top-4 right-4 bg-amber-50 border border-amber-200 px-3 py-1 font-semibold text-amber-700 text-xs rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
                              <ExternalLink className="w-3 h-3" /> External
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 text-xs text-light-body mb-4">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(item.created_at)}
                            {author && (
                              <>
                                <span aria-hidden="true">·</span>
                                <UserRound className="w-3.5 h-3.5" />
                                <span className="truncate">{author}</span>
                              </>
                            )}
                          </div>
                          {itemCats.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {itemCats.filter((cat: string) => cat.toLowerCase() !== "external").slice(0, 2).map((cat: string) => (
                                <span key={cat} className={`text-[10px] font-bold border rounded-full px-2 py-0.5 whitespace-nowrap uppercase ${getCategoryColor(cat)}`}>{cat}</span>
                              ))}
                            </div>
                          )}
                          <h3 className="heading-3 text-light-heading mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            {getLocalizedTitle(item)}
                          </h3>
                          <div className="mt-auto grid grid-cols-2 gap-3 pt-6 border-t border-border/50">
                            <Link to={editPath} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-light-heading font-medium transition-colors text-sm">
                              <Edit3 className="w-4 h-4" /> Edit
                            </Link>
                            <button 
                              onClick={() => handleDelete(item.id, item.image_url)} 
                              disabled={deletingId === item.id} 
                              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-colors text-sm disabled:opacity-50"
                            >
                              {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
                            </button>
                            <MovePostButton
                              id={item.id}
                              kind={activeTab}
                              lang={lang}
                              onMoved={() => setItems((prev) => prev.filter((a) => a.id !== item.id))}
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

export default AdminDashboardPage;
