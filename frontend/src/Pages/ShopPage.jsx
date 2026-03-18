// src/Pages/ShopPage.jsx
import ProductList from "./ProductList";

export default function ShopPage() {
  // Shop = no hero, just product grid (later sidebar filters)
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Shop Now</h1>

        <select className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100">
          <option>Sort by</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
        </select>
      </div>

      <ProductList showHero={false} title="Shop Now" />
    </main>
  );
}