import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './CollectionsReveal.css';

const FALLBACK_IMAGES = [
  { src: '/Calanque Sormiou 2.webp', alt: 'Calanque Sormiou' },
  { src: '/Sormiou.jpeg', alt: 'Vue sur Sormiou' },
  { src: '/sormiou-calanque.webp', alt: 'Calanque et mer turquoise' },
  { src: '/sunset-laciotat.JPEG', alt: 'Coucher de soleil à La Ciotat' },
  { src: '/Calanque-agay.webp', alt: 'Falaises d’Agay' }
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const CollectionsReveal = ({ collections = [] }) => {
  const wrapperRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const stackItems = useMemo(() => {
    const normalized = collections
      .filter((item) => item?.image)
      .slice(0, 5)
      .map((item, idx) => ({
        id: item.id || `collection-${idx}`,
        src: item.image,
        alt: item.title ? `Collection ${item.title}` : `Photo de collection ${idx + 1}`,
        title: item.title || 'Collection',
        subtitle: item.subtitle || '',
        slug: item.slug || ''
      }));

    if (normalized.length >= 3) return normalized;

    const needed = 4 - normalized.length;
    const fallbacks = FALLBACK_IMAGES.slice(0, needed).map((img, idx) => ({
      id: `fallback-${idx}`,
      src: img.src,
      alt: img.alt,
      title: 'Collection',
      subtitle: 'Aperçu',
      slug: ''
    }));

    return [...normalized, ...fallbacks];
  }, [collections]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMode = () => setIsDesktop(desktopQuery.matches && !reducedMotionQuery.matches);
    updateMode();

    desktopQuery.addEventListener('change', updateMode);
    reducedMotionQuery.addEventListener('change', updateMode);

    return () => {
      desktopQuery.removeEventListener('change', updateMode);
      reducedMotionQuery.removeEventListener('change', updateMode);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop || !wrapperRef.current) {
      setProgress(0);
      return;
    }

    let rafId = 0;
    let ticking = false;

    const updateProgress = () => {
      const el = wrapperRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const scrollable = Math.max(el.offsetHeight - window.innerHeight, 1);
      const scrolled = clamp(-rect.top, 0, scrollable);
      const next = scrolled / scrollable;
      setProgress(next);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, [isDesktop]);

  const total = stackItems.length;
  const segment = 1 / Math.max(total, 1);

  return (
    <section ref={wrapperRef} className={`collections-reveal ${isDesktop ? 'is-desktop' : 'is-mobile'}`}>
      <div className="collections-reveal__sticky">
        <div className="collections-reveal__content">
          <div className="collections-reveal__visual" aria-hidden="true">
            {stackItems.map((item, index) => {
              const orderFromTop = total - 1 - index;
              const start = orderFromTop * segment;
              const localProgress = clamp((progress - start) / segment, 0, 1);
              const translateY = isDesktop ? -(localProgress * 115) : 0;
              const scale = isDesktop ? 1 - localProgress * 0.03 : 1;

              return (
                <figure
                  key={item.id}
                  className="collections-reveal__layer"
                  style={{
                    zIndex: index + 1,
                    transform: `translate3d(0, ${translateY}%, 0) scale(${scale})`
                  }}
                >
                  <img src={item.src} alt={item.alt} loading={index === total - 1 ? 'eager' : 'lazy'} />
                </figure>
              );
            })}
          </div>

          <div className="collections-reveal__text">
            <p className="section-subtitle mb-3">Découvrir ma collection</p>
            <h3 className="section-title mb-6">Un aperçu immersif de mes séries</h3>
            <p className="body-text mb-8">
              Faites défiler pour révéler les images les unes après les autres, puis explorez l’intégralité des
              collections.
            </p>
            <div className="collections-reveal__actions">
              <Link to="/collections" className="btn-primary">Voir Toutes les Collections</Link>
              {stackItems[total - 1]?.slug ? (
                <Link to={`/collections/${stackItems[total - 1].slug}`} className="btn-outline">
                  Ouvrir la collection mise en avant
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionsReveal;
