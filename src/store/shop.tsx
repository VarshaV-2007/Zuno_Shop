import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "@/data/catalog";

const CART_KEY = "zuno.cart.v1";
const WISH_KEY = "zuno.wishlist.v1";
const RECENT_KEY = "zuno.recent.v1";

export type CartItem = { id: string; qty: number };

type ShopState = {
  cart: CartItem[];
  wishlist: string[];
  recent: string[];
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  markRecent: (id: string) => void;
  cartCount: number;
  cartSubtotal: number;
  cartMrpTotal: number;
  cartSavings: number;
  deliveryFee: number;
  cartTotal: number;
  cartProducts: (Product & { qty: number })[];
};

const ShopCtx = createContext<ShopState | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setCart(readJSON<CartItem[]>(CART_KEY, []));
    setWishlist(readJSON<string[]>(WISH_KEY, []));
    setRecent(readJSON<string[]>(RECENT_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); }, [wishlist, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(RECENT_KEY, JSON.stringify(recent)); }, [recent, hydrated]);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === id);
      if (existing) return c.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      return [...c, { id, qty }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty } : i))));
  }, []);

  const removeFromCart = useCallback((id: string) => setCart((c) => c.filter((i) => i.id !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  }, []);
  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const markRecent = useCallback((id: string) => {
    setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 12));
  }, []);

  const cartProducts = useMemo(() => {
    return cart
      .map((i) => {
        const p = products.find((x) => x.id === i.id);
        return p ? { ...p, qty: i.qty } : null;
      })
      .filter(Boolean) as (Product & { qty: number })[];
  }, [cart]);

  const cartSubtotal = useMemo(() => cartProducts.reduce((s, p) => s + p.price * p.qty, 0), [cartProducts]);
  const cartMrpTotal = useMemo(() => cartProducts.reduce((s, p) => s + (p.mrp ?? p.price) * p.qty, 0), [cartProducts]);
  const cartSavings = cartMrpTotal - cartSubtotal;
  const cartCount = cartProducts.reduce((s, p) => s + p.qty, 0);
  const deliveryFee = cartSubtotal === 0 ? 0 : cartSubtotal >= 199 ? 0 : 25;
  const cartTotal = cartSubtotal + deliveryFee;

  const value: ShopState = {
    cart, wishlist, recent,
    addToCart, setQty, removeFromCart, clearCart,
    toggleWishlist, isWishlisted, markRecent,
    cartCount, cartSubtotal, cartMrpTotal, cartSavings, deliveryFee, cartTotal, cartProducts,
  };

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopCtx);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
