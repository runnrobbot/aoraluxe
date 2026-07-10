import { useState, useRef } from 'react';
import { uploadImage } from '../utils/cloudinary';
import LoadingSpinner from './LoadingSpinner';
import { CATEGORIES_NO_ALL } from '../constants/categories';
import { productInputSchema } from '../schemas/product';
import type { Category } from '../constants/categories';
import type { ProductImage } from '../types/product';

const MAX_IMAGES = 5;

interface ImageEntry {
  file?: File;
  preview: string;
  existing?: { url: string; publicId: string };
}

const EMPTY_FORM = {
  name: '',
  category: '' as Category | '',
  price: '',
  stock: '',
  description: '',
  featured: false,
};

import type { Product } from '../types/product';

interface ProductFormProps {
  initial?: Partial<Product>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

const ProductForm = ({ initial, onSubmit, onCancel }: ProductFormProps) => {
  const [form, setForm] = useState<Record<string, unknown>>(
    initial
      ? { ...initial, price: initial.price?.toString() ?? '', stock: initial.stock?.toString() ?? '' }
      : EMPTY_FORM
  );

  const [images, setImages] = useState<ImageEntry[]>(() => {
    const initImages = initial?.images as ProductImage[] | undefined;
    const initImageUrl = initial?.imageUrl as string | undefined;
    const initPublicId = initial?.publicId as string | undefined;
    if (initImages?.length) {
      return initImages.map((img) => ({ preview: img.url, existing: img }));
    }
    if (initImageUrl) {
      return [{ preview: initImageUrl, existing: { url: initImageUrl, publicId: initPublicId ?? '' } }];
    }
    return [];
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) { setError(`Maksimal ${MAX_IMAGES} foto`); return; }

    const allowed = files.slice(0, remaining);
    const tooBig = allowed.find((f) => f.size > 5 * 1024 * 1024);
    if (tooBig) { setError('Ukuran tiap gambar maksimal 5MB'); return; }

    setImages((prev) => [
      ...prev,
      ...allowed.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    setError('');
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsed = productInputSchema.safeParse({
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      description: form.description ?? '',
      featured: form.featured ?? false,
      images: images.map((img) => img.existing ?? { url: img.preview, publicId: '' }),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Validasi gagal');
      return;
    }

    if (!form.name?.toString().trim()) return setError('Nama produk wajib diisi');
    if (images.length === 0) return setError('Minimal 1 foto produk wajib diunggah');

    setUploading(true);
    try {
      const uploaded = await Promise.all(
        images.map((img) =>
          img.file ? uploadImage(img.file) : Promise.resolve(img.existing!)
        )
      );

      const imageList: ProductImage[] = uploaded.map((r) => ({ url: r.url, publicId: r.publicId ?? '' }));

      await onSubmit({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        imageUrl: imageList[0].url,
        publicId: imageList[0].publicId,
        images: imageList,
      });
    } catch (err) {
      setError((err as Error).message || 'Terjadi kesalahan, coba lagi');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs tracking-wide rounded-sm">
          {error}
        </div>
      )}

      {/* Multi-image upload */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[0.65rem] tracking-widest uppercase text-zinc-500">
            Foto Produk <span className="text-red-400">*</span>
          </label>
          <span className="text-[0.6rem] text-zinc-400">{images.length}/{MAX_IMAGES} foto</span>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group aspect-square bg-zinc-100 overflow-hidden">
                <img src={img.preview} alt={`foto ${idx + 1}`} className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute bottom-0 inset-x-0 text-center text-[0.5rem] tracking-widest uppercase bg-zinc-900/70 text-white py-0.5">Utama</span>
                )}
                <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/40 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  {idx > 0 && (
                    <button type="button" onClick={() => moveImage(idx, idx - 1)}
                      className="w-6 h-6 bg-white/90 text-zinc-700 flex items-center justify-center text-xs rounded-sm">◀</button>
                  )}
                  <button type="button" onClick={() => removeImage(idx)}
                    className="w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-sm">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {idx < images.length - 1 && (
                    <button type="button" onClick={() => moveImage(idx, idx + 1)}
                      className="w-6 h-6 bg-white/90 text-zinc-700 flex items-center justify-center text-xs rounded-sm">▶</button>
                  )}
                </div>
              </div>
            ))}

