import React, { useEffect, useMemo, useState } from "react";
import { CreditCard, Eye, Heart, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { checkoutAPI } from "../services/api";
import SEOHead from "../components/SEOHead";
import { toast } from "../hooks/use-toast";
import { trackViewItem, trackBeginCheckout } from "../utils/analytics";
import publicProductCatalog from "../data/publicProductCatalog.json";
import "../styles/photography.css";

const CATEGORY_LABELS = {
  calanques: "Calanques & littoral méditerranéen",
  "couchers-de-soleil": "Couchers de soleil",
  "lever-de-soleil": "Lever de soleil",
};

const SUPPORT_LABELS = {
  poster: "Affiche Fine Art",
  frame: "Tableau encadr\u00e9",
};

const SUPPORT_DESCRIPTIONS = {
  poster: "Tirage photo sur papier mat premium EMA 200 g/m\u00b2, livr\u00e9 sans cadre.",
  frame: "Tirage encadr\u00e9 classique, finition sobre, pr\u00eat \u00e0 accrocher selon disponibilit\u00e9 Prodigi.",
};

const ACTIVE_SUPPORTS = ["poster", "frame"];
const ALLOW_MANUAL_REVIEW_PRODUCTS =
  process.env.REACT_APP_ALLOW_MANUAL_REVIEW_PRODUCTS === "true" ||
  process.env.ALLOW_MANUAL_REVIEW_PRODUCTS === "true";
const DISPLAYABLE_RATIO_STATUSES = ALLOW_MANUAL_REVIEW_PRODUCTS
  ? ["perfect", "crop-safe", "manual-review"]
  : ["perfect", "crop-safe"];

const getProductStartingPrice = (pricing = {}) => {
  const prices = Object.values(pricing).flatMap((supportPricing) =>
    Object.values(supportPricing || {})
  );
  return prices.length ? Math.min(...prices) : 0;
};

const shopProducts = publicProductCatalog.map((product) => {
  const printSizesBySupport = product.allowedPrintSizes || {};
  const sizes = Object.values(printSizesBySupport)
    .flat()
    .map((printSize) => printSize.size);

  return {
    id: product.id,
    title: product.title,
    category: product.collection,
    location: "",
    image: product.previewImage,
    price: getProductStartingPrice(product.pricing),
    printSizesBySupport,
    sizes: [...new Set(sizes)],
    supports: (product.allowedSupports || []).filter((support) => ACTIVE_SUPPORTS.includes(support)),
    supportLabels: product.supportLabels || {},
    aspectRatio: product.aspectRatio,
    ratioGroup: product.ratioGroup,
    ratioMatchStatus: product.ratioMatchStatus,
    cropWarning: Boolean(product.cropWarning),
    grade: product.grade,
    edition: "Edition limitee",
    featured: false,
    previewImage: product.previewImage,
    pricing: product.pricing || {},
  };
});

const isProductSellable = (product) =>
  Boolean(
    product?.previewImage &&
    DISPLAYABLE_RATIO_STATUSES.includes(product?.ratioMatchStatus) &&
    product?.supports?.some((support) => product.printSizesBySupport?.[support]?.length)
  );

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [isCGVAccepted, setIsCGVAccepted] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToWishlist, isInWishlist } = useCart();

  const sellableProducts = useMemo(() => shopProducts.filter(isProductSellable), []);

  const categories = useMemo(() => {
    const dynamicCategories = Object.entries(CATEGORY_LABELS)
      .filter(([id]) => sellableProducts.some((product) => product.category === id))
      .map(([id, label]) => ({ id, label }));

    return [{ id: "all", label: "Tous les tirages" }, ...dynamicCategories];
  }, [sellableProducts]);

  const filteredProducts = selectedCategory === "all"
    ? sellableProducts
    : sellableProducts.filter((product) => product.category === selectedCategory);

  useEffect(() => {
    if (!categories.some((category) => category.id === selectedCategory)) {
      setSelectedCategory("all");
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    setIsCGVAccepted(false);
    setSelectedSupport(selectedProduct?.supports?.[0] || null);
    setSelectedSize(null);
    if (selectedProduct) {
      trackViewItem(selectedProduct);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProduct || !selectedSupport || !selectedSize) {
      return;
    }

    const supportSizes = selectedProduct.printSizesBySupport?.[selectedSupport] || [];
    if (!supportSizes.some((printSize) => printSize.size === selectedSize)) {
      setSelectedSize(null);
    }
  }, [selectedProduct, selectedSupport, selectedSize]);

  useEffect(() => {
    if (searchParams.get("checkout") !== "cancelled") {
      return;
    }

    toast({
      title: "Paiement annulé",
      description: "Votre paiement n'a pas été finalisé. Aucun débit n'a été effectué.",
      variant: "destructive",
    });

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("checkout");
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const getPrice = (product, support, size) => {
    if (support && size && product?.pricing?.[support]?.[size]) {
      return product.pricing[support][size];
    }
    return product?.price || 0;
  };

  const handleBuyNow = async (product, support, size) => {
    if (!support || !size) {
      toast({
        title: "Selection requise",
        description: "Veuillez sélectionner une taille avant de procéder au paiement.",
        variant: "destructive",
      });
      return;
    }

    if (!isProductSellable(product)) {
      toast({
        title: "Tirage indisponible",
        description: "Ce tirage n'est pas encore prêt à être commandé.",
        variant: "destructive",
      });
      return;
    }

    const price = getPrice(product, support, size);
    trackBeginCheckout(
      [{ id: product.id, title: product.title, price, quantity: 1 }],
      price
    );

    setIsLoadingCheckout(true);
    try {
      const session = await checkoutAPI.createSession([
        {
          product_id: product.id,
          support,
          size,
          quantity: 1,
        },
      ]);
      window.location.href = session.url;
    } catch (err) {
      toast({
        title: "Paiement indisponible",
        description: err.message || "Le service de paiement est momentanément indisponible. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
      setIsLoadingCheckout(false);
    }
  };

  return (
    <div className="bg-white">
      <SEOHead
        title="Boutique"
        description="Tirages d'art en édition limitée de la Méditerranée. Chaque photographie visible dans les collections est disponible au tirage."
        url="/boutique"
      />

      <section
        className="pt-32 pb-20 bg-cover bg-center relative min-h-[50vh] flex items-center"
        style={{
          backgroundImage: "url('/Sunset/Cover.JPEG')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="container-photo text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[var(--color-gold)] text-sm uppercase tracking-widest mb-4">Boutique</p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white mb-6">Tirages d'art</h1>
            <div className="w-16 h-0.5 bg-[var(--color-gold)] mx-auto mb-6" />
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Toutes les photographies visibles dans les collections sont disponibles au tirage.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-gray-50 sticky top-0 z-40 border-b border-gray-200">
        <div className="container-photo">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 text-sm font-medium uppercase tracking-wider transition-all rounded-sm ${
                  selectedCategory === category.id
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-photo">
          {filteredProducts.length > 0 ? (
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
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <motion.img
                        src={product.previewImage}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                      />

                      {product.featured ? (
                        <div className="absolute top-4 left-4 bg-[var(--color-gold)] text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                          Coup de coeur
                        </div>
                      ) : null}

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

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="bg-white text-black px-6 py-3 font-medium uppercase tracking-wider text-sm flex items-center gap-2 hover:bg-[var(--color-gold)] hover:text-white transition-colors"
                        >
                          <Eye size={18} />
                          Voir les détails
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">{product.location}</p>
                      <h3 className="font-display text-xl font-semibold mb-5">{product.title}</h3>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-2xl font-semibold text-[var(--color-gold)]">{product.price}€</p>
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
          ) : (
            <div className="border border-gray-200 bg-gray-50 px-8 py-16 text-center">
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--color-gray-500)] mb-4">Boutique en préparation</p>
              <h2 className="font-display text-3xl text-[var(--color-gray-900)] mb-4">Aucun tirage achetable pour le moment</h2>
              <p className="text-[var(--color-gray-600)] max-w-2xl mx-auto">
                La boutique reste masquée tant que les fichiers haute définition nécessaires à la vente ne sont pas tous prêts.
              </p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => {
              setSelectedProduct(null);
              setSelectedSupport(null);
              setSelectedSize(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-sm"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <div className="aspect-square md:aspect-auto md:h-full">
                  <img
                    src={selectedProduct.previewImage}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-8 flex flex-col">
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setSelectedSupport(null);
                      setSelectedSize(null);
                    }}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X size={24} />
                  </button>

                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">{selectedProduct.location}</p>
                  <h2 className="font-display text-3xl font-semibold mb-6">{selectedProduct.title}</h2>

                  <div className="mb-6">
                    <p className="font-medium mb-3">Selectionnez un support :</p>
                    <div className="grid gap-2">
                      {selectedProduct.supports.map((support) => {
                        const supportDetail = selectedProduct.supportLabels[support] || {};
                        return (
                          <button
                            key={support}
                            onClick={() => {
                              setSelectedSupport(support);
                              setSelectedSize(null);
                            }}
                            className={`px-4 py-3 border text-left transition-all ${
                              selectedSupport === support
                                ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            <span className="block text-sm font-medium">
                              {supportDetail.displayName || SUPPORT_LABELS[support] || support}
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                              {supportDetail.description || SUPPORT_DESCRIPTIONS[support]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="font-medium mb-3">Sélectionnez une taille :</p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedProduct.printSizesBySupport?.[selectedSupport] || []).map((printSize) => (
                        <button
                          key={printSize.size}
                          onClick={() => setSelectedSize(printSize.size)}
                          className={`px-4 py-2 border transition-all ${
                            selectedSize === printSize.size
                              ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {printSize.displaySize || printSize.size}
                        </button>
                      ))}
                    </div>
                    {selectedProduct.cropWarning ? (
                      <p className="mt-3 text-xs text-gray-500">
                        Recadrage lÃ©ger possible Ã  l'impression
                      </p>
                    ) : null}
                  </div>

                  <div className="mb-6">
                    <p className="text-3xl font-semibold text-[var(--color-gold)]">
                      {getPrice(selectedProduct, selectedSupport, selectedSize)}€
                    </p>
                    <p className="text-gray-400 text-sm">{selectedProduct.edition}</p>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isCGVAccepted}
                        onChange={(e) => setIsCGVAccepted(e.target.checked)}
                        className="mt-0.5 cursor-pointer flex-shrink-0"
                      />
                      <span>
                        J'ai lu et j'accepte les{' '}
                        <a
                          href="/conditions-generales-de-vente"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-[var(--color-gold)]"
                        >
                          Conditions Générales de Vente
                        </a>.
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={() => handleBuyNow(selectedProduct, selectedSupport, selectedSize)}
                    disabled={isLoadingCheckout || !isProductSellable(selectedProduct) || !selectedSupport || !selectedSize || !isCGVAccepted}
                    className="w-full border-2 border-black text-black py-4 font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CreditCard size={20} />
                    {isLoadingCheckout
                      ? "Redirection en cours..."
                      : isProductSellable(selectedProduct)
                        ? "Acheter maintenant"
                        : "Tirage indisponible"}
                  </button>

                  <p className="mt-3 text-sm text-gray-500">
                    Le paiement passe directement par Stripe puis la commande est transmise à l'impression.
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500 space-y-2">
                    <p>Tirage numéroté et signé</p>
                    <p>Papier Fine Art 100% coton</p>
                    <p>Certificat d'authenticité</p>
                    <p>Livraison sécurisée</p>
                  </div>

                  <p className="mt-4 text-xs text-gray-400 italic" style={{ opacity: 0.7 }}>
                    Tirage produit à la demande. Délais de production et livraison indiqués avant paiement.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <section className="py-20 bg-[#1a1a1a] text-white">
        <div className="container-photo">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl font-semibold mb-4">Qualité & authenticité</h2>
            <div className="w-16 h-0.5 bg-[var(--color-gold)] mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { marker: "01", title: "Papier Fine Art", text: "100% coton, sans acide, qualité muséale" },
              { marker: "02", title: "Signé & numéroté", text: "Chaque tirage est préparé dans une édition limitée" },
              { marker: "03", title: "Certificat", text: "Certificat d'authenticité fourni avec le tirage" },
              { marker: "04", title: "Livraison sécurisée", text: "Emballage renforcé, France et Europe" },
            ].map((item) => (
              <div key={item.marker} className="text-center p-6">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-gold)] text-[var(--color-gold)] text-sm tracking-[0.2em] mb-4">
                  {item.marker}
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
