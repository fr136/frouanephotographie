import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import '../styles/photography.css';

const GlobeZoomEffect = ({ onComplete, targetLocation = "calanques" }) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Configuration de la scène
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Création du globe terrestre
    const globeGeometry = new THREE.SphereGeometry(5, 64, 64);
    
    // Texture simplifiée de la Terre (couleurs)
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Fond océan
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a5490');
    gradient.addColorStop(0.5, '#2d7fc1');
    gradient.addColorStop(1, '#1a5490');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Continents (approximatifs pour la performance)
    ctx.fillStyle = '#6b8e4e';
    
    // Europe
    ctx.beginPath();
    ctx.ellipse(1100, 350, 200, 150, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Afrique du Nord
    ctx.beginPath();
    ctx.ellipse(1050, 550, 250, 200, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Côtes méditerranéennes
    ctx.fillStyle = '#8fbc8f';
    ctx.fillRect(1000, 400, 300, 80);
    
    // Point rouge pour Marseille/Calanques
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(1080, 420, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Créer la texture
    const texture = new THREE.CanvasTexture(canvas);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 20,
      emissive: new THREE.Color(0x112244),
      emissiveIntensity: 0.1
    });
    
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    // Étoiles en arrière-plan
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Position initiale de la caméra (vue depuis l'espace)
    camera.position.z = 15;
    camera.position.y = 2;

    // Animation du zoom
    let animationProgress = 0;
    const animationDuration = 4000; // 4 secondes
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      animationProgress = Math.min(elapsed / animationDuration, 1);
      
      // Fonction d'easing pour un mouvement fluide
      const easeInOutCubic = (t) => 
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const easedProgress = easeInOutCubic(animationProgress);
      
      // Rotation du globe pour orienter vers la Méditerranée
      globe.rotation.y = -0.2 + easedProgress * 0.3;
      globe.rotation.x = 0.1 - easedProgress * 0.15;

      // Zoom de la caméra
      camera.position.z = 15 - easedProgress * 14.5; // De 15 à 0.5
      camera.position.y = 2 - easedProgress * 1.8;    // De 2 à 0.2
      camera.position.x = easedProgress * 0.3;       // Légère translation

      // Rotation subtile des étoiles
      stars.rotation.y += 0.0002;

      // Mise à jour du progress pour l'UI
      setProgress(Math.floor(animationProgress * 100));

      renderer.render(scene, camera);

      if (animationProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation terminée
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    };

    animate();

    // Gestion du redimensionnement
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      globeGeometry.dispose();
      globeMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Overlay avec texte */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center text-white">
          <h2 className="text-5xl font-display font-semibold mb-4 fade-in">
            Voyage vers la Méditerranée
          </h2>
          <p className="text-xl text-gray-300 fade-in" style={{ animationDelay: '0.3s' }}>
            De l'espace aux Calanques de Marseille
          </p>
          <div className="mt-8 fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="inline-block px-6 py-2 border border-[var(--color-gold)] text-[var(--color-gold)] rounded-full">
              {progress}% - En approche...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeZoomEffect;
