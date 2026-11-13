import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Loader2, FileImage, X, FileText, ArrowLeft, Eye, EyeOff, CheckCircle2, Plus,
  History, Code2, LayoutTemplate, ExternalLink, Upload, Copy, Check,
  Download, Newspaper
} from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ArticlePreviewModal from "@/components/ArticlePreviewModal";
import ArticleHistoryModal from "@/components/ArticleHistoryModal";
import ArticleDiffModal from "@/components/ArticleDiffModal";
import PressReleaseForm from "@/components/PressReleaseForm";
import { EMPTY_PRESS_RELEASE, parsePressRelease } from "@/components/PressReleaseRenderer";
import type { PressReleaseData } from "@/components/PressReleaseRenderer";
import { getCategoryColor } from "./NewsPage";
import { useLang } from "@/lib/language";
import PostDetailsFields from "@/components/admin/PostDetailsFields";
import MovePostButton from "@/components/admin/MovePostButton";
import { editPath, fromDateTimeInput, toDateTimeInput } from "@/lib/adminPosts";

type ContentMode = "standard" | "custom_html" | "external" | "press_release";

interface ArticleVersion {
  id: string;
  article_id: string;
  saved_at: string;
  saved_by: string;
  snapshot: Record<string, any>;
}

const EditBlogPage = () => {
  const { lang } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // The signed-in admin's own name (for "Use my name").
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // The post's author and published date — editable, and shown on the site.
  const [authorFirstName, setAuthorFirstName] = useState("");
  const [authorLastName, setAuthorLastName] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  // created_at is only written when the date field actually changes, so an untouched
  // post keeps its exact timestamp (the input has minute precision).
  const loadedPublishedAt = useRef("");

  const [contentMode, setContentMode] = useState<ContentMode>("standard");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [contentEn, setContentEn] = useState("");

  // Custom HTML
  const [customHtml, setCustomHtml] = useState("");
  const [customHtmlEn, setCustomHtmlEn] = useState("");
  const [additionalMedia, setAdditionalMedia] = useState<{ url: string; type: string }[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Press Release
  const [pressReleaseData, setPressReleaseData] = useState<PressReleaseData>(EMPTY_PRESS_RELEASE);
  const [pressReleaseDataEn, setPressReleaseDataEn] = useState<PressReleaseData>(EMPTY_PRESS_RELEASE);

  // Standard media
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // External
  const [externalUrl, setExternalUrl] = useState("");
  const [fetchingMeta, setFetchingMeta] = useState(false);

  const [activeTab, setActiveTab] = useState<"ja" | "en">("ja");
  const [showPreview, setShowPreview] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [externalLanguage, setExternalLanguage] = useState<"ja" | "en">("ja");

  // Version history
  const [showHistory, setShowHistory] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [diffVersionA, setDiffVersionA] = useState<ArticleVersion | null>(null);
  const [diffVersionB, setDiffVersionB] = useState<ArticleVersion | null>(null);

  const additionalMediaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchArticleAndUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setFirstName(profile.first_name);
        setLastName(profile.last_name);
      } else {
        const emailPrefix = session.user.email?.split("@")[0] || "Admin";
        setFirstName(emailPrefix);
        setLastName("");
      }

      const { data: allBlogs } = await supabase.from("blogs").select("category");
      const cats = new Set<string>(["external"]);
      if (allBlogs) {
        allBlogs.forEach((a) => {
          if (a.category) {
            a.category.split(",").forEach((c: string) => cats.add(c.trim()));
          }
        });
      }
      setAvailableCategories(Array.from(cats).sort());

      const { data: article, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !article) {
        toast.error("Article not found or access denied.");
        navigate("/admin");
        return;
      }

      setAuthorFirstName(article.author_first_name || "");
      setAuthorLastName(article.author_last_name || "");
      const loadedDate = toDateTimeInput(article.created_at);
      loadedPublishedAt.current = loadedDate;
      setPublishedAt(loadedDate);

      if (article.category) {
        setSelectedCategories(article.category.split(",").map((c: string) => c.trim()).filter(Boolean));
      }

      setTitle(article.title || "");
      setDescription(article.description || "");
      setContent(article.content || "");
      setTitleEn(article.title_en || "");
      setDescriptionEn(article.description_en || "");
      setContentEn(article.content_en || "");

      if (article.is_external) {
        setContentMode("external");
        setExternalUrl(article.external_url || "");
        setExternalLanguage(article.title_en && !article.title ? "en" : "ja");
      } else if (article.content_type === "press_release") {
        setContentMode("press_release");
        const parsed = parsePressRelease(article.content || "");
        if (parsed) setPressReleaseData(parsed);
        const parsedEn = parsePressRelease(article.content_en || "");
        if (parsedEn) setPressReleaseDataEn(parsedEn);
      } else if (article.content_type === "custom_html") {
        setContentMode("custom_html");
        setCustomHtml(article.custom_html || "");
        setCustomHtmlEn(article.custom_html_en || "");
        setAdditionalMedia(article.additional_media || []);
      } else {
        setContentMode("standard");
      }

      setExistingImageUrl(article.image_url || "");
      setOriginalImageUrl(article.image_url || "");
      setIsDraft(article.is_draft || false);
      setIsHidden(article.is_hidden || false);

      setLoading(false);
    };
    fetchArticleAndUser();
  }, [id, navigate]);

  const prevModeRef = React.useRef<ContentMode | null>(null);
  useEffect(() => {
    if (prevModeRef.current === null) {
      prevModeRef.current = contentMode;
      return;
    }
    if (contentMode === "external") {
      setSelectedCategories((prev) => prev.includes("external") ? prev : [...prev, "external"]);
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== "external"));
    }
    prevModeRef.current = contentMode;
  }, [contentMode]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submitting && isAutoSaving) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [submitting, isAutoSaving]);

  useEffect(() => {
    if (loading) return;
    if (!title && !titleEn && contentMode !== "external") return;
    const delayDebounceFn = setTimeout(() => {
      if (!submitting) performSave(false);
    }, 2500);
    return () => clearTimeout(delayDebounceFn);
  }, [title, description, content, selectedCategories, titleEn, descriptionEn, contentEn, mediaFile, existingImageUrl, loading, customHtml, customHtmlEn, externalUrl, authorFirstName, authorLastName, publishedAt]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMediaFile(e.target.files[0]);
      setExistingImageUrl("");
      setUploadedImageUrl(null);
    }
  };

  const clearFile = () => {
    setMediaFile(null);
    setExistingImageUrl("");
    setUploadedImageUrl(null);
  };

  const handleAdditionalMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    setUploadingMedia(true);
    const files = Array.from(e.target.files);
    const results: { url: string; type: string }[] = [];
    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${id}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("article-media").upload(filePath, file);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("article-media").getPublicUrl(filePath);
        results.push({ url: urlData.publicUrl, type: file.type });
      }
    }
    setAdditionalMedia((prev) => [...prev, ...results]);
    setUploadingMedia(false);
    if (additionalMediaRef.current) additionalMediaRef.current.value = "";
  };

  const removeAdditionalMedia = (idx: number) => setAdditionalMedia((prev) => prev.filter((_, i) => i !== idx));
  const copyToClipboard = async (url: string) => { await navigator.clipboard.writeText(url); setCopiedUrl(url); setTimeout(() => setCopiedUrl(null), 1500); };

  const fetchExternalMeta = async () => {
    if (!externalUrl) return;
    setFetchingMeta(true);
    try {
      const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(externalUrl)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.status === "success" && data.data) {
        const ogTitle = data.data.title || "";
        const ogDesc = data.data.description || "";
        const ogDate = data.data.date || null;
        if (externalLanguage === "ja") {
          if (ogTitle) setTitle(ogTitle);
          if (ogDesc) setDescription(ogDesc);
        } else {
          if (ogTitle) setTitleEn(ogTitle);
          if (ogDesc) setDescriptionEn(ogDesc);
        }
        if (ogDate) {
          const parsedDate = toDateTimeInput(ogDate);
          if (parsedDate) setPublishedAt(parsedDate);
        }
        toast.success("Metadata fetched successfully!");
      } else { throw new Error("Failed to parse metadata"); }
    } catch { toast.error("Could not fetch metadata. Please fill in manually."); } finally { setFetchingMeta(false); }
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (trimmed && !selectedCategories.includes(trimmed)) {
      setSelectedCategories([...selectedCategories, trimmed]);
      if (!availableCategories.includes(trimmed)) setAvailableCategories([...availableCategories, trimmed].sort());
    }
    setNewCategoryInput("");
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    else setSelectedCategories([...selectedCategories, cat]);
  };

  const removeCategory = (cat: string) => setSelectedCategories(selectedCategories.filter((c) => c !== cat));

  const saveVersion = async () => {
    if (!user || !id) return;
    const snapshot = {
      category: selectedCategories.join(", "),
      title, description, content, title_en: titleEn, description_en: descriptionEn, content_en: contentEn,
      content_type: contentMode === "custom_html" ? "custom_html" : "standard",
      custom_html: customHtml, custom_html_en: customHtmlEn,
      is_external: contentMode === "external", external_url: externalUrl,
    };
    await supabase.from("blog_versions").insert([{ article_id: id, saved_by: user.id, snapshot }]);
  };

  const toggleVisibility = async () => {
    if (!user || !id) return;
    const newValue = !isHidden;
    const { error } = await supabase.from("blogs").update({ is_hidden: newValue }).eq("id", id);
    if (error) toast.error(lang === "ja" ? "表示設定の変更に失敗しました。" : "Failed to update visibility.");
    else {
      setIsHidden(newValue);
      toast.success(newValue ? (lang === "ja" ? "ブログから非表示にしました。" : "Post hidden.") : (lang === "ja" ? "ブログに表示しました。" : "Post is now visible."));
    }
  };

  const handlePRImagesChange = (sectionIdx: number, urls: string[]) => {
    setPressReleaseData(prev => ({ ...prev, sections: prev.sections.map((s, i) => i === sectionIdx ? { ...s, imageUrls: urls, imageUrl: urls[0] || "" } : s) }));
    setPressReleaseDataEn(prev => ({ ...prev, sections: prev.sections.map((s, i) => i === sectionIdx ? { ...s, imageUrls: urls, imageUrl: urls[0] || "" } : s) }));
  };

  const performSave = async (isExplicitPublish: boolean) => {
    if (!user) return false;
    if (isExplicitPublish && contentMode !== "external" && !title && !titleEn) { toast.error(activeTab === "ja" ? "タイトルを入力してください。" : "Title required."); return false; }
    if (isExplicitPublish && contentMode === "external") {
      if (!externalUrl) { toast.error("Please enter URL."); return false; }
      if (externalLanguage === "ja" && !title) { toast.error("タイトルを入力してください。"); return false; }
      if (externalLanguage === "en" && !titleEn) { toast.error("Please provide title."); return false; }
    }
    if (isExplicitPublish) setSubmitting(true); else setIsAutoSaving(true);
    let mediaUrl = existingImageUrl;
    if (uploadedImageUrl) mediaUrl = uploadedImageUrl;
    try {
      if (mediaFile && !uploadedImageUrl) {
        const fileExt = mediaFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from("article-media").upload(filePath, mediaFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("article-media").getPublicUrl(filePath);
        mediaUrl = urlData.publicUrl;
        setUploadedImageUrl(mediaUrl);
      }

      // Ensure categories are clean
      const finalCategories = [...selectedCategories];

      const finalTitle = contentMode === "external" ? (externalLanguage === "ja" ? title : "") : title;
      const finalDesc = contentMode === "external" ? (externalLanguage === "ja" ? description : "") : description;
      const finalTitleEn = contentMode === "external" ? (externalLanguage === "en" ? titleEn : "") : titleEn;
      const finalDescEn = contentMode === "external" ? (externalLanguage === "en" ? descriptionEn : "") : descriptionEn;

      const payload: Record<string, any> = {
        category: finalCategories.join(", "),
        title: finalTitle, description: finalDesc,
        content: contentMode === "external" ? "" : contentMode === "press_release" ? JSON.stringify(pressReleaseData) : content,
        title_en: finalTitleEn, description_en: finalDescEn,
        content_en: contentMode === "external" ? "" : contentMode === "press_release" ? JSON.stringify(pressReleaseDataEn) : contentEn,
        // The cover image is also the card thumbnail, so every post type can have one.
        image_url: mediaUrl || null,
        author_first_name: authorFirstName.trim(),
        author_last_name: authorLastName.trim(),
        is_draft: !isExplicitPublish ? isDraft : false,
        content_type: contentMode === "custom_html" ? "custom_html" : contentMode === "press_release" ? "press_release" : "standard",
        custom_html: contentMode === "custom_html" ? customHtml : null,
        custom_html_en: contentMode === "custom_html" ? customHtmlEn : null,
        additional_media: contentMode === "custom_html" ? additionalMedia : [],
        is_external: contentMode === "external",
        external_url: contentMode === "external" ? externalUrl : null,
      };
      if (publishedAt !== loadedPublishedAt.current) {
        const iso = fromDateTimeInput(publishedAt);
        if (iso) payload.created_at = iso;
      }
      if (isExplicitPublish) await saveVersion();
      const { data: updatedRows, error: updateError } = await supabase.from("blogs").update(payload).eq("id", id).select("id");
      if (updateError) throw updateError;
      if (!updatedRows || updatedRows.length === 0) {
        throw new Error(lang === "ja" ? "このブログ記事を更新する権限がありません。" : "You don't have permission to update this blog post.");
      }
      if (payload.created_at) loadedPublishedAt.current = publishedAt;
      if (isExplicitPublish && originalImageUrl && originalImageUrl !== mediaUrl) {
        try {
          const parsedUrl = new URL(originalImageUrl);
          const pathSegments = parsedUrl.pathname.split("/");
          const oldFileName = decodeURIComponent(pathSegments[pathSegments.length - 1]);
          const oldUserId = decodeURIComponent(pathSegments[pathSegments.length - 2]);
          await supabase.storage.from("article-media").remove([`${oldUserId}/${oldFileName}`]);
        } catch (e) { console.error("Failed to delete old media", e); }
      }
      setLastSavedAt(new Date());
      if (isExplicitPublish) { toast.success(activeTab === "ja" ? "ブログ記事を更新しました！" : "Blog updated!"); navigate("/admin"); }
      return true;
    } catch (error: any) { if (isExplicitPublish) toast.error(error.message || "Failed to update blog."); return false; } finally { if (isExplicitPublish) setSubmitting(false); else setIsAutoSaving(false); }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); performSave(true); };

  const getPreviewArticle = () => {
    let previewUrl = existingImageUrl;
    if (mediaFile) previewUrl = URL.createObjectURL(mediaFile);
    if (!mediaFile && uploadedImageUrl) previewUrl = uploadedImageUrl;
    return {
      title: contentMode === "external" ? (externalLanguage === "ja" ? title : titleEn || title) : (activeTab === "ja" ? title : titleEn || title),
      description: contentMode === "external" ? (externalLanguage === "ja" ? description : descriptionEn || description) : (activeTab === "ja" ? description : descriptionEn || description),
      content: contentMode === "press_release" ? JSON.stringify(activeTab === "ja" ? pressReleaseData : pressReleaseDataEn) : (activeTab === "ja" ? content : contentEn || content),
      category: selectedCategories.join(", "), image_url: previewUrl, author_first_name: authorFirstName, author_last_name: authorLastName,
      content_type: contentMode === "press_release" ? "press_release" : contentMode === "custom_html" ? "custom_html" : "standard",
      custom_html: activeTab === "ja" ? customHtml : customHtmlEn || customHtml,
    };
  };

  const handleCompare = (vA: ArticleVersion, vB: ArticleVersion) => { setDiffVersionA(vA); setDiffVersionB(vB); setShowHistory(false); setShowDiff(true); };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const labels = {
    ja: { back: "ブログリストに戻る", pubHeaderLabel: isDraft ? "下書き" : "公開済みブログ", pubHeaderTitle: "ブログを編集する", pubHeaderDesc: "記事を修正または下書きを洗練させて公開しましょう。", saving: "保存中...", savedAt: isDraft ? "下書き保存完了" : "変更を保存完了", previewBtn: "プレビュー", historyBtn: "変更履歴", publishBtn: "変更を公開", categoryHead: "カテゴリ（複数選択可）", categoryPlaceholder: "新しいカテゴリを入力...", suggestedCats: "既存のカテゴリから選択:", titleLabel: "タイトル (必須)", titlePlaceholder: "ブログのタイトル", descLabel: "概要 / 簡単な説明", descPlaceholder: "概要や短い説明...", contentLabel: "本文", contentPlaceholder: "ブログの本文をここに書きます...", mediaLabel: "ヘッダーメディア（画像・動画）", dragDrop: "ファイルをドロップするか", clickBrowse: "クリックして選択", mediaDesc: "JPEG、PNG、または50MB以下の動画", currentMedia: "現在添付されているメディア", additionalMediaLabel: "追加メディア（複数アップロード可）", uploadedUrls: "アップロード済みURL（HTMLに貼り付けて使用）", externalUrlLabel: "外部ブログのURL", externalUrlPlaceholder: "https://medium.com/...", fetchMetaBtn: "メタ情報を取得", externalNote: "この記事は外部サイトへのリンクとして表示されます。", customHtmlLabel: "カスタム HTML", customHtmlPlaceholder: "ここにHTMLを記述します..." },
    en: { back: "Back to Blog List", pubHeaderLabel: isDraft ? "Draft" : "Published Blog", pubHeaderTitle: "Edit Blog Post", pubHeaderDesc: "Update your post or refine your draft.", saving: "Saving...", savedAt: (isDraft ? "Draft" : "Changes") + " saved at", previewBtn: "Preview", historyBtn: "History", publishBtn: "Publish Changes", categoryHead: "Categories (Select multiple)", categoryPlaceholder: "Type new category...", suggestedCats: "Suggested:", titleLabel: "Title (Required)", titlePlaceholder: "Blog Title", descLabel: "Description / Summary", descPlaceholder: "Short description or summary...", contentLabel: "Full Story / Content", contentPlaceholder: "Write the full story here...", mediaLabel: "Header Media (Image/Video)", dragDrop: "Drop a file here or", clickBrowse: "click to browse", mediaDesc: "Images (JPG, PNG) or Videos up to 50MB", currentMedia: "Current Media attached", additionalMediaLabel: "Additional Media (Multiple uploads)", uploadedUrls: "Uploaded URLs (paste into your HTML)", externalUrlLabel: "External Blog URL", externalUrlPlaceholder: "https://medium.com/...", fetchMetaBtn: "Fetch Metadata", externalNote: "This post will appear as an external link.", customHtmlLabel: "Custom HTML", customHtmlPlaceholder: "Write your HTML here..." },
  };

  const l = labels[lang];
  const modeOptions: { value: ContentMode; label: string; icon: React.ReactNode }[] = [
    { value: "standard", icon: <LayoutTemplate className="w-4 h-4" />, label: lang === "ja" ? "標準" : "Standard" },
    { value: "press_release", icon: <Newspaper className="w-4 h-4" />, label: lang === "ja" ? "プレスリリース" : "Press Release" },
    { value: "custom_html", icon: <Code2 className="w-4 h-4" />, label: lang === "ja" ? "カスタム HTML" : "Custom HTML" },
    { value: "external", icon: <ExternalLink className="w-4 h-4" />, label: lang === "ja" ? "外部リンク" : "External Link" },
  ];

  const activeLabelLang = contentMode === "external" ? externalLanguage : activeTab;
  const lActive = labels[activeLabelLang] || l;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navigation />
      <section data-nav-theme="light" className="bg-secondary pt-32 pb-24 px-6 md:px-12 flex-grow relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* amount 0: a long form can never be 30% on screen, and would stay hidden */}
          <ScrollReveal amount={0}>
            <button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-light-body hover:text-primary mb-8 text-sm font-medium transition-all group"><ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {l.back}</button>
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
              <div>
                <span className="label text-light-label mb-3 block">{l.pubHeaderLabel}</span>
                <h1 className="heading-1 text-light-heading mb-4">{l.pubHeaderTitle}</h1>
                <div className="flex items-center flex-wrap gap-3">
                  <p className="body text-light-body max-w-lg">{l.pubHeaderDesc}</p>
                  {isAutoSaving && <span className="flex items-center gap-1 text-xs text-light-body/60 bg-white/50 px-2 py-1 rounded-full whitespace-nowrap"><Loader2 className="w-3 h-3 animate-spin" /> {l.saving}</span>}
                  {lastSavedAt && !isAutoSaving && <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 whitespace-nowrap"><CheckCircle2 className="w-3 h-3" /> {l.savedAt} {lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
                </div>
              </div>
              <div className="flex gap-3 flex-wrap justify-end">
                <MovePostButton id={id || ""} kind="blog" lang={lang} beforeMove={() => performSave(false)} onMoved={(to) => navigate(editPath(to, id || ""), { replace: true })} className="btn-outline border-border/50 hover:bg-secondary py-3 px-5 h-auto whitespace-nowrap disabled:opacity-50" />
                <button type="button" onClick={() => setShowHistory(true)} className="btn-outline border-border/50 hover:bg-secondary py-3 px-5 h-auto whitespace-nowrap"><History size={16} /> {l.historyBtn}</button>
                {contentMode !== "external" && <button type="button" onClick={() => setShowPreview(true)} className="btn-outline border-border/50 hover:bg-secondary py-3 px-5 h-auto whitespace-nowrap"><Eye size={16} /> {l.previewBtn}</button>}
                {!isDraft && <button type="button" onClick={toggleVisibility} className={`flex items-center gap-2 py-3 px-5 h-auto rounded-xl border text-sm font-semibold transition-all whitespace-nowrap ${isHidden ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "border-border/50 bg-white text-light-body hover:bg-secondary hover:text-foreground"}`}>{isHidden ? <Eye size={16} /> : <EyeOff size={16} />}{isHidden ? (lang === "ja" ? "表示する" : "Make Visible") : (lang === "ja" ? "非表示にする" : "Hide Post")}</button>}
                <button type="submit" form="edit-form" disabled={submitting || (!title && !titleEn && contentMode !== "external" && contentMode !== "press_release")} className="btn-primary py-3 px-6 h-auto disabled:opacity-50 whitespace-nowrap">{submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText size={18} />} {l.publishBtn}</button>
              </div>
            </div>
            <form id="edit-form" onSubmit={handleSubmit} className="space-y-10 bg-white rounded-2xl p-8 sm:p-12 relative shadow-sm">
              <div className="space-y-3"><label className="text-sm font-semibold text-light-heading ml-1">{lang === "ja" ? "記事の種類" : "Article Type"}</label><div className="flex gap-2 flex-wrap">{modeOptions.map((mode) => (<button key={mode.value} type="button" onClick={() => setContentMode(mode.value)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${contentMode === mode.value ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/10" : "border-border/40 text-light-body hover:border-border hover:bg-secondary/30"}`}>{mode.icon}{mode.label}</button>))}</div></div>
              <PostDetailsFields
                lang={lang}
                authorFirstName={authorFirstName}
                authorLastName={authorLastName}
                publishedAt={publishedAt}
                onAuthorFirstNameChange={setAuthorFirstName}
                onAuthorLastNameChange={setAuthorLastName}
                onPublishedAtChange={setPublishedAt}
                onUseMyName={() => { setAuthorFirstName(firstName); setAuthorLastName(lastName); }}
              />
              <div className="space-y-4"><label className="text-sm font-semibold text-light-heading ml-1">{l.categoryHead}</label>{selectedCategories.length > 0 && (<div className="flex flex-wrap gap-2 mb-4">{selectedCategories.map((cat) => (<span key={cat} className={`flex items-center gap-1 text-xs font-bold border rounded-full px-3 py-1.5 uppercase ${getCategoryColor(cat)}`}>{cat}<button type="button" onClick={() => removeCategory(cat)} className="hover:bg-black/10 rounded-full p-0.5 ml-1 transition-colors"><X size={12} /></button></span>))}</div>)}<div className="flex gap-2"><input type="text" placeholder={l.categoryPlaceholder} value={newCategoryInput} onChange={(e) => setNewCategoryInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())} className="flex-grow bg-secondary/30 rounded-xl px-4 py-3 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-medium border border-transparent focus:border-border/30 placeholder-light-body/40" /><button type="button" onClick={handleAddCategory} className="btn-outline px-4 py-3 h-auto"><Plus size={18} /></button></div>{availableCategories.length > 0 && (<div className="mt-3"><p className="text-xs text-light-body mb-2 ml-1">{l.suggestedCats}</p><div className="flex flex-wrap gap-2">{availableCategories.map((cat) => { const isSelected = selectedCategories.includes(cat); return (<button key={cat} type="button" onClick={() => toggleCategory(cat)} className={`text-xs font-bold border rounded-full px-3 py-1.5 uppercase transition-all ${isSelected ? `${getCategoryColor(cat)} ring-2 ring-primary/20` : "bg-transparent text-light-body hover:bg-secondary"}`}>{cat}</button>); })}</div></div>)}</div>
              <div className="border border-border/50 rounded-xl overflow-hidden p-1">
                {contentMode !== "external" ? (<div className="flex gap-2 p-1 bg-secondary/20 rounded-lg mb-4 mx-4 mt-4"><button type="button" onClick={() => setActiveTab("ja")} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === "ja" ? "bg-white text-primary shadow-sm" : "text-light-body hover:text-light-heading hover:bg-white/50"}`}>Japanese (日本語)</button><button type="button" onClick={() => setActiveTab("en")} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === "en" ? "bg-white text-primary shadow-sm" : "text-light-body hover:text-light-heading hover:bg-white/50"}`}>English (Optional)</button></div>) : (<div className="mx-5 mt-5 mb-2 space-y-3"><label className="text-sm font-semibold text-light-heading">{lang === "ja" ? "記事の言語" : "Article Language"}</label><div className="flex gap-4 border-b border-border/50 pb-5"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="ext_lang" value="ja" checked={externalLanguage === "ja"} onChange={() => setExternalLanguage("ja")} className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Japanese (日本語)</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="ext_lang" value="en" checked={externalLanguage === "en"} onChange={() => setExternalLanguage("en")} className="w-4 h-4 text-primary" /><span className="text-sm font-medium">English</span></label></div></div>)}
                <div className="px-5 pb-5 space-y-8">
                  {contentMode === "external" && (<div className="space-y-4 pt-2"><div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-3"><ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" /><p>{l.externalNote}</p></div><div className="space-y-2"><label className="text-sm font-semibold text-light-heading ml-1">{l.externalUrlLabel}</label><div className="flex gap-2"><input type="url" placeholder={l.externalUrlPlaceholder} value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} required className="flex-grow bg-secondary/30 rounded-xl px-5 py-4 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-medium placeholder-light-body/40" /><button type="button" onClick={fetchExternalMeta} disabled={fetchingMeta || !externalUrl} className="btn-outline px-5 py-3 h-auto whitespace-nowrap disabled:opacity-50">{fetchingMeta ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}{l.fetchMetaBtn}</button></div></div></div>)}
                  <div className="space-y-2"><label className="text-sm font-semibold text-light-heading ml-1">{lActive.titleLabel}</label><input type="text" placeholder={lActive.titlePlaceholder} required={contentMode !== "external" ? (activeTab === "ja") : true} value={contentMode === "external" ? (externalLanguage === "ja" ? title : titleEn) : (activeTab === "ja" ? title : titleEn)} onChange={(e) => contentMode === "external" ? (externalLanguage === "ja" ? setTitle(e.target.value) : setTitleEn(e.target.value)) : (activeTab === "ja" ? setTitle(e.target.value) : setTitleEn(e.target.value))} className="w-full bg-secondary/30 rounded-xl px-5 py-4 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-medium text-lg placeholder-light-body/40" /></div>
                  <div className="space-y-2"><label className="text-sm font-semibold text-light-heading ml-1">{lActive.descLabel}</label><textarea placeholder={lActive.descPlaceholder} value={contentMode === "external" ? (externalLanguage === "ja" ? description : descriptionEn) : (activeTab === "ja" ? description : descriptionEn)} onChange={(e) => contentMode === "external" ? (externalLanguage === "ja" ? setDescription(e.target.value) : setDescriptionEn(e.target.value)) : (activeTab === "ja" ? setDescription(e.target.value) : setDescriptionEn(e.target.value))} rows={3} className="w-full bg-secondary/30 rounded-xl px-5 py-4 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-medium resize-none placeholder-light-body/40" /></div>
                  {contentMode === "standard" && (<div className="space-y-2"><label className="text-sm font-semibold text-light-heading ml-1">{lActive.contentLabel}</label><textarea placeholder={lActive.contentPlaceholder} value={activeTab === "ja" ? content : contentEn} onChange={(e) => activeTab === "ja" ? setContent(e.target.value) : setContentEn(e.target.value)} rows={12} className="w-full bg-secondary/30 rounded-xl px-5 py-4 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-medium resize-none placeholder-light-body/40" /></div>)}
                  {/* Header / cover image — also the card thumbnail, for every post type */}
                  {(<div className="space-y-3"><label className="text-sm font-semibold text-light-heading ml-1">{lActive.mediaLabel}</label><div className={`relative border-2 border-dashed rounded-2xl transition-all ${mediaFile || uploadedImageUrl || existingImageUrl ? "border-primary/50 bg-primary/5" : "border-border/50 hover:border-primary/30 bg-secondary/20"}`}><input type="file" accept="image/*,video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" /><div className="p-8 text-center">{mediaFile || uploadedImageUrl || existingImageUrl ? (<div className="flex flex-col items-center gap-4"><div className="relative w-full max-w-[200px] aspect-video rounded-lg overflow-hidden border border-border shadow-sm">{mediaFile ? (mediaFile.type.startsWith("video") ? <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs">Video Selected</div> : <img src={URL.createObjectURL(mediaFile)} className="w-full h-full object-cover" />) : (<img src={uploadedImageUrl || existingImageUrl} className="w-full h-full object-cover" />)}<button type="button" onClick={(e) => { e.preventDefault(); clearFile(); }} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 z-20"><X size={14} /></button></div><p className="text-sm font-medium text-primary">{mediaFile ? mediaFile.name : (existingImageUrl && !uploadedImageUrl ? "Current Image" : "Image uploaded")}</p></div>) : (<div className="flex flex-col items-center gap-3"><div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-light-body shadow-sm"><Upload size={20} /></div><div className="space-y-1"><p className="text-sm font-semibold text-light-heading">{lActive.dragDrop} <span className="text-primary">{lActive.clickBrowse}</span></p><p className="text-xs text-light-body/60">{lActive.mediaDesc}</p></div></div>)}</div></div></div>)}
                  {contentMode === "press_release" && (<div className="space-y-6"><PressReleaseForm data={activeTab === "ja" ? pressReleaseData : pressReleaseDataEn} onChange={activeTab === "ja" ? setPressReleaseData : setPressReleaseDataEn} onImagesChange={handlePRImagesChange} formLang={activeTab} articleId={id || ""} /></div>)}
                  {contentMode === "custom_html" && (<div className="space-y-6"><div className="space-y-2"><label className="text-sm font-semibold text-light-heading ml-1">{lActive.customHtmlLabel}</label><textarea placeholder={lActive.customHtmlPlaceholder} value={activeTab === "ja" ? customHtml : customHtmlEn} onChange={(e) => activeTab === "ja" ? setCustomHtml(e.target.value) : setCustomHtmlEn(e.target.value)} rows={15} className="w-full bg-secondary/30 rounded-xl px-5 py-4 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-mono text-sm placeholder-light-body/40" /></div><div className="space-y-4"><label className="text-sm font-semibold text-light-heading ml-1">{lActive.additionalMediaLabel}</label><div className="flex flex-wrap gap-4">{additionalMedia.map((m, idx) => (<div key={idx} className="relative w-32 h-32 rounded-xl overflow-hidden border border-border group">{m.type.startsWith("image") ? <img src={m.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-secondary flex items-center justify-center text-xs">Video</div>}<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"><button type="button" onClick={() => copyToClipboard(m.url)} className="p-2 bg-white rounded-full hover:bg-primary hover:text-white transition-colors">{copiedUrl === m.url ? <Check size={16} /> : <Copy size={16} />}</button><button type="button" onClick={() => removeAdditionalMedia(idx)} className="p-2 bg-white rounded-full hover:bg-destructive hover:text-white transition-colors"><X size={16} /></button></div></div>))}<button type="button" onClick={() => additionalMediaRef.current?.click()} className="w-32 h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all">{uploadingMedia ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <><Plus size={24} className="text-light-body" /><span className="text-[10px] font-bold text-light-body uppercase">Upload</span></>}</button></div><input type="file" multiple accept="image/*,video/*" className="hidden" ref={additionalMediaRef} onChange={handleAdditionalMediaUpload} /></div></div>)}
                </div>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </section>
      {showPreview && <ArticlePreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} article={getPreviewArticle() as any} />}
      {showHistory && <ArticleHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} articleId={id!} onCompare={handleCompare} versionTable="blog_versions" />}
      {showDiff && diffVersionA && diffVersionB && <ArticleDiffModal isOpen={showDiff} onClose={() => setShowDiff(false)} versionA={diffVersionA} versionB={diffVersionB} />}
      <Footer />
    </div>
  );
};

export default EditBlogPage;
