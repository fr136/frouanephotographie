import React from 'react';
import { AlertTriangle, Heart, Leaf, Info, CheckCircle, XCircle } from 'lucide-react';

const EcologyContent = ({ ecology, anecdote, story, photographyTips, bestPeriods, practicalInfo }) => {
  if (!ecology) return null;

  return (
    <div className="space-y-12">
      {/* Anecdote */}
      {anecdote && (
        <section className="bg-gray-50 p-8 rounded-lg">
          <div className="flex items-start gap-4">
            <Info className="text-[var(--color-gold)] flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-display text-2xl font-semibold mb-4">Le saviez-vous ?</h3>
              <p className="body-text leading-relaxed">{anecdote}</p>
            </div>
          </div>
        </section>
      )}

      {/* Histoire personnelle */}
      {story && (
        <section className="border-l-4 border-[var(--color-gold)] pl-8 py-4">
          <h3 className="font-display text-2xl font-semibold mb-4">Histoire d'une photo</h3>
          <p className="body-text italic leading-relaxed text-gray-700">{story}</p>
        </section>
      )}

      {/* Conseils photo */}
      {photographyTips && photographyTips.length > 0 && (
        <section className="bg-black text-white p-8 rounded-lg">
          <h3 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
            📸 Conseils Photographiques
          </h3>
          <ul className="space-y-3">
            {photographyTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-[var(--color-gold)] mt-1">▸</span>
                <span className="body-text">{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Espèces protégées */}
      {ecology.protectedSpecies && ecology.protectedSpecies.length > 0 && (
        <section>
          <h3 className="font-display text-3xl font-semibold mb-6 flex items-center gap-3">
            <Leaf className="text-green-600" size={32} />
            Espèces Protégées à Préserver
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {ecology.protectedSpecies.map((species, idx) => (
              <div key={idx} className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-green-500">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{species.icon}</span>
                  <div>
                    <h4 className="font-display text-xl font-semibold mb-2">{species.name}</h4>
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full mb-3">
                      {species.status}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">{species.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Menaces */}
      {ecology.threats && ecology.threats.length > 0 && (
        <section>
          <h3 className="font-display text-3xl font-semibold mb-6 flex items-center gap-3 text-red-600">
            <AlertTriangle size={32} />
            Menaces sur l'Écosystème
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {ecology.threats.map((threat, idx) => (
              <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{threat.icon}</span>
                  <div>
                    <h4 className="font-display text-lg font-semibold mb-2">{threat.title}</h4>
                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full mb-3">
                      {threat.impact}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">{threat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Règles de respect */}
      {ecology.respectGuidelines && ecology.respectGuidelines.length > 0 && (
        <section className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-lg">
          <h3 className="font-display text-3xl font-semibold mb-6 flex items-center gap-3">
            <Heart className="text-[var(--color-gold)]" size={32} />
            Comment Respecter ce Lieu Fragile
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {ecology.respectGuidelines.map((rule, idx) => {
              const isPositive = rule.startsWith('✅');
              return (
                <div key={idx} className={`flex items-start gap-3 p-4 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                  {isPositive ? (
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  ) : (
                    <XCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                  )}
                  <span className="text-sm font-medium">{rule.replace(/^[✅❌]\s*/, '')}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Actions positives */}
      {ecology.positiveActions && ecology.positiveActions.length > 0 && (
        <section className="bg-[var(--color-gold)] bg-opacity-10 p-8 rounded-lg border-2 border-[var(--color-gold)]">
          <h3 className="font-display text-3xl font-semibold mb-6">💚 Agissez pour Protéger</h3>
          <ul className="space-y-3">
            {ecology.positiveActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-[var(--color-gold)] text-xl">→</span>
                <span className="body-text font-medium">{action}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Meilleures périodes */}
      {bestPeriods && (
        <section className="bg-gray-100 p-6 rounded-lg">
          <h4 className="font-display text-xl font-semibold mb-4">📅 Meilleures Périodes</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            {bestPeriods.ideal && (
              <div>
                <span className="font-semibold text-green-600">Idéal:</span>
                <p>{bestPeriods.ideal}</p>
              </div>
            )}
            {bestPeriods.avoid && (
              <div>
                <span className="font-semibold text-red-600">À éviter:</span>
                <p>{bestPeriods.avoid}</p>
              </div>
            )}
            {bestPeriods.photography && (
              <div>
                <span className="font-semibold text-blue-600">Photo:</span>
                <p>{bestPeriods.photography}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Infos pratiques */}
      {practicalInfo && (
        <section className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-display text-xl font-semibold mb-4">ℹ️ Informations Pratiques</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {Object.entries(practicalInfo).map(([key, value]) => (
              <div key={key}>
                <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default EcologyContent;
