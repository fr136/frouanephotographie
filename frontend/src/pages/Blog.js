import React from 'react';
import { Link } from 'react-router-dom';
import { mockData } from '../mock';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import '../styles/photography.css';

const Blog = () => {
  const { blogPosts } = mockData;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-black text-white">
        <div className="container-photo text-center">
          <p className="section-subtitle text-white mb-4">Blog</p>
          <h1 className="section-title text-white mb-6">Articles & Carnets de Route</h1>
          <div className="gold-line mx-auto"></div>
          <p className="body-large text-gray-300 max-w-3xl mx-auto mt-6">
            Découvrez mes réflexions, conseils techniques et histoires derrière les images. Un carnet de bord photographique de mes explorations maritimes.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="image-container aspect-[4/3] rounded-sm overflow-hidden">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="image-zoom"
              />
            </div>
            <div>
              <span className="inline-block px-4 py-1 bg-[var(--color-gold)] text-white text-xs font-semibold uppercase tracking-wider mb-4">
                Article À la Une
              </span>
              <h2 className="font-display text-3xl font-semibold mb-4">{blogPosts[0].title}</h2>
              <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(blogPosts[0].date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {blogPosts[0].readTime}
                </span>
              </div>
              <p className="body-large mb-6">{blogPosts[0].excerpt}</p>
              <button className="btn-primary inline-flex items-center gap-2">
                Lire l'Article
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="section-spacing bg-gray-50">
        <div className="container-photo">
          <h2 className="section-title text-center mb-12">Tous les Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="photo-card group cursor-pointer">
                <div className="image-container aspect-[16/10]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="image-zoom"
                  />
                  <div className="image-overlay"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wider mb-3">
                    {post.category}
                  </span>
                  <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-[var(--color-gold)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="body-text text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <span className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(post.date).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-spacing">
        <div className="container-photo">
          <div className="bg-black text-white p-16 text-center rounded-sm">
            <h2 className="section-title text-white mb-4">Restez Connecté</h2>
            <p className="body-large text-gray-300 mb-8 max-w-2xl mx-auto">
              Inscrivez-vous à ma newsletter pour recevoir mes derniers articles, conseils photo et nouvelles collections.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-6 py-3 text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
              />
              <button type="submit" className="btn-gold whitespace-nowrap">
                S'Inscrire
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
