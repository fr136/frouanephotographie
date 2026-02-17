import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Franck Rouane Photographie', 
  description = 'Photographies de la Méditerranée - Calanques, couchers de soleil, paysages maritimes. Tirages d\'art en édition limitée.',
  image = '/sunrise-laciotat.jpeg',
  url = '',
  type = 'website',
  keywords = 'photographie, méditerranée, calanques, marseille, tirages art, paysage maritime'
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = `${siteUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Franck Rouane" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Franck Rouane Photographie" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#C9A961" />
      
      {/* Structured Data for Photographer */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Franck Rouane Photographie",
          "description": description,
          "image": fullImage,
          "url": siteUrl,
          "priceRange": "€€",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Marseille",
            "addressRegion": "Provence-Alpes-Côte d'Azur",
            "addressCountry": "FR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 43.2965,
            "longitude": 5.3698
          },
          "sameAs": [],
          "knowsAbout": ["Photographie de paysage", "Photographie maritime", "Calanques", "Méditerranée"]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
