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
  const pageTitle = title || 'Franck Rouane Photographie';

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Franck Rouane" />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Franck Rouane Photographie" />
      <meta property="og:locale" content="fr_FR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#C9A961" />
    </Helmet>
  );
};

export default SEO;
