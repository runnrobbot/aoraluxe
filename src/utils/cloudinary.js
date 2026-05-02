const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload file gambar ke Cloudinary menggunakan unsigned upload.
 * Pastikan UPLOAD_PRESET sudah diset ke "Unsigned" di dashboard Cloudinary.
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'aora-luxe');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error?.message || 'Upload gambar gagal');
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
};

/**
 * Dapatkan URL gambar yang sudah dioptimasi dari Cloudinary.
 */
export const getOptimizedUrl = (publicId, { width = 600, quality = 'auto' } = {}) => {
  if (!publicId) return '';
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_${quality},f_auto,c_fill/${publicId}`;
};
