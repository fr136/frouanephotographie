import React, { useRef, useEffect } from 'react';
import '../styles/photography.css';

const HeroZoomEffect = ({ imageUrl, onComplete }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Animation CSS avec transitions
    const container = containerRef.current;
    
    // Démarrer zoomé
    container.style.transform = 'scale(3)';
    container.style.opacity = '0';
    
    // Fade in et dézoom progressif
    setTimeout(() => {
      container.style.transition = 'all 3s cubic-bezier(0.4, 0, 0.2, 1)';
      container.style.transform = 'scale(1)';
      container.style.opacity = '1';
    }, 100);
    
    // Fin de l'animation
    const timeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3200);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <div
        ref={containerRef}
        className="w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${imageUrl})`,
          willChange: 'transform, opacity'
        }}
      />
      
      {/* Overlay gradient pour texte */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-60"></div>
      
      {/* Texte qui apparaît progressivement */}
      <div className="absolute inset-0 flex items-end justify-center pb-20">
        <div className="text-center text-white animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
          <h2 className="font-display text-4xl md:text-6xl font-semibold mb-4">
            Immersion...
          </h2>
          <p className="text-lg text-gray-200">
            Préparez-vous à découvrir la beauté de la Méditerranée
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroZoomEffect;
