import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { FadeInOnScroll } from "./ScrollAnimations";

const EcologySection = () => {
  const fieldNotes = [
    {
      title: "Sentiers fragilisés",
      description:
        "Dans les Calanques, les passages répétés élargissent les sentiers, tassent les sols et marquent durablement les zones sèches.",
    },
    {
      title: "Déchets visibles",
      description:
        "Mégots, canettes, plastiques et restes de pique-nique finissent souvent sur les plages, dans les anses ou en bord de mer.",
    },
    {
      title: "Pression touristique",
      description:
        "Aux heures de forte fréquentation, certains accès deviennent saturés. La beauté du lieu attire, mais elle augmente aussi la pression sur les espaces naturels.",
    },
    {
      title: "Milieu marin vulnérable",
      description:
        "Depuis le rivage, tout paraît stable. Pourtant, déchets flottants, rejets et usages répétés fragilisent les zones côtières.",
    },
  ];

  return (
    <section className="py-24 bg-[#f3eee6] text-[var(--color-gray-900)] overflow-hidden">
      <div className="container-photo">
        <FadeInOnScroll>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-[var(--color-gold)] text-sm uppercase tracking-[0.3em] mb-4">Regard local</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
              Montrer la beauté, sans oublier la fragilité
            </h2>
            <div className="w-16 h-0.5 bg-[var(--color-gold)] mx-auto mb-8" />
            <p className="text-[var(--color-gray-700)] text-lg leading-relaxed">
              Quand je photographie Marseille, les Calanques ou le littoral méditerranéen, je cherche la lumière, les
              lignes et le calme. Mais ces paysages restent fragiles. Déchets, sentiers abîmés, pression touristique et
              accès saturés font aussi partie du réel. Montrer la beauté du littoral, c'est aussi rappeler ce qui menace
              son équilibre.
            </p>
          </div>
        </FadeInOnScroll>

        <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
          <FadeInOnScroll delay={0.1}>
            <div className="bg-white border border-[#e6ddcf] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3 text-[var(--color-gold)] mb-6">
                <MapPin size={18} />
                <span className="text-xs uppercase tracking-[0.28em]">Marseille • Calanques • Littoral méditerranéen</span>
              </div>

              <p className="font-display text-3xl md:text-4xl leading-tight text-[var(--color-gray-900)] mb-8">
                La photographie garde la trace d'un lieu, y compris quand ce lieu commence à s'abîmer.
              </p>

              <div className="grid md:grid-cols-2 gap-5">
                {fieldNotes.map((note) => (
                  <article key={note.title} className="border border-[#ebe4d7] bg-[#fcfaf6] p-6">
                    <h3 className="font-display text-xl text-[var(--color-gray-900)] mb-3">{note.title}</h3>
                    <p className="text-[var(--color-gray-600)] leading-relaxed">{note.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.2}>
            <article className="relative min-h-[480px] overflow-hidden border border-[#e6ddcf] shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/ecologie/plage-marseille-dechets.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                <p className="text-[var(--color-gold)] text-xs uppercase tracking-[0.28em] mb-3">Plage de Marseille</p>
                <h3 className="font-display text-3xl font-semibold mb-3">Marseille</h3>
                <p className="text-white/85 max-w-md">
                  Une image agréable ne doit pas effacer ce qui se trouve autour du cadre. Sur certaines plages
                  marseillaises, les déchets rappellent que le littoral reste fragile, même lorsqu'il paraît calme au
                  loin.
                </p>
              </div>
            </article>
          </FadeInOnScroll>
        </div>

        <FadeInOnScroll delay={0.3}>
          <div className="mt-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-t border-[#e1d7c7] pt-8">
            <p className="text-[var(--color-gray-600)] max-w-3xl">
              Ici, la photographie ne sert pas seulement à montrer un paysage méditerranéen réussi. Elle peut aussi
              témoigner de ce qui change, de ce qui se fragilise et de ce qui mérite encore d'être regardé avec soin.
            </p>
            <Link
              to="/collections"
              className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gray-900)] hover:text-[var(--color-gold)] transition-colors"
            >
              Explorer les collections
              <ArrowRight size={18} />
            </Link>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default EcologySection;
