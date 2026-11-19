export type Product = {
  id: number;
  name: string;
  name_mr?: string;
  slug: string;
  category?: string;
  description?: string;
  description_mr?: string;
  weight_kg: string | number;
  price: string | number;
  compare_at_price?: string | number | null;
  stock_quantity: number;
  image_url: string;
  available_units?: string[];
  unit_prices?: Record<string, number>;
  is_featured: boolean;
  is_active?: boolean;
};

const fallback: Product[] = [
  {
    id: 1,
    name: "Devgad Hapus Alphonso",
    name_mr: "देवगड हापूस (अस्सल पेटंट)",
    slug: "devgad-hapus",
    category: "hapus",
    description: "Authentic GI-tagged Devgad Alphonso. Hand-picked from coastal laterite soil orchards with rich golden aroma and saffron sweetness.",
    description_mr: "भौगोलिक मानांकन (GI Tag) प्राप्त अस्सल देवगड हापूस. नारिंग्रे गावातील जांभ्या खडकाच्या जमिनीतून हाताने निवडलेला, नैसर्गिक आडीत पिकवलेला सुवर्ण हापूस.",
    weight_kg: 5,
    price: 2400,
    compare_at_price: 2800,
    stock_quantity: 24,
    image_url: "/images/devgad-hapus.jpg",
    available_units: ["dozen", "box", "kg", "grams"],
    unit_prices: { dozen: 1440, box: 2400, kg: 480, grams: 240 },
    is_featured: true,
    is_active: true,
  },
  {
    id: 2,
    name: "Ratnagiri Hapus",
    name_mr: "रत्नागिरी हापूस",
    slug: "ratnagiri-hapus",
    category: "hapus",
    description: "Classic Konkan Ratnagiri Alphonso with sweet tender pulp, naturally ripened in organic paddy straw.",
    description_mr: "कोकणच्या लाल मातीतील अस्सल चवीचा रत्नागिरी हापूस. मऊ, रसाळ आणि पारंपरिक गवताच्या आडीत पिकवलेला.",
    weight_kg: 5,
    price: 2200,
    compare_at_price: 2500,
    stock_quantity: 18,
    image_url: "/images/ratnagiri-hapus.jpg",
    available_units: ["dozen", "box", "kg", "grams"],
    unit_prices: { dozen: 1320, box: 2200, kg: 440, grams: 220 },
    is_featured: true,
    is_active: true,
  },
  {
    id: 3,
    name: "Kesar Mango",
    name_mr: "केशरी केसर आंबा",
    slug: "kesar-mango",
    category: "other",
    description: "Fragrant golden-saffron Kesar mangoes known for intense natural sweetness, vibrant color, and distinct aroma.",
    description_mr: "घमघमाट पसरवणारा, गडद केशरी रंगाचा रसाळ केसर आंबा. नैसर्गिक गोडवा आणि उत्तम चव.",
    weight_kg: 3,
    price: 950,
    compare_at_price: 1150,
    stock_quantity: 32,
    image_url: "/images/kesar-mango.jpg",
    available_units: ["dozen", "box", "kg", "grams"],
    unit_prices: { dozen: 570, box: 950, kg: 317, grams: 158 },
    is_featured: true,
    is_active: true,
  },
  {
    id: 4,
    name: "Mango Royal Gift Peti",
    name_mr: "शाही आंबा सप्रेम भेट पेटी",
    slug: "mango-gift-box",
    category: "gift",
    description: "Traditional wooden peti packed with farm-fresh handpicked Alphonso in natural paddy straw, custom festive postcard included.",
    description_mr: "पारंपरिक लाकडी पेटीत नैसर्गिक पेंढ्यात सजवलेली भेट पेटी. सण-समारंभ आणि आप्तेष्टांना भेट देण्यासाठी सुवर्ण दर्जाचे हापूस.",
    weight_kg: 4,
    price: 1800,
    compare_at_price: 2100,
    stock_quantity: 14,
    image_url: "/images/gift-box.jpg",
    available_units: ["box", "dozen"],
    unit_prices: { box: 1800, dozen: 1200 },
    is_featured: true,
    is_active: true,
  },
];
export async function getProducts(): Promise<Product[]> {
 try { const r=await fetch(`${API_URL}/products/`,{cache:"no-store"}); if(!r.ok) return fallback; const d=await r.json(); return d.results || d; } catch { return fallback; }
}
import { API_URL } from "./config";
export { fallback };
