import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Camera, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { collectionsAPI } from "../services/api";
import { mockData } from "../mock";
import { FadeInOnScroll, StaggerContainer, StaggerItem } from "../components/ScrollAnimations";
import CollectionsPreview from "../components/CollectionsPreview";
import EcologySection from "../components/EcologySection";
import InteractiveMap, { MapButton } from "../components/InteractiveMap";
import SEOHead from "../components/SEOHead";
import "../styles/photography.css";

const Home = () => {
  const { photographer } = mockData;
  const [collections, setCollections] = useState([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    collectionsAPI.getAll().then((data) => {
      setCollections(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  return (
    <div className="bg-white">
      <SEOHead
        title="Accueil"
        description="Photographe professionnel basé à Marseille, spécialisé dans les paysages méditerranéens, les Calanques et le littoral sud. Tirages d'art en édition limitée."
        url="/"
      />

      <section
        className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-0"
        style={{
          backgroundImage: "url('/sunrise-laciotat.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <motion.div
          className="relative z-10 text-center px-4 max-w-md sm:max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.p
            className="text-[var(--color-gold)] text-sm uppercase tracking-[0.35em] mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            Marseille • Calanques • Littoral sud
          </motion.p>
          <motion.h1
            className="hero-title mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Photographies du littoral méditerranéen
          </motion.h1>
          <motion.p
            className="text-white text-xl md:text-2xl font-light mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {photographer.tagline}. Tirages d'art en édition limitée, depuis Marseille jusqu'au littoral varois.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link to="/collections" className="btn-gold w-full sm:w-auto">
              Découvrir les collections
            </Link>
            <Link
              to="/boutique"
              className="btn-outline w-full sm:w-auto"
              style={{ borderColor: "white", color: "white" }}
            >
              Voir la boutique
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, y: { repeat: Infinity, duration: 2 } }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </div>
        </motion.div>
      </section>

      <section className="section-spacing">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeInOnScroll direction="left">
              <p className="section-subtitle mb-4">Ancrage local</p>
              <h2 className="section-title mb-6">Photographies de la Méditerranée vues depuis Marseille</h2>
              <div className="gold-line" />
              <p className="body-large mb-6">{photographer.bio}</p>
              <Link to="/a-propos" className="btn-outline inline-flex items-center gap-2">
                En savoir plus
                <ArrowRight size={18} />
              </Link>
            </FadeInOnScroll>
            <FadeInOnScroll direction="right" delay={0.2}>
              <div className="image-container aspect-[4/5] rounded-sm overflow-hidden">
                <img src="/Salon-sormiou.png" alt="Intérieur sobre avec un tirage face à Sormiou" className="image-zoom" />
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      <CollectionsPreview collections={collections} />

      <EcologySection />


      <section className="section-spacing bg-black text-white">
        <div className="container-photo">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="section-title text-white mb-6">Format, papier, édition</h2>
              <div className="gold-line mx-auto" />
            </div>
          </FadeInOnScroll>

          <StaggerContainer className="grid md:grid-cols-3 gap-12" staggerDelay={0.15}>
            <StaggerItem>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] rounded-full mb-6">
                  <Award size={32} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">Qualité muséale</h3>
                <p className="text-gray-400">
                  Tous mes tirages sont réalisés sur papier Fine Art de qualité professionnelle, avec un rendu pensé
                  pour durer.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] rounded-full mb-6">
                  <Camera size={32} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">Sélection resserrée</h3>
                <p className="text-gray-400">
                  Chaque photographie mise en vente reste choisie avec retenue pour conserver une proposition lisible
                  et cohérente.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] rounded-full mb-6">
                  <Heart size={32} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">Ancrage réel</h3>
                <p className="text-gray-400">
                  Les images ne racontent pas une Méditerranée fantasmée. Elles restent liées à des lieux, des lumières
                  et des usages réellement observés.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <section
        className="relative py-32"
        style={{
          backgroundImage: "url('/Calanques/Cover.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 container-photo text-center text-white">
          <h2 className="section-title text-white mb-6">Explorer les tirages disponibles</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Parcourez une sélection resserrée de photographies du littoral méditerranéen, prêtes à rejoindre un
            intérieur sobre et lumineux.
          </p>
          <Link to="/boutique" className="btn-gold">
            Découvrir la boutique
          </Link>
        </div>
      </section>

      <MapButton onClick={() => setShowMap(true)} />
      <InteractiveMap isOpen={showMap} onClose={() => setShowMap(false)} />
    </div>
  );
};

export default Home;
