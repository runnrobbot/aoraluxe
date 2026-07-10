import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Product } from '../types/product';
import type { ProductInput } from '../schemas/product';

const COLLECTION = 'products';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (data: ProductInput) => Promise<string>;
  updateProduct: (id: string, data: Partial<ProductInput>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Product[];
        setProducts(docs);
        setLoading(false);
      },
      (err: FirestoreError) => {
        console.error('Firestore error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const addProduct = async (data: ProductInput): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const updateProduct = async (id: string, data: Partial<ProductInput>): Promise<void> => {
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteProduct = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION, id));
  };

  return { products, loading, error, addProduct, updateProduct, deleteProduct };
};
