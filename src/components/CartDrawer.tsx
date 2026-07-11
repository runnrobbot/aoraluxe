import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { getOptimizedUrl } from '../utils/cloudinary';
import { buildWaLink } from '../constants/whatsapp';

const CartDrawer = () => {
  const {
    items, removeItem, updateQty, clearCart,
    totalItems, totalPrice, drawerOpen, setDrawerOpen,
  } = useCart();

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    const lines = items.map(
      (i) =>
        `• ${i.name} (${i.category || 'Produk'}) — ${i.qty}x @ Rp ${i.price?.toLocaleString('id-ID')} = Rp ${(i.price * i.qty).toLocaleString('id-ID')}`
    );
    const text = [
      'Halo AORA LUXE! Saya ingin memesan:',
      '', ...lines, '',
      `Total: Rp ${totalPrice.toLocaleString('id-ID')}`, '',
      'Mohon konfirmasinya, terima kasih',
    ].join('\n');
    window.open(buildWaLink(text), '_blank');
  };

  const closeDrawer = (e?: React.TouchEvent | React.MouseEvent) => {
    e?.stopPropagation();
    setDrawerOpen(false);
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-zinc-950/60 z-[60]"
            onClick={closeDrawer}
            onTouchStart={closeDrawer}
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Keranjang belanja"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-[100dvh] w-full sm:max-w-sm bg-white z-[61] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 flex-shrink-0 bg-white">
              <div>
                <h2 className="font-serif text-lg text-zinc-900">Keranjang</h2>
                {totalItems > 0 && (
                  <p className="text-[0.6rem] tracking-widest text-zinc-400 uppercase">{totalItems} item</p>
                )}
              </div>
              <button onClick={closeDrawer}
                className="w-11 h-11 -mr-2 flex items-center justify-center text-zinc-400 hover:text-zinc-900 active:text-zinc-700 transition-colors"
                aria-label="Tutup keranjang">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
                  <svg className="w-14 h-14 text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-zinc-400 text-sm tracking-widest uppercase">Keranjang kosong</p>
                  <button onClick={closeDrawer}
                    className="text-xs tracking-widest uppercase hover:underline"
                    style={{ color: '#c9a84c' }}>
                    Lihat Koleksi →
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-zinc-100">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const thumb = item.publicId
                        ? getOptimizedUrl(item.publicId, { width: 120 })
                        : item.imageUrl;
                      return (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-3 px-4 py-3"
                        >
                          <div className="w-[60px] h-[60px] flex-shrink-0 bg-zinc-100 overflow-hidden">
                            {thumb
                              ? <img src={thumb} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                              : <div className="w-full h-full bg-zinc-200" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <h3 className="text-sm font-medium text-zinc-800 leading-snug line-clamp-2 flex-1">{item.name}</h3>
                              <button onClick={() => removeItem(item.id)}
                                className="w-9 h-9 -mt-1 -mr-2 flex items-center justify-center text-zinc-300 hover:text-red-400 active:text-red-500 transition-colors flex-shrink-0"
                                aria-label="Hapus dari keranjang">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            {item.category && (
                              <p className="text-[0.6rem] tracking-widest uppercase text-zinc-400 mt-0.5">{item.category}</p>
                            )}
                            <div className="flex items-center justify-between mt-1.5">
                              <p className="text-sm font-semibold" style={{ color: '#c9a84c' }}>
                                Rp {(item.price * item.qty)?.toLocaleString('id-ID')}
                              </p>
                              <div className="flex items-center">
                                <button onClick={() => updateQty(item.id, item.qty - 1)}
                                  className="w-8 h-8 flex items-center justify-center border border-zinc-200 text-zinc-600 hover:border-zinc-400 active:bg-zinc-50 text-base leading-none transition-colors"
                                  aria-label="Kurangi jumlah">−</button>
                                <span className="text-sm w-7 text-center font-medium tabular-nums">{item.qty}</span>
                                <button onClick={() => updateQty(item.id, item.qty + 1)}
                                  className="w-8 h-8 flex items-center justify-center border border-zinc-200 text-zinc-600 hover:border-zinc-400 active:bg-zinc-50 text-base leading-none transition-colors"
                                  aria-label="Tambah jumlah">+</button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-zinc-100 px-4 pt-3 pb-5 space-y-3 flex-shrink-0 bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-xs tracking-widest uppercase text-zinc-400">Total</span>
                  <span className="font-semibold text-zinc-900 text-base">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <motion.button onClick={handleCheckout} whileTap={{ scale: 0.97 }}
                  className="w-full py-4 bg-zinc-900 text-white text-[0.65rem] tracking-[0.35em] uppercase flex items-center justify-center gap-2 active:bg-zinc-700 transition-colors">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Order via WhatsApp
                </motion.button>
                <button onClick={clearCart}
                  className="w-full py-2 text-center text-[0.6rem] tracking-widest uppercase text-zinc-300 hover:text-red-400 active:text-red-500 transition-colors">
                  Kosongkan Keranjang
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
