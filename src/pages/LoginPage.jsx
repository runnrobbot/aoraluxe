import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const ERROR_MESSAGES = {
  'auth/user-not-found': 'Email tidak terdaftar',
  'auth/wrong-password': 'Password salah',
  'auth/invalid-email': 'Format email tidak valid',
  'auth/too-many-requests': 'Terlalu banyak percobaan login, coba lagi nanti',
  'auth/invalid-credential': 'Email atau password salah',
};

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] || 'Login gagal, periksa kembali email & password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group">
            <span className="font-serif text-3xl text-zinc-900 group-hover:text-gold transition-colors">
              AORA LUXE
            </span>
          </Link>
          <p className="text-[0.65rem] tracking-[0.45em] uppercase text-zinc-400 mt-2">
            Admin Panel
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 shadow-sm border border-zinc-100">
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 text-xs tracking-wide">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full px-3 py-2.5 border border-zinc-200 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
                placeholder="admin@aoraluxe.com"
              />
            </div>

            <div>
              <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full px-3 py-2.5 border border-zinc-200 text-sm focus:outline-none focus:border-yellow-600 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-zinc-900 text-white text-[0.65rem] tracking-[0.35em] uppercase hover:bg-yellow-600 hover:text-zinc-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>

        <div className="text-center mt-5">
          <Link
            to="/"
            className="text-[0.65rem] tracking-widest uppercase text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
