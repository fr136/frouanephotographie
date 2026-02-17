import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, AlertTriangle, Heart, ArrowRight, Globe, Users, Fish } from 'lucide-react';
import { FadeInOnScroll, StaggerContainer, StaggerItem } from './ScrollAnimations';

const EcologySection = () => {
  const stats = [
    { icon: Users, value: '2M+', label: 'visiteurs/an dans les Calanques', color: 'text-orange-500' },
    { icon: Fish, value: '25%', label: 'de la biodiversité marine menacée', color: 'text-blue-500' },
    { icon: Globe, value: '+20cm', label: "montée des eaux depuis 1900", color: 'text-cyan-500' },
  ];

  const actions = [
    {
      icon: '🌅',
      title: 'Visitez hors-saison',
      description: 'Avril-mai et septembre-octobre : moins de monde, plus de magie'
    },
    {
      icon: '🗑️',
      title: 'Zéro déchet',
      description: 'Ramenez tout, même les pelures de fruits (2 ans de décomposition)'
    },
    {
      icon: '☀️',
      title: 'Crème solaire minérale',
      description: 'Les filtres chimiques détruisent les herbiers de posidonie'
    },
    {
      icon: '🤫',
      title: 'Respect du silence',
      description: "Les oiseaux nicheurs sont très sensibles au bruit"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-photo relative z-10">
        {/* Header */}
        <FadeInOnScroll>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full mb-6">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium uppercase tracking-wider">
                Sensibilisation
              </span>
            </div>
            <h2 className="section-title text-white mb-6">
              Protégeons la Méditerranée
            </h2>
            <div className="gold-line mx-auto"></div>
            <p className="body-large text-gray-300 max-w-3xl mx-auto mt-6">
              Derrière chaque photo se cache un écosystème fragile. Le surtourisme, la pollution 
              et le changement climatique menacent ces paysages que nous aimons tant.
            </p>
          </div>
        </FadeInOnScroll>

        {/* Stats */}
        <StaggerContainer className="grid md:grid-cols-3 gap-8 mb-16" staggerDelay={0.15}>
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-[var(--color-gold)]/50 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <stat.icon className={`w-10 h-10 mx-auto mb-4 ${stat.color}`} />
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Alert box */}
        <FadeInOnScroll delay={0.2}>
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-6 mb-16">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Le surtourisme : une menace réelle</h3>
                <p className="text-gray-300">
                  Les Calanques reçoivent plus de 2 millions de visiteurs par an. Érosion des sentiers, 
                  dérangement de la faune, pollution... Chaque visite laisse une trace. 
                  <strong className="text-amber-400"> Ensemble, adoptons des comportements responsables.</strong>
                </p>
              </div>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Actions */}
        <FadeInOnScroll delay={0.3}>
          <h3 className="text-2xl font-display font-semibold text-center text-white mb-8">
            4 gestes simples pour préserver ces lieux
          </h3>
        </FadeInOnScroll>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" staggerDelay={0.1}>
          {actions.map((action, index) => (
            <StaggerItem key={index}>
              <motion.div 
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 h-full hover:bg-white/10 transition-all duration-300"
                whileHover={{ y: -3 }}
              >
                <div className="text-4xl mb-4">{action.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">{action.title}</h4>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <FadeInOnScroll delay={0.4}>
          <div className="text-center">
            <p className="text-gray-300 mb-6">
              Découvrez dans chaque collection les enjeux écologiques spécifiques et les bonnes pratiques à adopter.
            </p>
            <Link 
              to="/collections" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-sm transition-all duration-300 group"
            >
              <Heart className="w-5 h-5" />
              Explorer les collections avec conscience
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default EcologySection;
