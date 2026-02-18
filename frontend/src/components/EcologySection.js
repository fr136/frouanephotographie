import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, AlertTriangle, Heart, ArrowRight, Globe, Users, Fish } from 'lucide-react';
import { FadeInOnScroll, StaggerContainer, StaggerItem } from './ScrollAnimations';

const EcologySection = () => {
  const stats = [
    { icon: Users, label: 'Trois millions de visiteurs par an dans les calanques', color: 'text-orange-500' },
    { icon: Fish,  label: 'La Méditerranée est l’un des bassins marins les plus exploités au monde : environ 60 % de ses stocks de poissons sont surexploités', color: 'text-blue-500' },
    { icon: Globe, label: "La Méditerranée change. Le niveau de la mer monte, sa température moyenne augmente, et l’équilibre qui façonnait ses paysages se transforme.", color: 'text-cyan-500' },
  ];

  const actions = [
    {
      icon: '🌅',
      title: 'Hors-saison',
      description: 'Au printemps et en arrière-saison, la fréquentation diminue. La lumière gagne en douceur. L’expérience change.'
    },
    {
      icon: '🗑️',
      title: 'Zéro déchet',
      description: 'Même un déchet organique met du temps à disparaître. Une peau de fruit peut rester visible des mois.'
    },
    {
      icon: '☀️',
      title: 'Crème solaire ',
      description: 'Privilégier des formules à faible impact limite la pression sur le milieu marin.'
    },
    {
      icon: '🤫',
      title: 'Respect du silence',
      description: "Dans les calanques, le silence n’est pas décoratif :il fait partie de l’équilibre."
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
              Préserver la Méditerranée
            </h2>
            <div className="gold-line mx-auto"></div>
            <p className="body-large text-gray-300 max-w-3xl mx-auto mt-6">
              Derrière chaque image, il y a un lieu réel. Falaises, garrigue, herbiers marins. Ces paysages évoluent. La fréquentation, les déchets et la pression humaine laissent des traces visibles.
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
                <h3 className="text-xl font-semibold text-white mb-2">Ces lieux évoluent sous la pression de la fréquentation.</h3>
                <p className="text-gray-300">
                  De Marseille à la Côte d’Azur, le littoral attire chaque année des millions de visiteurs. À long terme, la répétition des passages transforme les lieux, parfois discrètement.
                  <strong className="text-amber-400"> Des gestes simples font la différence.</strong>
                </p>
              </div>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Actions */}
        <FadeInOnScroll delay={0.3}>
          <h3 className="text-2xl font-display font-semibold text-center text-white mb-8">
            4 repères simples
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
             Dans chaque collection, des repères pour mieux comprendre ces paysages.
            </p>
            <Link 
              to="/collections" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-sm transition-all duration-300 group"
            >
              <Heart className="w-5 h-5" />
              Explorer les collections
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default EcologySection;
