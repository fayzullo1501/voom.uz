import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, path }) => {
  const baseUrl = "https://voom.uz";
  const fullUrl = `${baseUrl}${path}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VOOM",
    url: baseUrl,
    logo: `${baseUrl}/favicon.svg`,
    sameAs: [
      "https://t.me/voom_uz",
      "https://instagram.com/voom.uz"
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* hreflang */}
      <link rel="alternate" hreflang="ru" href={`${baseUrl}/ru${path}`} />
      <link rel="alternate" hreflang="uz" href={`${baseUrl}/uz${path}`} />
      <link rel="alternate" hreflang="en" href={`${baseUrl}/en${path}`} />
      <link rel="alternate" hreflang="x-default" href={`${baseUrl}/ru${path}`} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;