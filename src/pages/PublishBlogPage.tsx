import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Loader2, FileImage, X, FileText, ArrowLeft, Eye, CheckCircle2, Plus,
  Download, Code2, LayoutTemplate, ExternalLink, Upload, Copy, Check, Newspaper
} from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ArticlePreviewModal from "@/components/ArticlePreviewModal";
import PressReleaseForm from "@/components/PressReleaseForm";
import { EMPTY_PRESS_RELEASE } from "@/components/PressReleaseRenderer";
import type { PressReleaseData } from "@/components/PressReleaseRenderer";
import { getCategoryColor } from "./NewsPage";
import { useLang } from "@/lib/language";

type ContentMode = "standard" | "custom_html" | "external" | "press_release";

const PublishBlogPage = () => {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [contentMode, setContentMode] = useState<ContentMode>("standard");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Shared fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [contentEn, setContentEn] = useState("");

  // Custom HTML fields
  const [customHtml, setCustomHtml] = useState("");
  const [customHtmlEn, setCustomHtmlEn] = useState("");
  const [additionalMedia, setAdditionalMedia] = useState<{ url: string; type: string }[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Press Release fields
  const [pressReleaseData, setPressReleaseData] = useState<PressReleaseData>(EMPTY_PRESS_RELEASE);
  const [pressReleaseDataEn, setPressReleaseDataEn] = useState<PressReleaseData>(EMPTY_PRESS_RELEASE);

  // Standard header image
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // External article fields
  const [externalUrl, setExternalUrl] = useState("");
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [externalPublishedDate, setExternalPublishedDate] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"ja" | "en">("ja");
  const [showPreview, setShowPreview] = useState(false);
  const [externalLanguage, setExternalLanguage] = useState<"ja" | "en">("ja");

  const [articleId] = useState(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  });
  
  const [hasInserted, setHasInserted] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const additionalMediaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkUserAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
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

        const { data: articles } = await supabase.from("blogs").select("category");
        const cats = new Set<string>(["external"]);
        if (articles) {
          articles.forEach((a) => {
            if (a.category) {
              a.category.split(",").forEach((c: string) => cats.add(c.trim()));
            }
          });
        }
        setAvailableCategories(Array.from(cats).sort());
        setLoading(false);
      }
    };
    checkUserAndProfile();
  }, [navigate]);

  useEffect(() => {
    if (contentMode === "external") {
      setSelectedCategories((prev) =>
        prev.includes("external") ? prev : [...prev, "external"]
      );
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== "external"));
    }
  }, [contentMode]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if ((title || titleEn || description || content || mediaFile) && !submitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [title, titleEn, description, content, mediaFile, submitting]);

  useEffect(() => {
    if (!title && !titleEn && contentMode !== "external") return;
    const delayDebounceFn = setTimeout(() => {
      if (!submitting) performSave(false);
    }, 2500);
    return () => clearTimeout(delayDebounceFn);
  }, [title, description, content, selectedCategories, titleEn, descriptionEn, contentEn, mediaFile, customHtml, customHtmlEn, externalUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMediaFile(e.target.files[0]);
      setUploadedImageUrl(null);
    }
  };

  const clearFile = () => {
    setMediaFile(null);
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
      const filePath = `${articleId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("article-media")
        .upload(filePath, file);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("article-media")
          .getPublicUrl(filePath);
        results.push({ url: urlData.publicUrl, type: file.type });
      }
    }
    setAdditionalMedia((prev) => [...prev, ...results]);
    setUploadingMedia(false);
    if (additionalMediaRef.current) additionalMediaRef.current.value = "";
  };

  const removeAdditionalMedia = (idx: number) => {
    setAdditionalMedia((prev) => prev.filter((_, i) => i !== idx));
  };

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 1500);
  };

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
          try {
            const parsedDate = new Date(ogDate);
            if (!isNaN(parsedDate.getTime())) {
              setExternalPublishedDate(parsedDate.toISOString());
            }
          } catch (e) {
            console.error("Failed to parse date", e);
          }
        }
        toast.success("Metadata fetched successfully!");
      } else {
        throw new Error("Failed to parse metadata");
      }
    } catch {
      toast.error("Could not fetch metadata from that URL. Please fill in manually.");
    } finally {
      setFetchingMeta(false);
    }
  };

  const handlePRImagesChange = (sectionIdx: number, urls: string[]) => {
    setPressReleaseData(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === sectionIdx ? { ...s, imageUrls: urls, imageUrl: urls[0] || "" } : s
      ),
    }));
    setPressReleaseDataEn(prev => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === sectionIdx ? { ...s, imageUrls: urls, imageUrl: urls[0] || "" } : s
      ),
    }));
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (trimmed && !selectedCategories.includes(trimmed)) {
      setSelectedCategories([...selectedCategories, trimmed]);
      if (!availableCategories.includes(trimmed)) {
        setAvailableCategories([...availableCategories, trimmed].sort());
      }
    }
    setNewCategoryInput("");
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const removeCategory = (cat: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== cat));
  };

  const performSave = async (isExplicitPublish: boolean) => {
    if (!user) return false;

    if (isExplicitPublish && contentMode !== "external" && !title && !titleEn) {
      toast.error(activeTab === "ja" ? "タイトルを入力してください。" : "Please provide at least a title to publish.");
      return false;
    }

    if (isExplicitPublish && contentMode === "external") {
      if (!externalUrl) {
        toast.error("Please enter an external URL.");
        return false;
      }
      if (externalLanguage === "ja" && !title) {
        toast.error("タイトルを入力してください。(Title required)");
        return false;
      }
      if (externalLanguage === "en" && !titleEn) {
        toast.error("Please provide a title.");
        return false;
      }
    }

    if (isExplicitPublish) setSubmitting(true);
    else setIsAutoSaving(true);

    let mediaUrl = uploadedImageUrl;

    try {
      if (mediaFile && !uploadedImageUrl && contentMode === "standard") {
        const fileExt = mediaFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${articleId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("article-media")
          .upload(filePath, mediaFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("article-media")
          .getPublicUrl(filePath);

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
        id: articleId,
        category: finalCategories.join(", "),
        title: finalTitle,
        description: finalDesc,
        content: contentMode === "external" ? ""
          : contentMode === "press_release" ? JSON.stringify(pressReleaseData)
          : content,
        title_en: finalTitleEn,
        description_en: finalDescEn,
        content_en: contentMode === "external" ? ""
          : contentMode === "press_release" ? JSON.stringify(pressReleaseDataEn)
          : contentEn,
        image_url: mediaUrl,
        author_first_name: firstName,
        author_last_name: lastName,
        author_id: user.id,
        is_draft: !isExplicitPublish,
        content_type: contentMode === "custom_html" ? "custom_html"
          : contentMode === "press_release" ? "press_release"
          : "standard",
        custom_html: contentMode === "custom_html" ? customHtml : null,
        custom_html_en: contentMode === "custom_html" ? customHtmlEn : null,
        additional_media: contentMode === "custom_html" ? additionalMedia : [],
        is_external: contentMode === "external",
        external_url: contentMode === "external" ? externalUrl : null,
      };

      if (contentMode === "external" && externalPublishedDate) {
        payload.created_at = externalPublishedDate;
      }

      if (hasInserted) {
        const { id, ...updatePayload } = payload;
        const { error: updateError } = await supabase
          .from("blogs")
          .update(updatePayload)
          .eq("id", articleId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("blogs")
          .insert([payload]);
        if (insertError) throw insertError;
        setHasInserted(true);
      }

      setLastSavedAt(new Date());

      if (isExplicitPublish) {
        toast.success(activeTab === "ja" ? "ブログ記事を公開しました！" : "Blog article published successfully!");
        navigate("/admin");
      }
      return true;
    } catch (error: any) {
      if (isExplicitPublish) toast.error(error.message || "Failed to save blog article.");
      return false;
    } finally {
      if (isExplicitPublish) setSubmitting(false);
      else setIsAutoSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSave(true);
  };

  const getPreviewArticle = () => {
    let previewUrl = mediaFile ? URL.createObjectURL(mediaFile) : "";
    if (!mediaFile && uploadedImageUrl) previewUrl = uploadedImageUrl;

    return {
      title: contentMode === "press_release" ? (pressReleaseData.title || title) : (activeTab === "ja" ? title : titleEn || title),
      description: contentMode === "press_release" ? (pressReleaseData.leadParagraph?.substring(0, 200) || description) : (activeTab === "ja" ? description : descriptionEn || description),
      content: contentMode === "press_release" ? JSON.stringify(pressReleaseData) : (activeTab === "ja" ? content : contentEn || content),
      category: selectedCategories.join(", "),
      image_url: previewUrl,
      author_first_name: firstName,
      author_last_name: lastName,
      content_type: contentMode === "press_release" ? "press_release" : contentMode === "custom_html" ? "custom_html" : "standard",
      custom_html: activeTab === "ja" ? customHtml : customHtmlEn || customHtml,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const labels = {
    ja: {
      back: "ブログリストに戻る",
      pubHeaderLabel: "ブログを作成",
      pubHeaderTitle: "ブログ記事を公開する",
      pubHeaderDesc: "あなたの考えやインサイトを共有しましょう。",
      saving: "保存中...",
      savedAt: "保存完了",
      previewBtn: "プレビュー",
      publishBtn: "公開する",
      categoryHead: "カテゴリ（複数選択可）",
      categoryPlaceholder: "新しいカテゴリを入力...",
      addBtn: "追加",
      suggestedCats: "既存のカテゴリから選択:",
      titleLabel: "タイトル (必須)",
      titlePlaceholder: "ブログのタイトル",
      descLabel: "概要 / 簡単な説明",
      descPlaceholder: "概要や短い説明...",
      contentLabel: "本文",
      contentPlaceholder: "ブログの本文をここに書きます...",
      mediaLabel: "ヘッダーメディア（画像・動画）",
      dragDrop: "ファイルをドロップするか",
      clickBrowse: "クリックして選択",
      mediaDesc: "JPEG、PNG、または50MB以下の動画",
      customHtmlLabel: "カスタム HTML（日本語）",
      customHtmlPlaceholder: "<h2>見出し</h2>\n<p>ここに本文のHTMLを貼り付けてください...</p>",
      additionalMediaLabel: "追加メディア（複数アップロード可）",
      uploadedUrls: "アップロード済みURL（HTMLに貼り付けて使用）",
      externalUrlLabel: "外部ブログのURL",
      externalUrlPlaceholder: "https://medium.com/...",
      fetchMetaBtn: "メタ情報を取得",
      externalNote: "この記事は外部サイトへのリンクとして表示されます。",
    },
    en: {
      back: "Back to Blog List",
      pubHeaderLabel: "Write Blog",
      pubHeaderTitle: "Publish Blog Post",
      pubHeaderDesc: "Share your thoughts and deep insights.",
      saving: "Saving...",
      savedAt: "Draft saved at",
      previewBtn: "Preview",
      publishBtn: "Publish",
      categoryHead: "Categories (Select multiple)",
      categoryPlaceholder: "Type new category...",
      addBtn: "Add",
      suggestedCats: "Suggested:",
      titleLabel: "Title (Required)",
      titlePlaceholder: "Blog Title",
      descLabel: "Description / Summary",
      descPlaceholder: "Short description or summary...",
      contentLabel: "Full Story / Content",
      contentPlaceholder: "Write the full story here...",
      mediaLabel: "Header Media (Image/Video)",
      dragDrop: "Drop a file here or",
      clickBrowse: "click to browse",
      mediaDesc: "Images (JPG, PNG) or Videos up to 50MB",
      customHtmlLabel: "Custom HTML (English)",
      customHtmlPlaceholder: "<h2>Heading</h2>\n<p>Paste your blog HTML here...</p>",
      additionalMediaLabel: "Additional Media (Multiple uploads)",
      uploadedUrls: "Uploaded URLs (paste into your HTML)",
      externalUrlLabel: "External Blog URL",
      externalUrlPlaceholder: "https://medium.com/...",
      fetchMetaBtn: "Fetch Metadata",
      externalNote: "This post will appear in the blog list as an external link.",
    },
  };

  const l = labels[lang];
  const activeLabelLang = contentMode === "external" ? externalLanguage : activeTab;
  const lActive = labels[activeLabelLang] || l;

  const modeOptions: { value: ContentMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      value: "standard",
      icon: <LayoutTemplate className="w-5 h-5" />,
      label: lang === "ja" ? "標準テンプレート" : "Standard Template",
      desc: lang === "ja" ? "テキストと1枚の画像" : "Text content with one header image",
    },
    {
      value: "press_release",
      icon: <Newspaper className="w-5 h-5" />,
      label: lang === "ja" ? "プレスリリース" : "Press Release",
      desc: lang === "ja" ? "正式な形式" : "Formal release format",
    },
    {
      value: "custom_html",
      icon: <Code2 className="w-5 h-5" />,
      label: lang === "ja" ? "カスタム HTML" : "Custom HTML",
      desc: lang === "ja" ? "独自のHTMLレイアウト" : "Paste your own HTML layout",
    },
    {
      value: "external",
      icon: <ExternalLink className="w-5 h-5" />,
      label: lang === "ja" ? "外部リンク" : "External Link",
      desc: lang === "ja" ? "外部サイトへのリンク" : "Link to an external blog post",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navigation />
      <section data-nav-theme="light" className="bg-secondary pt-32 pb-24 px-6 md:px-12 flex-grow relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* amount 0: a long form can never be 30% on screen, and would stay hidden */}
          <ScrollReveal amount={0}>
            <button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-light-body hover:text-primary mb-8 text-sm font-medium transition-all group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {l.back}
            </button>
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
              <div>
                <span className="label text-light-label mb-3 block">{l.pubHeaderLabel}</span>
                <h1 className="heading-1 text-light-heading mb-4">{l.pubHeaderTitle}</h1>
                <div className="flex items-center flex-wrap gap-3">
                  <p className="body text-light-body max-w-lg">{l.pubHeaderDesc}</p>
                  {isAutoSaving && <span className="flex items-center gap-1 text-xs text-light-body/60 bg-white/50 px-2 py-1 rounded-full"><Loader2 className="w-3 h-3 animate-spin" /> {l.saving}</span>}
                  {lastSavedAt && !isAutoSaving && <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 whitespace-nowrap"><CheckCircle2 className="w-3 h-3" /> {l.savedAt} {lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
                </div>
              </div>
              <div className="flex gap-4">
                {contentMode !== "external" && <button type="button" onClick={() => setShowPreview(true)} className="btn-outline border-border/50 hover:bg-secondary py-3 px-6 h-auto whitespace-nowrap"><Eye size={18} /> {l.previewBtn}</button>}
                <button type="submit" form="publish-form" disabled={submitting || (!title && !titleEn && contentMode !== "external" && contentMode !== "press_release")} className="btn-primary py-3 px-6 h-auto disabled:opacity-50 whitespace-nowrap">{submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText size={18} />} {l.publishBtn}</button>
              </div>
            </div>
            <form id="publish-form" onSubmit={handleSubmit} className="space-y-10 bg-white rounded-2xl p-8 sm:p-12 relative shadow-sm">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-light-heading ml-1">{lang === "ja" ? "記事の種類" : "Post Type"}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {modeOptions.map((mode) => (
                    <button key={mode.value} type="button" onClick={() => setContentMode(mode.value)} className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${contentMode === mode.value ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "border-border/40 hover:border-border hover:bg-secondary/30"}`}>
                      <span className={`mt-0.5 flex-shrink-0 ${contentMode === mode.value ? "text-primary" : "text-light-body"}`}>{mode.icon}</span>
                      <div>
                        <p className={`text-sm font-semibold ${contentMode === mode.value ? "text-primary" : "text-light-heading"}`}>{mode.label}</p>
                        <p className="text-xs text-light-body mt-0.5">{mode.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-semibold text-light-heading ml-1">{l.categoryHead}</label>
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedCategories.map((cat) => (
                      <span key={cat} className={`flex items-center gap-1 text-xs font-bold border rounded-full px-3 py-1.5 uppercase ${getCategoryColor(cat)}`}>
                        {cat}
                        <button type="button" onClick={() => removeCategory(cat)} className="hover:bg-black/10 rounded-full p-0.5 ml-1 transition-colors"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input type="text" placeholder={l.categoryPlaceholder} value={newCategoryInput} onChange={(e) => setNewCategoryInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())} className="flex-grow bg-secondary/30 rounded-xl px-4 py-3 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-medium border border-transparent focus:border-border/30 placeholder-light-body/40" />
                  <button type="button" onClick={handleAddCategory} className="btn-outline px-4 py-3 h-auto"><Plus size={18} /></button>
                </div>
              </div>
              <div className="border border-border/50 rounded-xl overflow-hidden p-1">
                {contentMode !== "external" ? (
                  <div className="flex gap-2 p-1 bg-secondary/20 rounded-lg mb-4 mx-4 mt-4">
                    <button type="button" onClick={() => setActiveTab("ja")} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === "ja" ? "bg-white text-primary shadow-sm" : "text-light-body hover:text-light-heading hover:bg-white/50"}`}>Japanese (日本語)</button>
                    <button type="button" onClick={() => setActiveTab("en")} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === "en" ? "bg-white text-primary shadow-sm" : "text-light-body hover:text-light-heading hover:bg-white/50"}`}>English (Optional)</button>
                  </div>
                ) : (
                  <div className="mx-5 mt-5 mb-2 space-y-3">
                    <label className="text-sm font-semibold text-light-heading">{lang === "ja" ? "記事の言語" : "Article Language"}</label>
                    <div className="flex gap-4 border-b border-border/50 pb-5">
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="ext_lang" value="ja" checked={externalLanguage === "ja"} onChange={() => setExternalLanguage("ja")} className="w-4 h-4 text-primary" /><span className="text-sm font-medium">Japanese (日本語)</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="ext_lang" value="en" checked={externalLanguage === "en"} onChange={() => setExternalLanguage("en")} className="w-4 h-4 text-primary" /><span className="text-sm font-medium">English</span></label>
                    </div>
                  </div>
                )}
                <div className="px-5 pb-5 space-y-8">
                  {contentMode === "external" && (
                    <div className="space-y-4 pt-2">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-3"><ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" /><p>{l.externalNote}</p></div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-light-heading ml-1">{l.externalUrlLabel}</label>
                        <div className="flex gap-2">
                          <input type="url" placeholder={l.externalUrlPlaceholder} value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} required className="flex-grow bg-secondary/30 rounded-xl px-5 py-4 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-medium placeholder-light-body/40" />
                          <button type="button" onClick={fetchExternalMeta} disabled={fetchingMeta || !externalUrl} className="btn-outline px-5 py-3 h-auto whitespace-nowrap disabled:opacity-50">{fetchingMeta ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}{l.fetchMetaBtn}</button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-light-heading ml-1">{lActive.titleLabel}</label>
                    <input type="text" placeholder={lActive.titlePlaceholder} required={contentMode !== "external" ? (activeTab === "ja") : true} value={contentMode === "external" ? (externalLanguage === "ja" ? title : titleEn) : (activeTab === "ja" ? title : titleEn)} onChange={(e) => contentMode === "external" ? (externalLanguage === "ja" ? setTitle(e.target.value) : setTitleEn(e.target.value)) : (activeTab === "ja" ? setTitle(e.target.value) : setTitleEn(e.target.value))} className="w-full bg-secondary/30 rounded-xl px-5 py-4 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-medium text-lg placeholder-light-body/40" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-light-heading ml-1">{lActive.descLabel}</label>
                    <textarea placeholder={lActive.descPlaceholder} value={contentMode === "external" ? (externalLanguage === "ja" ? description : descriptionEn) : (activeTab === "ja" ? description : descriptionEn)} onChange={(e) => contentMode === "external" ? (externalLanguage === "ja" ? setDescription(e.target.value) : setDescriptionEn(e.target.value)) : (activeTab === "ja" ? setDescription(e.target.value) : setDescriptionEn(e.target.value))} rows={3} className="w-full bg-secondary/30 rounded-xl px-5 py-4 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-medium resize-none placeholder-light-body/40" />
                  </div>
                  {contentMode === "standard" && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-light-heading ml-1">{lActive.contentLabel}</label>
                      <textarea placeholder={lActive.contentPlaceholder} value={activeTab === "ja" ? content : contentEn} onChange={(e) => activeTab === "ja" ? setContent(e.target.value) : setContentEn(e.target.value)} rows={12} className="w-full bg-secondary/30 rounded-xl px-5 py-4 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-medium resize-none placeholder-light-body/40" />
                    </div>
                  )}
                  {contentMode === "standard" && (
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-light-heading ml-1">{lActive.mediaLabel}</label>
                      <div className={`relative border-2 border-dashed rounded-2xl transition-all ${mediaFile || uploadedImageUrl ? "border-primary/50 bg-primary/5" : "border-border/50 hover:border-primary/30 bg-secondary/20"}`}>
                        <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="p-8 text-center">
                          {mediaFile || uploadedImageUrl ? (
                            <div className="flex flex-col items-center gap-4">
                              <div className="relative w-full max-w-[200px] aspect-video rounded-lg overflow-hidden border border-border shadow-sm">
                                {mediaFile ? (mediaFile.type.startsWith("video") ? <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs">Video Selected</div> : <img src={URL.createObjectURL(mediaFile)} className="w-full h-full object-cover" />) : <img src={uploadedImageUrl!} className="w-full h-full object-cover" />}
                                <button type="button" onClick={(e) => { e.preventDefault(); clearFile(); }} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 z-20"><X size={14} /></button>
                              </div>
                              <p className="text-sm font-medium text-primary">{mediaFile ? mediaFile.name : "Image uploaded"}</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-light-body shadow-sm"><Upload size={20} /></div>
                              <div className="space-y-1"><p className="text-sm font-semibold text-light-heading">{lActive.dragDrop} <span className="text-primary">{lActive.clickBrowse}</span></p><p className="text-xs text-light-body/60">{lActive.mediaDesc}</p></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {contentMode === "press_release" && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-4 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0"><Newspaper size={20} /></div>
                        <div><p className="font-bold text-blue-900 text-sm mb-1">{lang === "ja" ? "プレスリリース作成ツール" : "Press Release Tool"}</p><p className="text-blue-700 text-xs leading-relaxed">{lang === "ja" ? "PR TIMESなどの配信サービスに適した正式な形式でプレスリリースを作成できます。セクションごとに画像や説明文を追加可能です。" : "Create formal press releases suitable for distribution services. You can add images and descriptions for each section."}</p></div>
                      </div>
                      <PressReleaseForm data={activeTab === "ja" ? pressReleaseData : pressReleaseDataEn} onChange={activeTab === "ja" ? setPressReleaseData : setPressReleaseDataEn} onImagesChange={handlePRImagesChange} formLang={activeTab} articleId={articleId} />
                    </div>
                  )}
                  {contentMode === "custom_html" && (
                    <div className="space-y-6">
                      <div className="space-y-2"><label className="text-sm font-semibold text-light-heading ml-1">{lActive.customHtmlLabel}</label><textarea placeholder={lActive.customHtmlPlaceholder} value={activeTab === "ja" ? customHtml : customHtmlEn} onChange={(e) => activeTab === "ja" ? setCustomHtml(e.target.value) : setCustomHtmlEn(e.target.value)} rows={15} className="w-full bg-secondary/30 rounded-xl px-5 py-4 text-light-heading focus:outline-none focus:bg-secondary/60 transition-colors font-mono text-sm placeholder-light-body/40" /></div>
                      <div className="space-y-4">
                        <label className="text-sm font-semibold text-light-heading ml-1">{lActive.additionalMediaLabel}</label>
                        <div className="flex flex-wrap gap-4">
                          {additionalMedia.map((m, idx) => (
                            <div key={idx} className="relative w-32 h-32 rounded-xl overflow-hidden border border-border group">
                              {m.type.startsWith("image") ? <img src={m.url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-secondary flex items-center justify-center text-xs">Video</div>}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button type="button" onClick={() => copyToClipboard(m.url)} className="p-2 bg-white rounded-full hover:bg-primary hover:text-white transition-colors">{copiedUrl === m.url ? <Check size={16} /> : <Copy size={16} />}</button>
                                <button type="button" onClick={() => removeAdditionalMedia(idx)} className="p-2 bg-white rounded-full hover:bg-destructive hover:text-white transition-colors"><X size={16} /></button>
                              </div>
                            </div>
                          ))}
                          <button type="button" onClick={() => additionalMediaRef.current?.click()} className="w-32 h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
                            {uploadingMedia ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <><Plus size={24} className="text-light-body" /><span className="text-[10px] font-bold text-light-body uppercase">Upload</span></>}
                          </button>
                        </div>
                        <input type="file" multiple accept="image/*,video/*" className="hidden" ref={additionalMediaRef} onChange={handleAdditionalMediaUpload} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </section>
      {showPreview && <ArticlePreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} article={getPreviewArticle() as any} />}
      <Footer />
    </div>
  );
};

export default PublishBlogPage;
