import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase/config';
import { useProducts } from '../hooks/useProducts';
import ProductForm from '../components/ProductForm';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { getOptimizedUrl } from '../utils/cloudinary';
import { CATEGORIES } from '../constants/categories';
import type { CategoryWithAll } from '../constants/categories';
import type { Product } from '../types/product';
import type { ProductInput } from '../schemas/product';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'name_asc', label: 'Nama A–Z' },
  { value: 'name_desc', label: 'Nama Z–A' },
  { value: 'price_asc', label: 'Harga Terendah' },
  { value: 'price_desc', label: 'Harga Tertinggi' },
] as const;

type SortValue = typeof SORT_OPTIONS[number]['value'];

/* ── Modal wrapper ────────────────────────────────────────────── */
interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ title, onClose, children }: ModalProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" />
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 16 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="relative z-10 bg-white w-full max-w-lg p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-zinc-900">{title}</h2>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

/* ── Image Preview Tooltip ────────────────────────────────────── */
interface ThumbPreviewProps {
  src: string;
  alt: string;
}

const ThumbPreview = ({ src, alt }: ThumbPreviewProps) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative w-10 h-10 flex-shrink-0" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover bg-zinc-100" />
      ) : (
        <div className="w-full h-full bg-zinc-200" />
      )}
      <AnimatePresence>
        {hovered && src && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute left-12 top-1/2 -translate-y-1/2 z-30 pointer-events-none shadow-2xl border border-zinc-100"
            style={{ width: 160, height: 160 }}
          >
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Stat card ────────────────────────────────────────────────── */
interface StatCardProps {
  label: string;
  value: number;
  accent?: string;
}

const StatCard = ({ label, value, accent }: StatCardProps) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    className="bg-white p-3 sm:p-5 border border-zinc-100">
    <p className="text-xl sm:text-2xl font-bold mb-1" style={{ color: accent || '#18181b' }}>{value}</p>
    <p className="text-[0.55rem] sm:text-[0.6rem] tracking-widest uppercase text-zinc-400">{label}</p>
  </motion.div>
);

