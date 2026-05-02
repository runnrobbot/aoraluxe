import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ onSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const { user } = useAuth();
  const { totalItems, setDrawerOpen } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
    else {
      setSearchQuery('');
      onSearch?.('');
    }
  }, [searchOpen]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
    if (e.target.value && isHome) {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeSearch = () => { setSearchOpen(false); setMenuOpen(false); };
  const dark = scrolled || !isHome;

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${dark ? 'bg-white/96 backdrop-blur-md shadow-sm border-b border-zinc-100' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none group flex-shrink-0">
            <span className={`text-[0.55rem] tracking-[0.5em] uppercase transition-colors ${dark ? 'text-zinc-400' : 'text-white/60'}`}>Est. 2024</span>
            <span className={`font-serif text-lg font-bold tracking-wider transition-colors group-hover:text-gold ${dark ? 'text-zinc-900' : 'text-white'}`}>AORA LUXE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[{ label: 'Beranda', href: '/' }, { label: 'Koleksi', href: '#collection' }, { label: 'Tentang', href: '#about' }].map(({ label, href }) => (
              <a key={label} href={href}
                onClick={href === '/' ? (e) => { e.preventDefault(); navigate('/'); } : undefined}
                className={`text-[0.7rem] tracking-[0.2em] uppercase font-medium transition-colors hover:text-gold ${dark ? 'text-zinc-600' : 'text-white/80'}`}>
                {label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Search box (desktop) */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="hidden md:block overflow-hidden"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
                    placeholder="Cari produk..."
                    className={`w-full px-3 py-1.5 text-xs border-b bg-transparent outline-none transition-colors ${dark ? 'border-zinc-300 text-zinc-800 placeholder-zinc-400' : 'border-white/40 text-white placeholder-white/50'}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cart icon */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`relative p-1.5 transition-colors ${dark ? 'text-zinc-600 hover:text-zinc-900' : 'text-white/80 hover:text-white'}`}
              aria-label="Keranjang"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[0.5rem] font-bold flex items-center justify-center text-zinc-900"
                    style={{ background: '#c9a84c' }}
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Search icon */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className={`p-1.5 transition-colors ${dark ? 'text-zinc-600 hover:text-zinc-900' : 'text-white/80 hover:text-white'}`}
              aria-label="Cari"
            >
              {searchOpen
                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>}
            </button>

            {/* Logout (admin only) */}
            {user && (
              <button
                onClick={handleLogout}
                className={`hidden md:block text-[0.7rem] tracking-[0.2em] uppercase font-medium transition-colors hover:text-red-400 ${dark ? 'text-zinc-400' : 'text-white/60'}`}
              >
                Keluar
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`md:hidden p-1 transition-colors ${dark ? 'text-zinc-700' : 'text-white'}`}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-white border-t border-zinc-100"
            >
              <div className="py-4 px-2 space-y-3">
                {/* Mobile search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Cari produk..."
                    className="w-full px-3 py-2 text-xs border border-zinc-200 outline-none focus:border-gold text-zinc-700 placeholder-zinc-400 transition-colors"
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </div>
                <a href="#collection" onClick={closeSearch} className="block text-xs tracking-widest uppercase text-zinc-600 hover:text-gold py-1">Koleksi</a>
                <a href="#about" onClick={closeSearch} className="block text-xs tracking-widest uppercase text-zinc-600 hover:text-gold py-1">Tentang</a>
                {user && (
                  <>
                    <Link to="/admin" onClick={closeSearch} className="block text-xs tracking-widest uppercase text-zinc-600 hover:text-gold py-1">Panel Admin</Link>
                    <button onClick={() => { handleLogout(); closeSearch(); }} className="block w-full text-left text-xs tracking-widest uppercase text-red-400 hover:text-red-600 py-1">
                      Keluar
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
