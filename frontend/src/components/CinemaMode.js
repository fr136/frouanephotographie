import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

// Ambient music URL (royalty-free sunset/chill music)
const AMBIENT_MUSIC_URL = 'https://cdn.pixabay.com/audio/2022/10/25/audio_052b1ad58b.mp3';

const CinemaMode = ({ photos, isOpen, onClose, startIndex = 0, collectionTitle = 'Collection' }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const slideIntervalRef = useRef(null);

  const SLIDE_DURATION = 6000; // 6 seconds per photo

  // Initialize audio
  useEffect(() => {
    if (isOpen) {
      audioRef.current = new Audio(AMBIENT_MUSIC_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      
      if (!isMuted) {
        audioRef.current.play().catch(() => {
          // Autoplay blocked, mute by default
          setIsMuted(true);
        });
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle mute toggle
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [isMuted]);

  // Auto-advance slides
  useEffect(() => {
    if (isOpen && isPlaying) {
      setProgress(0);
      
      // Progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 0;
          return prev + (100 / (SLIDE_DURATION / 100));
        });
      }, 100);

      // Slide change
      slideIntervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % photos.length);
        setProgress(0);
      }, SLIDE_DURATION);

      return () => {
        clearInterval(progressInterval);
        clearInterval(slideIntervalRef.current);
      };
    }
  }, [isOpen, isPlaying, currentIndex, photos.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'm':
          setIsMuted(prev => !prev);
          break;
        case 'f':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Hide controls after inactivity
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    if (isOpen) {
      resetControlsTimeout();
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isOpen, resetControlsTimeout]);

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % photos.length);
    setProgress(0);
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
    setProgress(0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black"
        onMouseMove={resetControlsTimeout}
        onClick={resetControlsTimeout}
      >
        {/* Background Image with Ken Burns effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { duration: 1.5, ease: 'easeOut' }
            }}
            exit={{ 
              opacity: 0,
              transition: { duration: 1, ease: 'easeIn' }
            }}
            className="absolute inset-0"
          >
            <motion.img
              src={currentPhoto?.imageUrl}
              alt={currentPhoto?.title}
              className="w-full h-full object-cover"
              animate={{
                scale: [1, 1.08],
              }}
              transition={{
                duration: SLIDE_DURATION / 1000,
                ease: 'linear',
              }}
            />
            {/* Vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Photo Info */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-32 left-0 right-0 text-center px-8"
            >
              <motion.h2
                key={currentPhoto?.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-3xl md:text-5xl font-display font-semibold mb-3"
              >
                {currentPhoto?.title}
              </motion.h2>
              <p className="text-white/60 text-sm uppercase tracking-widest">
                {currentIndex + 1} / {photos.length}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="absolute bottom-20 left-8 right-8">
          <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          {/* Photo thumbnails progress */}
          <div className="flex justify-center gap-1.5 mt-3">
            {photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setProgress(0);
                }}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-8 bg-white' 
                    : idx < currentIndex 
                      ? 'w-2 bg-white/50' 
                      : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4"
            >
              {/* Previous */}
              <button
                onClick={goToPrev}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                aria-label="Photo précédente"
              >
                <SkipBack size={20} />
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(prev => !prev)}
                className="p-4 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              {/* Next */}
              <button
                onClick={goToNext}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                aria-label="Photo suivante"
              >
                <SkipForward size={20} />
              </button>

              {/* Separator */}
              <div className="w-px h-8 bg-white/20 mx-2" />

              {/* Mute */}
              <button
                onClick={() => setIsMuted(prev => !prev)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                aria-label="Plein écran"
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close button */}
        <AnimatePresence>
          {showControls && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              aria-label="Fermer"
            >
              <X size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Title */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-6 left-6"
            >
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Mode Cinéma</p>
              <h3 className="text-white text-lg font-display">{collectionTitle}</h3>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard hints */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-4 text-white/40 text-xs"
            >
              <span>ESPACE pause</span>
              <span>← → navigation</span>
              <span>M son</span>
              <span>F plein écran</span>
              <span>ESC quitter</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default CinemaMode;
