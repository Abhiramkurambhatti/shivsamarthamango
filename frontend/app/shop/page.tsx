import { getProducts } from "@/lib/products";
import ShopClient from "@/components/ShopClient";

export default async function Shop() {
  const products = await getProducts();
  return <ShopClient products={products} />;
}
