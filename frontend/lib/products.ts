export type Product = {id:number;name:string;name_mr?:string;slug:string;description?:string;description_mr?:string;weight_kg:string|number;price:string|number;stock_quantity:number;image_url:string;is_featured:boolean};
const fallback: Product[] = [
  {id:1,name:"Devgad Hapus Alphonso",name_mr:"देवगड हापूस",slug:"devgad-hapus",description:"Authentic GI-tagged Devgad Alphonso. Hand-picked from coastal laterite soil orchards with rich golden aroma.",weight_kg:5,price:2400,stock_quantity:24,image_url:"/images/devgad-hapus.jpg",is_featured:true},
  {id:2,name:"Ratnagiri Hapus",name_mr:"रत्नागिरी हापूस",slug:"ratnagiri-hapus",description:"Classic Konkan Ratnagiri Alphonso with sweet tender pulp, naturally ripened in hay.",weight_kg:5,price:2200,stock_quantity:18,image_url:"/images/ratnagiri-hapus.jpg",is_featured:true},
  {id:3,name:"Kesar Mango",name_mr:"केसर आंबा",slug:"kesar-mango",description:"Fragrant golden-saffron Kesar mangoes known for intense natural sweetness and distinct aroma.",weight_kg:3,price:950,stock_quantity:32,image_url:"/images/kesar-mango.jpg",is_featured:true},
  {id:4,name:"Mango Gift Box",name_mr:"आंबा गिफ्ट बॉक्स",slug:"mango-gift-box",description:"Traditional wooden peti packed with farm-fresh handpicked Alphonso in natural paddy straw.",weight_kg:3,price:1800,stock_quantity:14,image_url:"/images/gift-box.jpg",is_featured:true}
];
export async function getProducts(): Promise<Product[]> {
 try { const r=await fetch(`${API_URL}/products/`,{cache:"no-store"}); if(!r.ok) return fallback; const d=await r.json(); return d.results || d; } catch { return fallback; }
}
import { API_URL } from "./config";
export { fallback };
