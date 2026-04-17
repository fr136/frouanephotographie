import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// ── Route → audio config ──────────────────────────────────────────────────────
const getAudioConfig = (pathname) => {
  if (pathname.includes('/collections/calanques') || pathname.includes('/collections/calanques-marseille')) {
    return {
      type: 'calanques',
      tracks: [
        { src: '/assets/sounds/waves.mp3',   baseVolume: 0.70 },
        { src: '/assets/sounds/cicadas.mp3', baseVolume: 0.30 },
      ],
    };
  }
  return null;
};

// ── SVG icons ─────────────────────────────────────────────────────────────────
const WaveIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M2 12 C4 9,6 9,8 12 S12 15,14 12 S18 9,20 12 S22 15,22 12" />
    <path d="M2 17 C4 14,6 14,8 17 S12 20,14 17 S18 14,20 17 S22 20,22 17" opacity="0.4"/>
  </svg>
);


const MuteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="1" y1="1" x2="23" y2="23"/>
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23"  x2="16" y2="23"/>
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
const AudioPlayer = () => {
  const location = useLocation();
  const config = getAudioConfig(location.pathname);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [volume, setVolume] = useState(() => {
    try { return parseFloat(localStorage.getItem('audio-volume') ?? '0.65'); } catch { return 0.65; }
  });

  const audiosRef    = useRef([]);
  const hoverTimeout = useRef(null);

  // ── Cleanup on route change ──────────────────────────────────────────────
  useEffect(() => {
    return () => {
      audiosRef.current.forEach(a => { a.pause(); a.src = ''; });
      audiosRef.current = [];
    };
  }, [location.pathname]);

  // Keep isPlaying=false on route change
  useEffect(() => {
    setIsPlaying(false);
  }, [location.pathname]);

  // ── Page Visibility API ──────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => {
      if (document.hidden) {
        audiosRef.current.forEach(a => a.pause());
      } else if (isPlaying) {
        audiosRef.current.forEach(a => a.play().catch(() => {}));
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [isPlaying]);

  // ── Volume sync ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (config) {
      audiosRef.current.forEach((a, i) => {
        a.volume = Math.max(0, Math.min(1, volume * (config.tracks[i]?.baseVolume ?? 1)));
      });
    }
    try { localStorage.setItem('audio-volume', String(volume)); } catch {}
  }, [volume, config]);

  // ── Toggle ───────────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    if (!config) return;

    if (isPlaying) {
      audiosRef.current.forEach(a => a.pause());
      setIsPlaying(false);
      return;
    }

    // Create audio objects if needed
    if (audiosRef.current.length === 0) {
      audiosRef.current = config.tracks.map(track => {
        const a = new Audio(track.src);
        a.loop    = true;
        a.volume  = Math.max(0, Math.min(1, volume * track.baseVolume));
        return a;
      });
    }

    Promise.all(audiosRef.current.map(a => a.play()))
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [config, isPlaying, volume]);

  // ── Hover helpers ────────────────────────────────────────────────────────
  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    setShowSlider(true);
  };
  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setShowSlider(false), 400);
  };

  // ── Don't render if no config for current page ───────────────────────────
  if (!config) return null;

  const Icon = WaveIcon;

  return (
    <div
      className="audio-player-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Vertical volume slider */}
      <div className={`audio-volume-panel ${showSlider ? 'visible' : ''}`}>
        <span className="audio-volume-label">{Math.round(volume * 100)}</span>
        <input
          className="audio-volume-input"
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          aria-label="Volume"
        />
      </div>

      {/* Main button */}
      <button
        className={`audio-player-btn ${isPlaying ? 'is-playing' : ''}`}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Couper l\'ambiance sonore' : 'Activer l\'ambiance sonore'}
        title={isPlaying ? 'Couper le son' : `Ambiance ${config.type === 'calanques' ? 'calanques' : 'coucher de soleil'}`}
      >
        {volume === 0 ? <MuteIcon /> : <Icon />}
        {isPlaying && <span className="audio-pulse-ring" />}
      </button>
    </div>
  );
};

export default AudioPlayer;
