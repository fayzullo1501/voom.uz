import { Helmet } from "react-helmet-async";

const BASE_URL = "https://voom.uz";

const LOCALE_MAP = {
  ru: "ru_RU",
  uz: "uz_UZ",
  en: "en_US",
};

/**
 * @param {string} title
 * @param {string} description
 * @param {string} path        — e.g. "/about" or "/routes/123"
 * @param {string} [lang]      — "ru" | "uz" | "en"  (default "ru")
 * @param {string} [image]     — absolute URL to OG image
 * @param {string} [type]      — og:type, default "website"
 * @param {object} [schema]    — override / additional JSON-LD object
 * @param {boolean} [noindex]  — set true for private/auth pages
 */
const SEO = ({
  title,
  description,
  path = "",
  lang = "ru",
  image,
  type = "website",
  schema,
  noindex = false,
}) => {
  const fullUrl = `${BASE_URL}/${lang}${path}`;
  const ogImage = image || `${BASE_URL}/og-image.jpg`;
  const ogLocale = LOCALE_MAP[lang] || "ru_RU";

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VOOM",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/og-image.jpg`,
    },
    sameAs: [
      "https://t.me/voom_uz",
      "https://instagram.com/voom.uz",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+998999961696",
      contactType: "customer support",
      availableLanguage: ["Russian", "Uzbek"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VOOM",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/${lang}/routes?from={from}&to={to}`,
      },
      "query-input": "required name=from required name=to",
    },
  };

  const finalSchema = schema || orgSchema;

  return (
    <Helmet>
      {/* Base */}
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}

      {/* hreflang */}
      <link rel="alternate" hreflang="ru" href={`${BASE_URL}/ru${path}`} />
      <link rel="alternate" hreflang="uz" href={`${BASE_URL}/uz${path}`} />
      <link rel="alternate" hreflang="en" href={`${BASE_URL}/en${path}`} />
      <link rel="alternate" hreflang="x-default" href={`${BASE_URL}/ru${path}`} />

      {/* Open Graph */}
      <meta property="og:site_name" content="VOOM" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content="ru_RU" />
      <meta property="og:locale:alternate" content="uz_UZ" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@voom_uz" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(finalSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
    </Helmet>
  );
};

export default SEO;
