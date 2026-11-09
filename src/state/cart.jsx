import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { whatsappUrl } from "../utils/whatsapp";
import { products } from "../data/products.js";
const currentProductIds = new Set(products.map((product) => product.id));
const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("aurae-shopping-bag");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((item) => item && item.key && item.product && currentProductIds.has(item.product.id) && Number.isFinite(item.qty) && item.qty > 0).map((item) => ({ ...item, product: products.find((product) => product.id === item.product.id) })) : [];
    } catch {
      return [];
    }
  }); // {key, product, size, qty}

  useEffect(() => {
    try {
      window.localStorage.setItem("aurae-shopping-bag", JSON.stringify(items));
    } catch {
      // The bag continues to work for the current session if storage is unavailable.
    }
  }, [items]);
  const add = (product, size) => setItems((c) => {
    const key = product.id + "|" + (size || "");
    return c.find((i) => i.key === key) ? c.map((i) => i.key === key ? { ...i, qty: i.qty + 1 } : i) : [...c, { key, product, size, qty: 1 }];
  });
  const setQty = (key, q) => setItems((c) => c.map((i) => i.key === key ? { ...i, qty: Math.max(1, q) } : i));
  const remove = (key) => setItems((c) => c.filter((i) => i.key !== key));
  const v = useMemo(() => {
    const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
    const url = whatsappUrl(items.map((i) => ({ name: i.product.name, size: i.size, qty: i.qty, price: i.product.price })), total);
    return { items, add, setQty, remove, total, count: items.reduce((s, i) => s + i.qty, 0), url };
  }, [items]);
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
