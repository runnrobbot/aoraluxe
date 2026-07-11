export interface CloudinaryResult {
  url: string;
  publicId: string;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadImage = async (file: File): Promise<CloudinaryResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'aora-luxe');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const errData = (await res.json()) as { error?: { message?: string } };
    throw new Error(errData.error?.message || 'Upload gambar gagal');
  }

  const data = await res.json() as { secure_url: string; public_id: string };
  return { url: data.secure_url, publicId: data.public_id };
};

export const getOptimizedUrl = (publicId: string, { width = 600 }: { width?: number } = {}): string => {
  if (!publicId) return '';
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto,c_fill/${publicId}`;
};
