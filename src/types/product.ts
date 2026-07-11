export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
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
