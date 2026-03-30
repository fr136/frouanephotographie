import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ 
  title,
  description,
  image,
  url,
  type = 'website',
  collection = null,
}) => {
  const siteUrl = 'https://www.frouanephotographie.com';
  const defaultTitle = 'Franck Rouane Photographie | Tirages d\'Art Méditerranée';
  const defaultDescription = 'Photographe professionnel spécialisé dans les paysages méditerranéens. Calanques de Marseille, couchers de soleil. Tirages d\'art numérotés et signés.';
  const defaultImage = `${siteUrl}/sunrise-laciotat.jpeg`;

  const pageTitle = title ? `${title} | Franck Rouane Photographie` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl;

  // Schema.org structured data for photographer
  const photographerSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Franck Rouane Photographie",
    "alternateName": "FRouane Photo",
    "description": pageDescription,
    "image": pageImage,
    "url": siteUrl,
    "telephone": "",
    "priceRange": "€€€",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Marseille",
      "addressRegion": "Provence-Alpes-Côte d'Azur",
      "postalCode": "13000",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.2965,
      "longitude": 5.3698
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 43.2965,
        "longitude": 5.3698
      },
      "geoRadius": "100000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Tirages d'Art",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Tirage Fine Art",
            "description": "Impression sur papier 100% coton, numérotée et signée"
          }
        }
      ]
    },
    "sameAs": [
      "https://www.instagram.com/frouanephotographie",
      "https://www.facebook.com/frouanephotographie"
    ],
    "knowsAbout": [
      "Photographie de paysage",
      "Photographie maritime",
      "Calanques de Marseille",
      "Méditerranée",
      "Tirage Fine Art",
      "Coucher de soleil"
    ]
  };

  // Schema for image gallery/collection
  const collectionSchema = collection ? {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": collection.title,
    "description": collection.description,
    "image": collection.image,
    "author": {
      "@type": "Person",
      "name": "Franck Rouane"
    },
    "dateCreated": "2024",
    "locationCreated": {
      "@type": "Place",
      "name": "Marseille, France"
    }
  } : null;

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": siteUrl
      },
      ...(url ? [{
        "@type": "ListItem",
        "position": 2,
        "name": title || "Page",
        "item": pageUrl
      }] : [])
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content="photographe marseille, calanques, tirage art, photographie paysage, méditerranée, coucher soleil, fine art, photo provence" />
      <meta name="author" content="Franck Rouane" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Franck Rouane Photographie" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Additional SEO */}
      <meta name="geo.region" content="FR-13" />
      <meta name="geo.placename" content="Marseille" />
      <meta name="geo.position" content="43.2965;5.3698" />
      <meta name="ICBM" content="43.2965, 5.3698" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(photographerSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {collectionSchema && (
        <script type="application/ld+json">
          {JSON.stringify(collectionSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
