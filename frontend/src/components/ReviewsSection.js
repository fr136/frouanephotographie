import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, MessageSquareQuote, ShoppingBag } from "lucide-react";

const ReviewsSection = ({ email }) => {
  const reviewChannels = [
    {
      id: "buyers",
      title: "Avis d'acheteurs",
      icon: ShoppingBag,
      emptyState: "Aucun avis publié pour le moment.",
      detail:
        "Si vous avez commandé un tirage, vous pouvez envoyer un retour signé par email. Rien ne sera publié sans validation explicite.",
      cta: {
        type: "external",
        href: `mailto:${email}?subject=Avis%20sur%20un%20tirage`,
        label: "Laisser un avis d'acheteur",
      },
    },
    {
      id: "visitors",
      title: "Retours de visiteurs",
      icon: Compass,
      emptyState: "Soyez le premier à laisser un avis.",
      detail:
        "Les retours sur la navigation, la clarté du site ou la compréhension des collections passent pour l'instant par la page contact.",
      cta: {
        type: "internal",
        to: "/contact",
        label: "Partager un retour sur le site",
      },
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-photo">
        <div className="max-w-5xl mx-auto border-t border-[#e7decf] pt-10">
          <div className="max-w-2xl mb-10">
            <p className="text-[var(--color-gold)] text-xs uppercase tracking-[0.28em] mb-3">Retours</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-gray-900)] mb-4">
              Retours vérifiables, sans mise en scène
            </h2>
            <p className="text-[var(--color-gray-600)] leading-relaxed">
              Tant qu'aucun retour réel n'est publié, ce bloc reste volontairement discret. Aucun score, volume ou
              témoignage n'est simulé.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-5">
          {reviewChannels.map((channel) => {
            const Icon = channel.icon;

            return (
              <article
                key={channel.id}
                className="bg-[#fbf8f2] border border-[#ebe2d4] p-6 md:p-7"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="inline-flex items-center gap-3 text-[var(--color-gold)] mb-3">
                      <Icon size={18} />
                      <span className="text-[11px] uppercase tracking-[0.25em] font-semibold">Disponible plus tard</span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-[var(--color-gray-900)]">{channel.title}</h3>
                  </div>
                  <MessageSquareQuote size={20} className="text-[var(--color-gold)]/45" />
                </div>

                <p className="text-lg font-medium text-[var(--color-gray-900)] mb-3">{channel.emptyState}</p>
                <p className="text-[var(--color-gray-600)] leading-relaxed mb-6">{channel.detail}</p>

                {channel.cta.type === "external" ? (
                  <a
                    href={channel.cta.href}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gray-900)] hover:text-[var(--color-gold)] transition-colors"
                  >
                    {channel.cta.label}
                    <ArrowRight size={16} />
                  </a>
                ) : (
                  <Link
                    to={channel.cta.to}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gray-900)] hover:text-[var(--color-gold)] transition-colors"
                  >
                    {channel.cta.label}
                    <ArrowRight size={16} />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
