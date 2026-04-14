import React from 'react';
import { mockData } from '../mock';
import { Camera, Heart, Award, MapPin } from 'lucide-react';
import '../styles/photography.css';

const About = () => {
  const { photographer, services, faq } = mockData;

  // Carnets de voyage / Travel journals remplaçant l'ancien blog
  const travelJournals = [
    {
      id: 1,
      title_fr: 'Marseille & Calanques',
      title_en: 'Marseille & Calanques',
      desc_fr: 'Exploration des calanques sauvages aux eaux turquoise et falaises dorées. Ces criques secrètes offrent des panoramas uniques à quelques encablures de la ville.',
      desc_en: 'Exploring wild creeks with turquoise waters and golden cliffs. These hidden coves offer unique panoramas just a stone’s throw from the city.',
      image: 'https://images.unsplash.com/photo-1672861864274-6b24d19b578d'
    },
    {
      id: 2,
      title_fr: 'Cassis',
      title_en: 'Cassis',
      desc_fr: 'Village de pêcheurs niché au pied du Cap Canaille, Cassis mêle ports colorés et falaises vertigineuses. Chaque coucher de soleil y est une fête.',
      desc_en: 'A fishing village nestled beneath Cap Canaille, Cassis blends colourful harbours and dramatic cliffs. Every sunset is a celebration here.',
      image: 'https://images.unsplash.com/photo-1691325011849-de814c92dbbd'
    },
    {
      id: 3,
      title_fr: 'La Ciotat',
      title_en: 'La Ciotat',
      desc_fr: 'Entre vieille ville et calanques discrètes, La Ciotat révèle des paysages maritimes paisibles et des lumières dorées au crépuscule.',
      desc_en: 'Between the old town and quiet creeks, La Ciotat reveals peaceful seascapes and golden evening light.',
      image: 'https://images.unsplash.com/photo-1712103554238-aca4fda947df'
    },
    {
      id: 4,
      title_fr: 'Bandol',
      title_en: 'Bandol',
      desc_fr: 'Station balnéaire conviviale, Bandol est entourée de plages, de pinèdes et d’une mer aux reflets changeants. Un terrain de jeu idéal pour saisir l’essence du littoral varois.',
      desc_en: 'A friendly seaside resort, Bandol is surrounded by beaches, pine forests and a sea with shimmering hues. An ideal playground to capture the essence of the Var coast.',
      image: 'https://images.unsplash.com/photo-1712227609859-2818504d07cb'
    },
    {
      id: 5,
      title_fr: 'Sanary-sur-Mer',
      title_en: 'Sanary-sur-Mer',
      desc_fr: 'Port de carte postale, Sanary regorge de ruelles fleuries et de bateaux traditionnels. Ici, la Méditerranée se raconte à l’aube comme au crépuscule.',
      desc_en: 'A picture-postcard harbour, Sanary is full of flowered lanes and traditional boats. Here, the Mediterranean tells its story at dawn and dusk.',
      image: 'https://images.pexels.com/photos/34712669/pexels-photo-34712669.jpeg'
    },
    {
      id: 6,
      title_fr: 'Le Var côtier',
      title_en: 'The Var coast',
      desc_fr: 'De la route des Crêtes aux plages sauvages, le littoral varois offre une diversité de paysages où ciel et mer se rencontrent à l’infini.',
      desc_en: 'From the Route des Crêtes to wild beaches, the Var coastline offers a diversity of landscapes where sky and sea meet endlessly.',
      image: 'https://images.unsplash.com/photo-1627041193914-66f1cf8fbf4f'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-black text-white">
        <div className="container-photo text-center">
          <p className="section-subtitle text-white mb-4">L'Artiste</p>
          <h1 className="section-title text-white mb-6">{photographer.name}</h1>
          <div className="gold-line mx-auto"></div>
          <p className="body-large text-gray-300 max-w-3xl mx-auto mt-6">
            {photographer.tagline}
          </p>
        </div>
      </section>

      {/* Qui suis-je / Who am I */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="image-container aspect-[3/4] rounded-sm overflow-hidden order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1672861864274-6b24d19b578d"
                alt="Portrait of Franck Rouane"
                className="image-zoom"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="section-title mb-6">Qui suis‑je ? / Who am I?</h2>
              <div className="gold-line mb-6"></div>
              <p className="body-large mb-4">
                Photographe depuis l’enfance, ma passion est née de l’envie de capturer les paysages du quotidien pour les partager et les revivre.
                <br />
                Photographer since childhood, my passion was born from the desire to capture everyday landscapes, to share and relive them.
              </p>
              <p className="body-large mb-4">
                Basé à Marseille, je navigue régulièrement vers Cassis, La Ciotat, Bandol, Sanary et le Var pour photographier leurs paysages maritimes.
                <br />
                Based in Marseille, I regularly sail to Cassis, La Ciotat, Bandol, Sanary and the Var to photograph their seascapes.
              </p>
              <p className="body-large mb-4">
                Convaincu que la Méditerranée regorge d’endroits “pépites”, je préfère révéler ces trésors proches plutôt que de partir aux Maldives ou aux Seychelles.
                <br />
                Convinced that the Mediterranean is full of hidden gems, I prefer to reveal these nearby treasures rather than travel to the Maldives or Seychelles.
              </p>
              <p className="body-large">
                Mer de plusieurs continents et cultures, la Méditerranée est riche en histoire et en diversité de paysages que je m’attache à immortaliser.
                <br />
                The sea of many continents and cultures, the Mediterranean is rich in history and diverse landscapes that I strive to immortalize.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={20} className="text-[var(--color-gold)]" />
                    <span className="font-semibold">Localisation / Location</span>
                  </div>
                  <p className="caption">Marseille, Cassis, La Ciotat, Bandol, Sanary, Var</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Camera size={20} className="text-[var(--color-gold)]" />
                    <span className="font-semibold">Spécialité / Specialty</span>
                  </div>
                  <p className="caption">Photographie maritime &amp; paysages méditerranéens</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophie / Vision artistique */}
      <section className="section-spacing bg-gray-50">
        <div className="container-photo">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title mb-6">Ma philosophie / Vision artistique</h2>
            <div className="gold-line mx-auto mb-8"></div>
            <p className="body-large mb-4">
              Capturer des moments uniques : la puissance et la beauté de notre planète qui est devant nous chaque jour mais que l’on ne prend pas le temps d’admirer.
              <br />
              Capture unique moments: the power and beauty of our planet that is in front of us every day yet we rarely take the time to admire.
            </p>
            <p className="body-large mb-4">
              À travers mon objectif, je cherche à sensibiliser au respect de la Terre. L’humain ne respecte pas assez son environnement ; la photographie est un moyen d’alerter en montrant la beauté de ce que nous risquons de perdre.
              <br />
              Through my lens, I aim to raise awareness of respecting Earth. Humans do not respect their environment enough; photography is a way to warn by showing the beauty of what we risk losing.
            </p>
            <p className="body-large">
              Ma philosophie : partager ces images pour que les gens s’arrêtent, admirent, et peut‑être respectent davantage la nature.
              <br />
              My philosophy: sharing these images so people pause, admire, and perhaps respect nature more.
            </p>
          </div>
        </div>
      </section>

      {/* Mes terrains de jeu / My playgrounds */}
      <section className="section-spacing">
        <div className="container-photo">
          <h2 className="section-title text-center mb-12">Mes terrains de jeu / My playgrounds</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelJournals.map((spot) => (
              <article key={spot.id} className="photo-card group cursor-pointer">
                <div className="image-container aspect-[16/10]">
                  <img
                    src={spot.image}
                    alt={`${spot.title_fr} seascape`}
                    className="image-zoom"
                  />
                  <div className="image-overlay"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-[var(--color-gold)] transition-colors">
                    {spot.title_fr} / {spot.title_en}
                  </h3>
                  <p className="body-text text-sm mb-4">
                    {spot.desc_fr}
                    <br />
                    {spot.desc_en}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="text-center mb-16">
            <h2 className="section-title mb-6">Mes Services</h2>
            <div className="gold-line mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-gray-50 p-8 text-center hover:bg-white hover:shadow-lg transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-gold)] rounded-full mb-6">
                  {service.icon === 'image' && <Camera size={32} className="text-white" />}
                  {service.icon === 'palette' && <Heart size={32} className="text-white" />}
                  {service.icon === 'gallery-horizontal' && <Award size={32} className="text-white" />}
                </div>
                <h3 className="font-display text-xl font-semibold mb-4">{service.title}</h3>
                <p className="body-text">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-spacing bg-gray-50">
        <div className="container-photo">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title mb-6">Questions Fréquentes</h2>
              <div className="gold-line mx-auto"></div>
            </div>
            <div className="space-y-6">
              {faq.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-sm">
                  <h3 className="font-display text-lg font-semibold mb-3">{item.question}</h3>
                  <p className="body-text">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="bg-black text-white p-16 text-center rounded-sm">
            <h2 className="section-title text-white mb-6">Travaillons Ensemble</h2>
            <p className="body-large text-gray-300 mb-8 max-w-2xl mx-auto">
              Vous avez un projet photographique en tête ? Une commande spéciale ? N'hésitez pas à me contacter pour en discuter.
            </p>
            <a href="/contact" className="btn-gold">
              Me Contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