            {images.length < MAX_IMAGES && (
              <button type="button" onClick={() => fileRef.current?.click()}
                className="aspect-square border-2 border-dashed border-zinc-200 hover:border-yellow-500 flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-yellow-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[0.55rem] tracking-wider uppercase">Tambah</span>
              </button>
            )}
          </div>
        )}

        {images.length === 0 && (
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-zinc-200 hover:border-yellow-500 cursor-pointer transition-colors h-36 flex flex-col items-center justify-center gap-2 text-zinc-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs tracking-widest uppercase">Klik untuk unggah foto</span>
            <span className="text-[0.6rem] text-zinc-300">JPG, PNG, WEBP — Maks 5MB per foto</span>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        <p className="mt-1.5 text-[0.6rem] text-zinc-400">Foto pertama = foto utama. Geser urutan dengan tombol ◀▶</p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-2">
          Nama Produk <span className="text-red-400">*</span>
        </label>
        <input name="name" value={form.name as string} onChange={handleChange}
          className="w-full px-3 py-2.5 border border-zinc-200 text-sm focus:outline-none focus:border-yellow-600"
          placeholder="Nama produk" />
      </div>

      {/* Category + Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-2">Kategori</label>
          <select name="category" value={form.category as string} onChange={handleChange}
            className="w-full px-3 py-2.5 border border-zinc-200 text-sm focus:outline-none focus:border-yellow-600 bg-white">
            <option value="">Pilih kategori</option>
            {CATEGORIES_NO_ALL.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-2">
            Harga (Rp) <span className="text-red-400">*</span>
          </label>
          <input name="price" type="number" value={form.price as string} onChange={handleChange} min="0"
            className="w-full px-3 py-2.5 border border-zinc-200 text-sm focus:outline-none focus:border-yellow-600"
            placeholder="0" />
        </div>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-2">Stok</label>
        <input name="stock" type="number" value={form.stock as string} onChange={handleChange} min="0"
          className="w-full px-3 py-2.5 border border-zinc-200 text-sm focus:outline-none focus:border-yellow-600"
          placeholder="0" />
      </div>

      {/* Description */}
      <div>
        <label className="block text-[0.65rem] tracking-widest uppercase text-zinc-500 mb-2">Deskripsi</label>
        <textarea name="description" value={form.description as string} onChange={handleChange} rows={3}
          className="w-full px-3 py-2.5 border border-zinc-200 text-sm focus:outline-none focus:border-yellow-600 resize-none"
          placeholder="Deskripsi produk..." />
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input id="featured" name="featured" type="checkbox"
          checked={!!form.featured} onChange={handleChange}
          className="w-4 h-4 rounded border-zinc-300 cursor-pointer"
          style={{ accentColor: '#c9a84c' }} />
        <label htmlFor="featured" className="text-[0.65rem] tracking-widest uppercase text-zinc-500 cursor-pointer">
          Tampilkan sebagai produk unggulan
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={uploading}
          className="flex-1 py-3 bg-zinc-900 text-white text-[0.65rem] tracking-[0.3em] uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {uploading ? (
            <><LoadingSpinner size="sm" /><span>Menyimpan...</span></>
          ) : (
            <span>{initial ? 'Simpan Perubahan' : 'Tambah Produk'}</span>
          )}
        </button>
        <button type="button" onClick={onCancel} disabled={uploading}
          className="px-6 py-3 border border-zinc-200 text-zinc-500 text-[0.65rem] tracking-wider uppercase hover:border-zinc-400 transition-all disabled:opacity-50">
          Batal
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
