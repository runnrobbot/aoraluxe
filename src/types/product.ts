import type { Category, CategoryWithAll } from '../constants/categories';

export type { Category, CategoryWithAll };

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  description: string;
  featured: boolean;
  imageUrl: string;
  publicId: string;
  images: ProductImage[];
  createdAt: { seconds: number } | null;
  updatedAt: { seconds: number } | null;
}
