"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number;
  cartKey: string;
  name: string;
  price: number;
  weight: number;
  image_url: string;
  qty: number;
  unit: string;
  unitLabel?: string;
};

type Ctx = {
  cart: CartItem[];
  add: (p: any, selectedUnit?: string, customPrice?: number, customUnitLabel?: string) => void;
  change: (cartKeyOrId: string | number, n: number) => void;
  remove: (cartKeyOrId: string | number) => void;
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
      const raw = JSON.parse(localStorage.getItem("ssh-cart") || "[]");
      // Migration for old items missing cartKey or unit
      const normalized = raw.map((item: any) => ({
        ...item,
        cartKey: item.cartKey || `${item.id}-${item.unit || "box"}`,
        unit: item.unit || "box",
        unitLabel: item.unitLabel || (item.unit === "dozen" ? "१ डझन (1 Dozen)" : item.unit === "grams" ? "५०० ग्रॅम (500g)" : item.unit === "kg" ? "१ किलो (1 Kg)" : "५ किलो पेटी (5kg Box)")
      }));
      setCart(normalized);
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

  const add = (p: any, selectedUnit?: string, customPrice?: number, customUnitLabel?: string) => {
    const unit = selectedUnit || (p.available_units && p.available_units[0]) || "box";
    const itemPrice = customPrice !== undefined && customPrice !== null
      ? Number(customPrice)
      : p.unit_prices && p.unit_prices[unit]
      ? Number(p.unit_prices[unit])
      : Number(p.price);

    const key = `${p.id}-${unit}`;

    const defaultUnitLabel =
      unit === "dozen"
        ? (lang === "mr" ? "१ डझन (Dozen)" : "1 Dozen")
        : unit === "grams"
        ? (lang === "mr" ? "५०० ग्रॅम (Grams)" : "500 Grams")
        : unit === "kg"
        ? (lang === "mr" ? "१ किलो (Kg)" : "1 Kg")
        : (lang === "mr" ? `${p.weight_kg || 5} किलो पेटी (Box)` : `${p.weight_kg || 5}kg Box`);

    const label = customUnitLabel || defaultUnitLabel;

    setCart((old) => {
      const found = old.find((x) => x.cartKey === key || (x.id === p.id && x.unit === unit));
      return found
        ? old.map((x) => (x.cartKey === found.cartKey ? { ...x, qty: x.qty + 1 } : x))
        : [
            ...old,
            {
              id: p.id,
              cartKey: key,
              name: (lang === "mr" && p.name_mr) ? p.name_mr : p.name,
              price: itemPrice,
              weight: Number(p.weight_kg || 5),
              image_url: p.image_url,
              qty: 1,
              unit,
              unitLabel: label,
            },
          ];
    });
  };

  const change = (cartKeyOrId: string | number, n: number) =>
    setCart((old) =>
      old.map((x) =>
        x.cartKey === String(cartKeyOrId) || x.id === Number(cartKeyOrId)
          ? { ...x, qty: Math.max(1, n) }
          : x
      )
    );

  const remove = (cartKeyOrId: string | number) =>
    setCart((old) =>
      old.filter((x) => x.cartKey !== String(cartKeyOrId) && x.id !== Number(cartKeyOrId))
    );

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
