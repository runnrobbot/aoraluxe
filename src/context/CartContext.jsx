import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addItem = useCallback((product) => {
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

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.price ?? 0) * i.qty, 0);

  const buildWhatsAppMessage = () => {
    const lines = items.map(
      (i) => `• ${i.name} (${i.category || 'Produk'}) — ${i.qty}x @ Rp ${i.price?.toLocaleString('id-ID')} = Rp ${(i.price * i.qty).toLocaleString('id-ID')}`
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
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, drawerOpen, setDrawerOpen, buildWhatsAppMessage }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
