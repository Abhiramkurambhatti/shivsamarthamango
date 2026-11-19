"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  weight: number;
  image_url: string;
  qty: number;
};

type Ctx = {
  cart: CartItem[];
  add: (p: any) => void;
  change: (id: number, n: number) => void;
  remove: (id: number) => void;
  count: number;
  total: number;
  lang: string;
  setLang: (s: string) => void;
  theme: string;
  toggleTheme: () => void;
};

const StoreContext = createContext<Ctx>(null as any);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lang, setLang] = useState("mr");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("ssh-cart") || "[]"));
      setLang(localStorage.getItem("ssh-lang") || "mr");
      setTheme(localStorage.getItem("ssh-theme") || "light");
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("ssh-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("ssh-lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ssh-theme", theme);
  }, [theme]);

  const add = (p: any) =>
    setCart((old) => {
      const found = old.find((x) => x.id === p.id);
      return found
        ? old.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x))
        : [
            ...old,
            {
              id: p.id,
              name: p.name_mr || p.name,
              price: Number(p.price),
              weight: Number(p.weight_kg),
              image_url: p.image_url,
              qty: 1,
            },
          ];
    });

  const change = (id: number, n: number) =>
    setCart((old) => old.map((x) => (x.id === id ? { ...x, qty: Math.max(1, n) } : x)));

  const remove = (id: number) => setCart((old) => old.filter((x) => x.id !== id));

  const value = useMemo(
    () => ({
      cart,
      add,
      change,
      remove,
      count: cart.reduce((a, x) => a + x.qty, 0),
      total: cart.reduce((a, x) => a + x.price * x.qty, 0),
      lang,
      setLang,
      theme,
      toggleTheme: () => setTheme((x) => (x === "light" ? "dark" : "light")),
    }),
    [cart, lang, theme]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
