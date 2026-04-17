import { useEffect, useRef } from 'react';

const useImageProtection = () => {
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    const showToast = () => {
      const existing = document.getElementById('fr-protection-toast');
      if (existing) existing.remove();
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

      const toast = document.createElement('div');
      toast.id = 'fr-protection-toast';
      toast.textContent = '© Frouane Photographie — Tous droits réservés';
      Object.assign(toast.style, {
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: '999999',
        padding: '12px 20px',
        background: 'rgba(10,10,10,0.88)',
        color: '#C9A961',
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        fontWeight: '500',
        letterSpacing: '0.06em',
        borderLeft: '2px solid #C9A961',
        backdropFilter: 'blur(12px)',
        opacity: '0',
        transition: 'opacity 0.25s ease',
        pointerEvents: 'none',
        userSelect: 'none',
      });
      document.body.appendChild(toast);

      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toastTimeoutRef.current = setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => { if (toast.parentNode) toast.remove(); }, 280);
        }, 2000);
      });
    };

    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG' && !e.target.closest('[data-allow-context]')) {
        e.preventDefault();
        showToast();
      }
    };

    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG' && !e.target.closest('[data-allow-context]')) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e) => {
      // Ctrl+S — save
      if (e.ctrlKey && !e.shiftKey && e.key === 's') {
        e.preventDefault();
        showToast();
        return;
      }
      // Ctrl+Shift+I — DevTools
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        return;
      }
      // F12 — DevTools
      if (e.key === 'F12') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);
};

export default useImageProtection;
