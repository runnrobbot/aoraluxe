import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedUrl } from '../utils/cloudinary';
import { useCart } from '../context/CartContext';

const ProductModal = ({ product, onClose }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActiveIdx((i) => Math.min(i + 1, allImages.length - 1));
      if (e.key === 'ArrowLeft') setActiveIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const { addItem } = useCart();

  if (!product) return null;

  const { name, category, price, imageUrl, publicId, description, stock, images } = product;

  // Build unified image list — prefer `images` array, fall back to legacy single image
  const allImages = (() => {
    if (images?.length) return images.map((img) => ({
      src: img.publicId ? getOptimizedUrl(img.publicId, { width: 900 }) : img.url,
      thumb: img.publicId ? getOptimizedUrl(img.publicId, { width: 160 }) : img.url,
    }));
    const src = publicId ? getOptimizedUrl(publicId, { width: 900 }) : imageUrl;
    const thumb = publicId ? getOptimizedUrl(publicId, { width: 160 }) : imageUrl;
    return src ? [{ src, thumb }] : [];
  })();

  const activeSrc = allImages[activeIdx]?.src;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 bg-white max-w-2xl w-full max-h-[92vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all"
          aria-label="Tutup"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
          {/* ── Image gallery ── */}
          <div className="flex flex-col bg-zinc-100">
            {/* Main photo */}
            <div className="aspect-[4/3] md:aspect-square relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIdx}
                  src={activeSrc}
                  alt={`${name} foto ${activeIdx + 1}`}
                  className="w-full h-full object-cover absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </AnimatePresence>

              {/* Prev/Next arrows (only when >1 image) */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
                    disabled={activeIdx === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm text-zinc-700 disabled:opacity-20 hover:bg-white transition-all z-10"
                    aria-label="Foto sebelumnya"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveIdx((i) => Math.min(i + 1, allImages.length - 1))}
                    disabled={activeIdx === allImages.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm text-zinc-700 disabled:opacity-20 hover:bg-white transition-all z-10"
                    aria-label="Foto selanjutnya"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {/* Dot indicator */}
                  <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIdx(i)}
                        className="w-1.5 h-1.5 rounded-full transition-all"
                        style={{ background: i === activeIdx ? '#c9a84c' : 'rgba(255,255,255,0.6)' }}
                        aria-label={`Foto ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {stock === 0 && (
                <div className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center z-10">
                  <span className="text-white text-xs tracking-[0.3em] uppercase border border-white/40 px-4 py-2">Stok Habis</span>
                </div>
              )}
            </div>

            {/* Thumbnails (only when >1 image) */}
            {allImages.length > 1 && (
              <div className="flex gap-1.5 p-2 overflow-x-auto">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`flex-shrink-0 w-14 h-14 overflow-hidden transition-all ${
                      i === activeIdx ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={i === activeIdx ? { ringColor: '#c9a84c', outlineColor: '#c9a84c', outline: '2px solid #c9a84c' } : {}}
                    aria-label={`Lihat foto ${i + 1}`}
                  >
                    <img src={img.thumb} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className="p-5 md:p-8 flex flex-col justify-between gap-5 md:gap-6">
            <div>
              {category && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-[0.6rem] tracking-[0.4em] uppercase px-2.5 py-1 inline-block mb-4 border"
                  style={{ color: '#c9a84c', borderColor: '#c9a84c' }}
                >
                  {category}
                </motion.span>
              )}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-serif text-2xl md:text-3xl text-zinc-900 leading-snug mb-4"
              >
                {name}
              </motion.h2>
              {description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.28 }}
                  className="text-zinc-500 text-sm leading-relaxed"
                >
                  {description}
                </motion.p>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
            >
              <p className="text-2xl font-semibold tracking-wider mb-1" style={{ color: '#c9a84c' }}>
                Rp {price?.toLocaleString('id-ID')}
              </p>
              {stock !== undefined && (
                <p className={`text-xs tracking-widest uppercase mb-6 ${stock > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                  {stock > 0 ? `Stok: ${stock} tersedia` : 'Stok habis'}
                </p>
              )}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { addItem(product); onClose(); }}
                disabled={stock === 0}
                className="w-full py-3.5 bg-zinc-900 text-white text-[0.65rem] tracking-[0.35em] uppercase hover:bg-gold hover:text-zinc-900 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
              </motion.button>
              <motion.a
                href={`https://api.whatsapp.com/send/?phone=6281214857082&text=${encodeURIComponent(`Halo AORA LUXE! Saya ingin memesan:\n\n• ${name} (${category || 'Produk'}) — 1x @ Rp ${price?.toLocaleString('id-ID')}\n\nMohon konfirmasinya, terima kasih`)}&type=phone_number&app_absent=0`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="mt-2 w-full py-3 border border-zinc-200 text-zinc-600 text-[0.65rem] tracking-[0.3em] uppercase hover:border-zinc-900 hover:text-zinc-900 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order Langsung
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductModal;
