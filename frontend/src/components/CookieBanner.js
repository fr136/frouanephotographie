import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { initGA4 } from '../utils/analytics';

const STORAGE_KEY = 'cookie_consent';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!process.env.REACT_APP_GA4_ID) return;
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      setVisible(true);
    } else if (consent === 'accepted') {
      initGA4();
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    initGA4();
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem(STORAGE_KEY, 'refused');
    setVisible(false);
  };

  const param = () => setVisible(false);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#111827',
        color: '#fff',
        padding: '16px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 -2px 16px rgba(0,0,0,0.5)',
        borderTop: '1px solid #374151',
      }}
    >
      <p style={{ flex: '1 1 280px', fontSize: '0.875rem', margin: 0, color: '#d1d5db', lineHeight: 1.5 }}>
        Ce site utilise des cookies pour améliorer votre expérience. Vous pouvez accepter, refuser ou paramétrer vos préférences.
      </p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={accept}
          style={{
            padding: '8px 20px',
            backgroundColor: '#C9A961',
            color: '#fff',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
        >
          Accepter
        </button>
        <button
          onClick={refuse}
          style={{
            padding: '8px 20px',
            backgroundColor: 'transparent',
            color: '#9ca3af',
            border: '1px solid #4b5563',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
        >
          Refuser
        </button>
        <Link
          to="/politique-cookies"
          onClick={param}
          style={{
            padding: '8px 20px',
            backgroundColor: 'transparent',
            color: '#9ca3af',
            border: '1px solid #4b5563',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Paramétrer
        </Link>
      </div>
    </div>
  );
};

export default CookieBanner;
