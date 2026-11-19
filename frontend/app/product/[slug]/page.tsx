import { getProducts } from "@/lib/products";
import ProductDetail from "./ProductDetail";
export default async function ProductPage({params}:{params:{slug:string}}){const products=await getProducts();const p=products.find(x=>x.slug===params.slug);if(!p)return <main className="container page-title"><h1>Product not found</h1></main>;return <ProductDetail p={p}/>;}
