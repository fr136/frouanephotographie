import React, { useState, useRef, useEffect, forwardRef } from 'react';

/**
 * LazyImage — drop-in replacement for <img>
 * - IntersectionObserver with 500px rootMargin
 * - blur(20px) → blur(0px) on load (0.5s ease)
 * - Animated skeleton while waiting
 * - 1× retry on error, then generic placeholder
 * - Pass eager={true} for above-the-fold images
 */
const LazyImage = forwardRef(function LazyImage(
  { src, alt, className, style, eager = false, wrapperStyle, ...imgProps },
  forwardedRef
) {
  const [inView,  setInView]  = useState(eager);
  const [loaded,  setLoaded]  = useState(false);
  const [errored, setErrored] = useState(false);

  const wrapperRef  = useRef(null);
  const imgRef      = useRef(null);
  const retryRef    = useRef(0);

  // ── Intersection Observer ─────────────────────────────────────────────────
  useEffect(() => {
    if (eager) return;
    const el = wrapperRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: '500px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [eager]);

  // ── Reset on src change ───────────────────────────────────────────────────
  useEffect(() => {
    setLoaded(false);
    setErrored(false);
    retryRef.current = 0;
  }, [src]);

  // ── Error handler with 1 retry ────────────────────────────────────────────
  const handleError = () => {
    if (retryRef.current < 1) {
      retryRef.current++;
      const img = imgRef.current;
      if (img) {
        const s = img.src;
        img.src = '';
        setTimeout(() => { if (img) img.src = s; }, 800);
      }
    } else {
      setErrored(true);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="lazy-image-wrapper"
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', ...wrapperStyle }}
    >
      {/* Skeleton pulse */}
      {!loaded && !errored && <div className="lazy-skeleton" aria-hidden="true" />}

      {/* Image */}
      {inView && !errored && (
        <img
          ref={node => {
            imgRef.current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={className}
          style={{
            ...style,
            filter:     loaded ? 'blur(0px)' : 'blur(20px)',
            transition: 'filter 0.5s ease',
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            display:    'block',
          }}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          {...imgProps}
        />
      )}

      {/* Error placeholder */}
      {errored && (
        <div className="lazy-error-placeholder" aria-label={alt}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      )}
    </div>
  );
});

export default LazyImage;
