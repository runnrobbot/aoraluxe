import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Product } from '../types/product';

interface CartItem extends Product {
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  buildWhatsAppMessage: () => string;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, i) => sum + (i.price ?? 0) * i.qty, 0), [items]);

  const buildWhatsAppMessage = useCallback(() => {
    const lines = items.map(
      (i) =>
        `• ${i.name} (${i.category || 'Produk'}) — ${i.qty}x @ Rp ${i.price?.toLocaleString('id-ID')} = Rp ${(i.price * i.qty).toLocaleString('id-ID')}`
    );
    const text = [
      'Halo AORA LUXE! Saya ingin memesan:',
      '',
      ...lines,
      '',
      `Total: Rp ${totalPrice.toLocaleString('id-ID')}`,
      '',
      'Mohon konfirmasinya, terima kasih',
    ].join('\n');
    return `https://api.whatsapp.com/send/?phone=6281214857082&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
  }, [items, totalPrice]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
        drawerOpen,
        setDrawerOpen,
        buildWhatsAppMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