/* ── Main ─────────────────────────────────────────────────────── */
const AdminPage = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<CategoryWithAll>('Semua');
  const [sortBy, setSortBy] = useState<SortValue>('newest');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleAdd = async (data: Record<string, unknown>) => {
    await addProduct(data as unknown as ProductInput);
    setShowAdd(false);
  };

  const handleEdit = async (data: Record<string, unknown>) => {
    await updateProduct(editTarget!.id, data as unknown as Partial<ProductInput>);
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await deleteProduct(deleteId); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const handleToggleFeatured = async (p: Product) => {
    setTogglingId(p.id);
    try { await updateProduct(p.id, { featured: !p.featured }); }
    finally { setTogglingId(null); }
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()));
    if (catFilter !== 'Semua') list = list.filter((p) => (p.category ?? '').toLowerCase() === catFilter.toLowerCase());
    switch (sortBy) {
      case 'oldest': list.sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0)); break;
      case 'name_asc': list.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')); break;
      case 'name_desc': list.sort((a, b) => (b.name ?? '').localeCompare(a.name ?? '')); break;
      case 'price_asc': list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0)); break;
      case 'price_desc': list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0)); break;
      default: list.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
    }
    return list;
  }, [products, search, catFilter, sortBy]);

  const stats = [
    { label: 'Total Produk', value: products.length },
    { label: 'Produk Unggulan', value: products.filter((p) => p.featured).length, accent: '#c9a84c' },
    { label: 'Kehabisan Stok', value: products.filter((p) => (p.stock ?? 1) === 0).length, accent: '#f87171' },
    { label: 'Total Kategori', value: new Set(products.map((p) => p.category).filter(Boolean)).size },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link to="/" className="font-serif text-lg sm:text-xl text-zinc-900 hover:text-gold transition-colors flex-shrink-0">
              AORA LUXE
            </Link>
            <span className="hidden sm:block text-zinc-200 text-lg">|</span>
            <span className="hidden sm:block text-[0.65rem] tracking-widest uppercase text-zinc-400">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <Link to="/" className="text-[0.65rem] sm:text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-700 transition-colors whitespace-nowrap">
              Toko
            </Link>
            <button onClick={handleLogout}
              className="text-[0.65rem] sm:text-xs tracking-widest uppercase text-zinc-400 hover:text-red-400 transition-colors">
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-5">
          <div className="flex items-center justify-between gap-3">
            <h1 className="font-serif text-xl sm:text-2xl text-zinc-900">Manajemen Produk</h1>
            <button onClick={() => setShowAdd(true)}
              className="flex-shrink-0 px-4 sm:px-5 py-2 bg-zinc-900 text-white text-[0.65rem] sm:text-xs tracking-widest uppercase hover:bg-gold hover:text-zinc-900 transition-all whitespace-nowrap">
              + Tambah
            </button>
          </div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3">
            <div className="relative flex-1 sm:min-w-[160px] sm:max-w-xs">
              <input type="text" placeholder="Cari produk..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 sm:py-2 border border-zinc-200 text-sm focus:outline-none focus:border-gold transition-colors" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
              <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as CategoryWithAll)}
                className="px-3 py-2.5 sm:py-2 border border-zinc-200 text-sm text-zinc-600 focus:outline-none focus:border-gold transition-colors bg-white">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortValue)}
                className="px-3 py-2.5 sm:py-2 border border-zinc-200 text-sm text-zinc-600 focus:outline-none focus:border-gold transition-colors bg-white">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <span className="text-xs text-zinc-400 tracking-wider self-center">
              {filtered.length} produk{filtered.length !== products.length ? ` dari ${products.length}` : ''}
            </span>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-24 flex justify-center"><LoadingSpinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center bg-white border border-zinc-100">
            <p className="text-zinc-400 text-sm tracking-widest uppercase mb-3">
              {search || catFilter !== 'Semua' ? 'Produk tidak ditemukan' : 'Belum ada produk'}
            </p>
            {!search && catFilter === 'Semua' && (
              <button onClick={() => setShowAdd(true)} className="text-xs tracking-widest uppercase hover:underline" style={{ color: '#c9a84c' }}>
                Tambah produk pertama →
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white border border-zinc-100 overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {['Produk', 'Kategori', 'Harga', 'Stok', 'Unggulan', 'Aksi'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[0.6rem] tracking-widest uppercase text-zinc-400 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((p) => {
                      const thumb = p.publicId ? getOptimizedUrl(p.publicId, { width: 160 }) : p.imageUrl;
                      return (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          layout
                          className="border-b border-zinc-50 hover:bg-zinc-50/80 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <ThumbPreview src={thumb} alt={p.name} />
                              <span className="text-sm font-medium text-zinc-800 line-clamp-1 max-w-[160px]">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {p.category ? (
                              <span className="text-[0.6rem] tracking-widest uppercase px-2 py-0.5 bg-zinc-100 text-zinc-500">{p.category}</span>
                            ) : <span className="text-zinc-300 text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium" style={{ color: '#c9a84c' }}>
                            Rp {p.price?.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium ${(p.stock ?? 1) === 0 ? 'text-red-400' : 'text-emerald-500'}`}>
                              {p.stock ?? '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleToggleFeatured(p)} disabled={togglingId === p.id}
                              className="transition-all" title={p.featured ? 'Unfeature' : 'Set sebagai unggulan'}>
                              {togglingId === p.id ? (
                                <span className="w-5 h-5 inline-block border-2 border-gold border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <svg className={`w-5 h-5 transition-colors ${p.featured ? 'text-gold fill-gold' : 'text-zinc-200 hover:text-gold/50'}`}
                                  viewBox="0 0 24 24" fill={p.featured ? 'currentColor' : 'none'} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setEditTarget(p)}
                                className="text-xs tracking-wider text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 px-3 py-1 transition-all">
                                Edit
                              </button>
                              <button onClick={() => setDeleteId(p.id)}
                                className="text-xs tracking-wider text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 px-3 py-1 transition-all">
                                Hapus
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-zinc-100">
              {filtered.map((p) => {
                const thumb = p.publicId ? getOptimizedUrl(p.publicId, { width: 120 }) : p.imageUrl;
                return (
                  <div key={p.id} className="p-3 sm:p-4">
                    <div className="flex gap-3 items-start mb-3">
                      <div className="w-16 h-16 bg-zinc-100 overflow-hidden flex-shrink-0">
                        {thumb ? <img src={thumb} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-200" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="text-sm font-medium text-zinc-800 leading-snug line-clamp-2 flex-1">{p.name}</h3>
                          <button onClick={() => handleToggleFeatured(p)} disabled={togglingId === p.id}
                            className="w-9 h-9 flex items-center justify-center flex-shrink-0 -mt-0.5 -mr-1" title={p.featured ? 'Unfeature' : 'Set unggulan'}>
                            {togglingId === p.id ? (
                              <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin inline-block" />
                            ) : (
                              <svg className={`w-4 h-4 ${p.featured ? 'text-gold' : 'text-zinc-200'}`} viewBox="0 0 24 24" fill={p.featured ? 'currentColor' : 'none'} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <p className="text-[0.65rem] text-zinc-400 mt-0.5">
                          {p.category || '—'} · Stok&nbsp;
                          <span className={`font-medium ${(p.stock ?? 1) === 0 ? 'text-red-400' : 'text-emerald-500'}`}>{p.stock ?? '—'}</span>
                        </p>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: '#c9a84c' }}>Rp {p.price?.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditTarget(p)}
                        className="flex-1 py-2.5 text-xs tracking-wider border border-zinc-200 text-zinc-600 hover:border-zinc-400 active:bg-zinc-50 transition-all">
                        Edit
                      </button>
                      <button onClick={() => setDeleteId(p.id)}
                        className="flex-1 py-2.5 text-xs tracking-wider border border-red-100 text-red-400 hover:border-red-300 active:bg-red-50 transition-all">
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showAdd && (
          <Modal title="Tambah Produk" onClose={() => setShowAdd(false)}>
            <ProductForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
          </Modal>
        )}
        {editTarget && (
          <Modal title="Edit Produk" onClose={() => setEditTarget(null)}>
            <ProductForm initial={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} />
          </Modal>
        )}
      </AnimatePresence>

      {deleteId && (
        <ConfirmDialog
          message="Apakah kamu yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default AdminPage;
