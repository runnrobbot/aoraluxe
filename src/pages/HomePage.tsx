import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES } from '../constants/categories';
import type { CategoryWithAll } from '../constants/categories';
import type { Product } from '../types/product';

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const HomePage = () => {
  const { products, loading, error } = useProducts();
  const [category, setCategory] = useState<CategoryWithAll>('Semua');
  const [search, setSearch] = useState('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const collectionRef = useRef<HTMLDivElement>(null);

  const handleExplore = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const featured = useMemo(() => products.filter((p) => p.featured), [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === 'Semua' || (p.category ?? '').toLowerCase() === category.toLowerCase();
      const matchSearch = !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, category, search]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar onSearch={setSearch} />

      <HeroSection onExplore={handleExplore} />

      {/* Featured Products */}
      <AnimatePresence>
        {!loading && featured.length > 0 && !search && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="py-20 px-4 bg-zinc-50"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-[0.6rem] tracking-[0.7em] uppercase mb-3 font-light" style={{ color: '#c9a84c' }}>
                  Pilihan Kami
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-zinc-900">Produk Unggulan</h2>
                <div className="w-12 h-px mx-auto mt-4" style={{ background: '#c9a84c' }} />
              </div>
              <motion.div
                variants={gridVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {featured.slice(0, 3).map((p) => (
                  <motion.div key={p.id} variants={cardVariants}>
                    <ProductCard product={p} onClick={() => setActiveProduct(p)} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* All Products */}
      <motion.section
        id="collection"
        ref={collectionRef}
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-[0.6rem] tracking-[0.7em] uppercase mb-2 font-light" style={{ color: '#c9a84c' }}>
                  Koleksi {new Date().getFullYear()}
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-zinc-900">
                  {search ? `Hasil pencarian "${search}"` : 'Semua Produk'}
                </h2>
              </div>

              {/* Search bar (desktop) */}
              <div className="hidden md:flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama atau deskripsi..."
                    className="w-56 pl-3 pr-8 py-2 text-xs border border-zinc-200 outline-none focus:border-gold text-zinc-700 placeholder-zinc-400 transition-colors"
                  />
                  <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </div>
                {search && (
                  <button onClick={() => setSearch('')}
                    className="text-xs text-zinc-400 hover:text-zinc-700 tracking-wider transition-colors">
                    Reset
                  </button>
                )}
              </div>
            </div>

            <CategoryFilter selected={category} onSelect={(c) => setCategory(c as CategoryWithAll)} />
          </div>

          {loading ? (
            <div className="py-24 flex justify-center"><LoadingSpinner size="lg" /></div>
          ) : error ? (
            <div className="py-24 text-center">
              <p className="text-red-400 text-sm">Gagal memuat produk. Periksa koneksi Anda.</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <svg className="w-12 h-12 text-zinc-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <p className="text-zinc-400 text-sm tracking-widest uppercase">
                {search ? `Tidak ada produk untuk "${search}"` : category !== 'Semua' ? `Tidak ada produk dalam kategori "${category}"` : 'Belum ada produk'}
              </p>
              {(search || category !== 'Semua') && (
                <button
                  onClick={() => { setSearch(''); setCategory('Semua'); }}
                  className="mt-4 text-xs tracking-widest uppercase hover:underline"
                  style={{ color: '#c9a84c' }}>
                  Tampilkan semua →
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              variants={gridVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    variants={cardVariants}
                    layout
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  >
                    <ProductCard product={p} onClick={() => setActiveProduct(p)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.section>

      <Footer />

      <AnimatePresence>
        {activeProduct && (
          <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
