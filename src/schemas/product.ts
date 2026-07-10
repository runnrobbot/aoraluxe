import { z } from 'zod';
import { CATEGORIES } from '../constants/categories';

export const categorySchema = z.enum(['Sale', 'Semi Premium', 'Semi Original', 'Superclone', 'Unbranded']);
export type CategoryInput = z.infer<typeof categorySchema>;

export const productImageSchema = z.object({
  url: z.string().min(1),
  publicId: z.string(),
});

export const productInputSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi').max(200),
  category: categorySchema,
  price: z.number().min(0, 'Harga harus positif'),
  stock: z.number().int().min(0).default(0),
  description: z.string().max(1000).default(''),
  featured: z.boolean().default(false),
  images: z.array(productImageSchema).min(1, 'Minimal 1 foto'),
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const productQuerySchema = z.object({
  category: z.enum(CATEGORIES as unknown as [string, ...string[]]).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['newest', 'oldest', 'name_asc', 'name_desc', 'price_asc', 'price_desc']).optional(),
});

export const validateProduct = (data: unknown) => productInputSchema.safeParse(data);
export const validateCategory = (cat: string) => categorySchema.safeParse(cat);
