import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { FadeInOnScroll } from './ScrollAnimations';

const EcologySection = () => {
  const facts = [
    {
      stat: '3 millions',
      label: 'de visiteurs par an dans les Calanques',
      source: 'Parc National des Calanques, 2023'
    },
    {
      stat: '20 000 ha',
      label: "d'espace protégé terre et mer",
      source: 'Parc National des Calanques'
    },
    {
      stat: '140+',
      label: 'espèces protégées recensées',
      source: 'IUCN Méditerranée'
    }
  ];

  const conseils = [
    {
      titre: 'Évitez les heures de pointe',
      description: "Entre juin et août, partez à l'aube ou en fin d'après-midi. Les locaux le savent : c'est là que la lumière est la plus belle, et qu'on a la calanque pour soi."
    },
    {
      titre: 'Restez sur les sentiers',
      description: "Les raccourcis abîment les sols fragiles. La garrigue met des décennies à se reconstituer. Et entre nous, les sentiers officiels offrent les plus beaux points de vue."
    },
    {
      titre: 'Remportez tout',
      description: "Même les peaux de fruits, même les mégots. Un mégot, c'est 500 litres d'eau polluée et 12 ans pour se décomposer. Ici, on laisse que des traces de pas."
    },
    {
      titre: 'Crème solaire minérale',
      description: "Les filtres chimiques (oxybenzone, octinoxate) détruisent les herbiers de posidonie. Ces herbiers, c'est 50% de l'oxygène de la Méditerranée. Pas rien, quoi."
    }
  ];

  return (
    <section className="py-24 bg-[#1a1a1a] text-white overflow-hidden">
      <div className="container-photo">
        {/* Header */}
        <FadeInOnScroll>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-[var(--color-gold)] text-sm uppercase tracking-widest mb-4">
              Engagement
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
              Préserver notre littoral
            </h2>
            <div className="w-16 h-0.5 bg-[var(--color-gold)] mx-auto mb-8"></div>
            <p className="text-gray-400 text-lg leading-relaxed">
              Ces paysages que je photographie, ce sont ceux où j'ai grandi. Entre les criques de Sormiou 
              et les falaises de La Ciotat, j'ai vu le surtourisme transformer nos coins secrets. 
              Aujourd'hui, photographier ces lieux, c'est aussi témoigner de leur fragilité.
            </p>
          </div>
        </FadeInOnScroll>

        {/* Stats */}
        <FadeInOnScroll delay={0.1}>
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {facts.map((fact, index) => (
              <motion.div
                key={index}
                className="text-center p-8 border border-white/10 rounded-sm hover:border-[var(--color-gold)]/30 transition-colors duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="font-display text-4xl md:text-5xl font-semibold text-[var(--color-gold)] mb-2">
                  {fact.stat}
                </div>
                <p className="text-white mb-2">{fact.label}</p>
                <p className="text-gray-500 text-xs italic">{fact.source}</p>
              </motion.div>
            ))}
          </div>
        </FadeInOnScroll>

        {/* Quote */}
        <FadeInOnScroll delay={0.2}>
          <div className="max-w-4xl mx-auto mb-20 px-8 py-12 border-l-2 border-[var(--color-gold)] bg-white/5">
            <p className="font-display text-2xl md:text-3xl italic text-white/90 mb-6">
              « Les Calanques, c'est pas un parc d'attractions. C'est un sanctuaire. 
              Chaque été, on ramasse des tonnes de déchets, on soigne des goélands mazoutés, 
              on replante des pins d'Alep. Venez, mais venez avec respect. »
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-0.5 bg-[var(--color-gold)]"></div>
              <p className="text-gray-400">
                Bénévole, Association des Calanques de Marseille
              </p>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Conseils */}
        <FadeInOnScroll delay={0.3}>
          <div className="mb-16">
            <h3 className="font-display text-2xl font-semibold text-center mb-12">
              Visiter en conscience
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {conseils.map((conseil, index) => (
                <motion.div
                  key={index}
                  className="p-6 bg-white/5 rounded-sm border border-white/5 hover:border-[var(--color-gold)]/20 transition-all duration-300"
                  whileHover={{ x: 5 }}
                >
                  <h4 className="font-display text-lg font-semibold text-white mb-3">
                    {conseil.titre}
                  </h4>
                  <p className="text-gray-400 leading-relaxed">
                    {conseil.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInOnScroll>

        {/* Sources & CTA */}
        <FadeInOnScroll delay={0.4}>
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
              <a 
                href="http://www.calanques-parcnational.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-gold)] transition-colors"
              >
                Parc National des Calanques <ExternalLink size={14} />
              </a>
              <a 
                href="https://www.mio.osupytheas.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-gold)] transition-colors"
              >
                Institut Méditerranéen d'Océanologie <ExternalLink size={14} />
              </a>
              <a 
                href="https://www.marseille.fr/environnement" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-gold)] transition-colors"
              >
                Ville de Marseille - Environnement <ExternalLink size={14} />
              </a>
            </div>
            
            <Link 
              to="/collections" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-black font-medium rounded-sm transition-all duration-300"
            >
              Découvrir les collections
              <ArrowRight size={18} />
            </Link>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default EcologySection;
