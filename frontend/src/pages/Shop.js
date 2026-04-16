import React, { useState } from 'react';
import { ShoppingCart, Eye, Heart, X, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { checkoutAPI } from '../services/api';
import SEOHead from '../components/SEOHead';
import { toast } from '../hooks/use-toast';
import printAssetCatalog from '../data/printAssetCatalog.json';
import { getPhotoTitleFromPath } from '../data/photoTitles';
import '../styles/photography.css';

// Produits basés sur vos vraies photos
const baseShopProducts = [
  // CALANQUES
  {
    id: 'cal-001',
    title: 'Sormiou - Vue Panoramique',
    category: 'calanques',
    location: 'Calanque de Sormiou, Marseille',
    image: '/Calanques/Calanque Sormiou 2.webp',
    description: 'Vue panoramique sur la calanque de Sormiou, joyau des calanques marseillaises. Les eaux turquoise contrastent avec les falaises calcaires.',
    price: 150,
    sizes: ['30x45 cm', '50x75 cm', '70x105 cm'],
    edition: 'Édition limitée 1/25',
    featured: true
  },
  {
    id: 'cal-002',
    title: 'Port de Cassis',
    category: 'calanques',
    location: 'Cassis, Bouches-du-Rhône',
    image: '/Calanques/Port de cassis.webp',
    description: 'Le pittoresque port de Cassis au petit matin, quand les pêcheurs préparent leurs filets.',
    price: 120,
    sizes: ['30x45 cm', '50x75 cm', '70x105 cm'],
    edition: 'Édition limitée 1/25'
  },
  {
    id: 'cal-003',
    title: 'Calanque des Anglais',
    category: 'calanques',
    location: 'Calanque des Anglais, Marseille',
    image: '/Calanques/Calanque des anglais.webp',
    description: "Une crique secrète aux eaux cristallines, accessible uniquement à pied. L'essence même de la Méditerranée sauvage.",
    price: 130,
    sizes: ['30x45 cm', '50x75 cm', '70x105 cm'],
    edition: 'Édition limitée 1/25'
  },
  {
    id: 'cal-004',
    title: "Port d'Alon",
    category: 'calanques',
    location: 'Saint-Cyr-sur-Mer',
    image: '/Calanques/Calanque Port d\'alon Saint Cyr sur mer.webp',
    description: 'La calanque de Port d\'Alon, entre pins et rochers, offre un panorama exceptionnel sur la côte.',
    price: 140,
    sizes: ['30x45 cm', '50x75 cm', '70x105 cm'],
    edition: 'Édition limitée 1/25'
  },
  {
    id: 'cal-005',
    title: 'Sormiou au Crépuscule',
    category: 'calanques',
    location: 'Calanque de Sormiou, Marseille',
    image: '/Calanques/Sormiou.webp',
    description: 'Les dernières lueurs du jour embrasent les falaises de Sormiou dans une symphonie de couleurs.',
    price: 160,
    sizes: ['30x45 cm', '50x75 cm', '70x105 cm'],
    edition: 'Édition limitée 1/20',
    featured: true
  },
  {
    id: 'cal-006',
    title: 'Calanque Agay',
    category: 'calanques',
    location: 'Agay, Var',
    image: '/Calanques/Calanque-agay.webp',
    description: 'Les roches rouges d\'Agay plongent dans les eaux bleu intense de la Méditerranée.',
    price: 130,
    sizes: ['30x45 cm', '50x75 cm', '70x105 cm'],
    edition: 'Édition limitée 1/25'
  },
  // SUNSET
  {
    id: 'sun-001',
    title: 'La Ciotat - Route des Crêtes',
    category: 'sunset',
    location: 'La Ciotat, Bouches-du-Rhône',
    image: '/Sunset/Coucher de soleil La Ciotat éléphant routedes crêtes.webp',
    description: 'Le rocher de l\'éléphant se découpe sur un ciel embrasé, vu depuis la mythique route des crêtes.',
    price: 180,
    sizes: ['30x45 cm', '50x75 cm', '70x105 cm', '100x150 cm'],
    edition: 'Édition limitée 1/15',
    featured: true
  },
  {
    id: 'sun-002',
    title: 'Ciel de Feu',
    category: 'sunset',
    location: 'La Ciotat, Bouches-du-Rhône',
    image: '/Sunset/sunset fire la ciotat.webp',
    description: 'Quand le ciel de La Ciotat s\'embrase, offrant un spectacle pyrotechnique naturel.',
    price: 170,
    sizes: ['30x45 cm', '50x75 cm', '70x105 cm'],
    edition: 'Édition limitée 1/15',
    featured: true
  },
  {
    id: 'sun-003',
    title: 'Catalans - Marseille',
    category: 'sunset',
    location: 'Plage des Catalans, Marseille',
    image: '/Sunset/Sunset catalans marseille.webp',
    description: 'Le soleil plonge dans la Méditerranée devant la plage emblématique des Catalans.',
    price: 140,
    sizes: ['30x45 cm', '50x75 cm', '70x105 cm'],
    edition: 'Édition limitée 1/20'
  },
  {
    id: 'sun-004',
    title: "L'Estaque",
    category: 'sunset',
    location: "L'Estaque, Marseille",
    image: '/Sunset/sunset l\'estaque Marseille.webp',
    description: 'L\'Estaque, ce quartier cher à Cézanne, baigné dans la lumière dorée du soir.',
    price: 150,
    sizes: ['30x45 cm', '50x75 cm', '70x105 cm'],
    edition: 'Édition limitée 1/20'
  },
  {
    id: 'sun-005',
    title: 'Port Saint-Jean',
    category: 'sunset',
    location: 'La Ciotat, Bouches-du-Rhône',
    image: '/Sunset/sunset port saintjean la ciotat.webp',
    description: 'Les bateaux du port Saint-Jean se balancent doucement sous un ciel de feu.',
    price: 130,
    sizes: ['30x45 cm', '50x75 cm', '70x105 cm'],
    edition: 'Édition limitée 1/25'
  },
  {
    id: 'sun-006',
    title: 'Bain des Dames',
    category: 'sunset',
    location: 'Marseille',
    image: '/Sunset/sunset serpent bain des dames marseille.webp',
    description: 'Le serpent de pierre du Bain des Dames se dessine sur le coucher de soleil marseillais.',
    price: 140,
    sizes: ['30x45 cm', '50x75 cm', '70x105 cm'],
    edition: 'Édition limitée 1/20'
  }
];

const shopProducts = baseShopProducts.map((product) => {
  const printAsset = printAssetCatalog[product.id] || null;

  if (printAsset && printAsset.previewImage !== product.image) {
    console.warn(
      `[shopProducts] Preview mismatch for ${product.id}:`,
      product.image,
      printAsset.previewImage
    );
  }

  return {
    ...product,
    title: getPhotoTitleFromPath(product.image, product.title),
    previewImage: printAsset?.previewImage || product.image,
    printAsset,
  };
});

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const { addToCart, addToWishlist, isInWishlist } = useCart();

  const categories = [
    { id: 'all', label: 'Tous les tirages' },
    { id: 'calanques', label: 'Calanques' },
    { id: 'sunset', label: 'Couchers de Soleil' }
  ];

  const filteredProducts = selectedCategory === 'all'
    ? shopProducts
    : shopProducts.filter((p) => p.category === selectedCategory);

  const getPriceBySize = (basePrice, size) => {
    if (size?.includes('100x150')) return basePrice + 150;
    if (size?.includes('70x105')) return basePrice + 80;
    if (size?.includes('50x75')) return basePrice + 40;
    return basePrice;
  };

  const handleAddToCart = (product, size) => {
    if (!size) {
      alert('Veuillez sélectionner un format');
      return;
    }
    const finalPrice = getPriceBySize(product.price, size);
    addToCart({
      ...product,
      selectedSize: size,
      finalPrice
    });
  };

  const handleBuyNow = async (product, size) => {
    if (!size) {
      toast({
        title: 'Format requis',
        description: 'Veuillez sélectionner un format avant de procéder au paiement.',
        variant: 'destructive',
      });
      return;
    }

    if (!product.printAsset?.blobUrl) {
      toast({
        title: 'Fichier d\'impression manquant',
        description: `Cette oeuvre n'est pas encore reliee a son master Vercel Blob. Fichier attendu : ${product.printAsset?.blobPathname || 'non configure'}`,
        variant: 'destructive',
      });
      return;
    }

    const finalPrice = getPriceBySize(product.price, size);
    const imageUrl = product.printAsset.blobUrl;

    setIsLoadingCheckout(true);
    try {
      const session = await checkoutAPI.createSession([
        {
          title: product.title,
          size,
          image_url: imageUrl,
          price: finalPrice * 100, // en centimes
          quantity: 1,
        },
      ]);
      window.location.href = session.url;
    } catch (err) {
      toast({
        title: 'Paiement indisponible',
        description: 'Le service de paiement est momentanément indisponible. Veuillez réessayer plus tard.',
        variant: 'destructive',
      });
      setIsLoadingCheckout(false);
    }
  };

  return (
    <div className="bg-white">
      <SEOHead 
        title="Boutique"
        description="Tirages d'art en édition limitée de la Méditerranée. Calanques, couchers de soleil. Papier Fine Art, numérotés et signés. Livraison France & Europe."
        url="/boutique"
      />
      {/* Hero */}
      <section 
        className="pt-32 pb-20 bg-cover bg-center relative min-h-[50vh] flex items-center"
        style={{
          backgroundImage: `url('/Sunset/Cover.JPEG')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        
        <div className="container-photo text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[var(--color-gold)] text-sm uppercase tracking-widest mb-4">Boutique</p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white mb-6">
              Tirages d'Art
            </h1>
            <div className="w-16 h-0.5 bg-[var(--color-gold)] mx-auto mb-6"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Chaque tirage est numéroté, signé et imprimé sur papier Fine Art de qualité muséale. 
              Des œuvres uniques issues de mes collections Calanques et Couchers de Soleil.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-gray-50 sticky top-0 z-40 border-b border-gray-200">
        <div className="container-photo">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2.5 text-sm font-medium uppercase tracking-wider transition-all rounded-sm ${
                  selectedCategory === cat.id
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container-photo">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id} 
                className="group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Image */}
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <motion.img
                      src={product.previewImage}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Badges */}
                    {product.featured && (
                      <div className="absolute top-4 left-4 bg-[var(--color-gold)] text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                        Coup de cœur
                      </div>
                    )}
                    
                    {/* Wishlist */}
                    <button 
                      onClick={() => addToWishlist(product.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      <Heart 
                        size={18} 
                        fill={isInWishlist(product.id) ? "#C9A961" : "none"} 
                        stroke={isInWishlist(product.id) ? "#C9A961" : "currentColor"}
                      />
                    </button>

                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="bg-white text-black px-6 py-3 font-medium uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-[var(--color-gold)] hover:text-white transition-colors"
                      >
                        <Eye size={18} />
                        Voir Détails
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">{product.location}</p>
                    <h3 className="font-display text-xl font-semibold mb-2">{product.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-2xl font-semibold text-[var(--color-gold)]">
                          {product.price}€
                        </p>
                        <p className="text-gray-400 text-xs">{product.edition}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-[var(--color-gold)] transition-colors"
                      >
                        Commander
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => { setSelectedProduct(null); setSelectedSize(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="aspect-square md:aspect-auto md:h-full">
                  <img
                    src={selectedProduct.previewImage}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-8 flex flex-col">
                  <button 
                    onClick={() => { setSelectedProduct(null); setSelectedSize(null); }}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={24} />
                  </button>

                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                    {selectedProduct.location}
                  </p>
                  <h2 className="font-display text-3xl font-semibold mb-4">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

                  {/* Size selection */}
                  <div className="mb-6">
                    <p className="font-medium mb-3">Sélectionnez un format :</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border transition-all ${
                            selectedSize === size
                              ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <p className="text-3xl font-semibold text-[var(--color-gold)]">
                      {getPriceBySize(selectedProduct.price, selectedSize)}€
                    </p>
                    <p className="text-gray-400 text-sm">{selectedProduct.edition}</p>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct, selectedSize);
                      setSelectedProduct(null);
                      setSelectedSize(null);
                    }}
                    className="w-full bg-black text-white py-4 font-medium uppercase tracking-wider hover:bg-[var(--color-gold)] transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Ajouter au panier
                  </button>

                  {/* Acheter maintenant */}
                  <button
                    onClick={() => handleBuyNow(selectedProduct, selectedSize)}
                    disabled={isLoadingCheckout}
                    className="w-full mt-3 border-2 border-black text-black py-4 font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard size={20} />
                    {isLoadingCheckout ? 'Redirection en cours…' : 'Acheter maintenant'}
                  </button>

                  {/* Info */}
                  <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500">
                    <p>✓ Tirage numéroté et signé</p>
                    <p>✓ Papier Fine Art 100% coton</p>
                    <p>✓ Certificat d'authenticité</p>
                    <p>✓ Livraison sécurisée</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Section */}
      <section className="py-20 bg-[#1a1a1a] text-white">
        <div className="container-photo">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl font-semibold mb-4">Qualité & Authenticité</h2>
            <div className="w-16 h-0.5 bg-[var(--color-gold)] mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="text-[var(--color-gold)] text-4xl mb-4">🎨</div>
              <h3 className="font-display text-lg font-semibold mb-2">Papier Fine Art</h3>
              <p className="text-gray-400 text-sm">100% coton, sans acide, qualité muséale</p>
            </div>
            <div className="text-center p-6">
              <div className="text-[var(--color-gold)] text-4xl mb-4">✍️</div>
              <h3 className="font-display text-lg font-semibold mb-2">Signé & Numéroté</h3>
              <p className="text-gray-400 text-sm">Chaque tirage est unique et authentifié</p>
            </div>
            <div className="text-center p-6">
              <div className="text-[var(--color-gold)] text-4xl mb-4">📜</div>
              <h3 className="font-display text-lg font-semibold mb-2">Certificat</h3>
              <p className="text-gray-400 text-sm">Certificat d'authenticité fourni</p>
            </div>
            <div className="text-center p-6">
              <div className="text-[var(--color-gold)] text-4xl mb-4">📦</div>
              <h3 className="font-display text-lg font-semibold mb-2">Livraison Sécurisée</h3>
              <p className="text-gray-400 text-sm">Emballage renforcé, France & Europe</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;

