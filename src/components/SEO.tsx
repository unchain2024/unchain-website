import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/lib/articleLinks";

const DEFAULT_LOGO = `${SITE_URL}/logo-black.webp`;

export type SEOProps = {
  title?: string;
  description?: string;
  type?: "website" | "article" | "faq";
  image?: string;
  url?: string;
  /** Canonical URL. Defaults to `url` when omitted. */
  canonical?: string;
  /** hreflang alternates, e.g. `{ ja: "...", en: "..." }`. */
  alternates?: { ja?: string; en?: string };
  author?: {
    name: string;
    url?: string;
  };
  datePublished?: string;
  dateModified?: string;
  faqData?: { question: string; answer: string }[];
  organization?: boolean;
};

export default function SEO({
  title = "UNCHAIN | Unchain The World",
  description = "UNCHAIN株式会社 — 組織型AI（A.O.I）の力で世界をUNCHAINする",
  type = "website",
  image = DEFAULT_LOGO,
  url = typeof window !== "undefined" ? window.location.href : SITE_URL,
  canonical,
  alternates,
  author,
  datePublished,
  dateModified,
  faqData,
  organization = false,
}: SEOProps) {
  const canonicalUrl = canonical || url;
  // Schema generation
  const schemas = [];

  if (organization) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "UNCHAIN Co., Ltd.",
      url: SITE_URL,
      logo: DEFAULT_LOGO,
      description: "組織型AI（A.O.I）の力で世界をUNCHAINする",
    });
  }

  if (type === "website") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "UNCHAIN",
      url: SITE_URL,
    });
  } else if (type === "article") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: description,
      image: image,
      author: author
        ? { "@type": "Person", name: author.name, url: author.url }
        : { "@type": "Organization", name: "UNCHAIN" },
      publisher: {
        "@type": "Organization",
        name: "UNCHAIN",
        logo: {
          "@type": "ImageObject",
          url: DEFAULT_LOGO,
        },
      },
      datePublished: datePublished,
      dateModified: dateModified || datePublished,
    });
  } else if (type === "faq" && faqData && faqData.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqData.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang alternates */}
      {alternates?.ja && <link rel="alternate" hrefLang="ja" href={alternates.ja} />}
      {alternates?.en && <link rel="alternate" hrefLang="en" href={alternates.en} />}
      {alternates?.ja && <link rel="alternate" hrefLang="x-default" href={alternates.ja} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type === "article" ? "article" : "website"} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="UNCHAIN" />
      {type === "article" && datePublished && (
        <meta property="article:published_time" content={datePublished} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author.name} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
