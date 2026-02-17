import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// Composant pour animation au scroll avec fade-in
export const FadeInOnScroll = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const directionVariants = {
    up: { y: 60 },
    down: { y: -60 },
    left: { x: 60 },
    right: { x: -60 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionVariants[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour effet parallax sur les images
export const ParallaxImage = ({ src, alt, className = '', speed = 0.5 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 30}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

// Composant pour révéler le texte lettre par lettre
export const TextReveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const text = typeof children === 'string' ? children : '';

  return (
    <span ref={ref} className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: delay + index * 0.03,
            ease: 'easeOut'
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

// Composant pour animation de scale au scroll
export const ScaleOnScroll = ({ children, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour effet de masque qui se révèle
export const MaskReveal = ({ children, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Composant pour stagger animation sur une liste
export const StaggerContainer = ({ children, className = '', staggerDelay = 0.1 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour effet Ken Burns sur les images
export const KenBurnsImage = ({ src, alt, className = '', duration = 20 }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        animate={{
          scale: [1, 1.15, 1],
          x: ['0%', '2%', '0%'],
          y: ['0%', '-2%', '0%']
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};

// Composant pour le scroll horizontal immersif
export const HorizontalScroll = ({ children, className = '' }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  return (
    <section ref={targetRef} className={`relative h-[300vh] ${className}`}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8">
          {children}
        </motion.div>
      </div>
    </section>
  );
};

// Hook personnalisé pour utiliser le scroll progress
export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    ...options
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return { ref, scrollYProgress, smoothProgress };
};

export default {
  FadeInOnScroll,
  ParallaxImage,
  TextReveal,
  ScaleOnScroll,
  MaskReveal,
  StaggerContainer,
  StaggerItem,
  KenBurnsImage,
  HorizontalScroll,
  useScrollAnimation
};
