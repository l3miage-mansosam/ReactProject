import Link from 'next/link';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing products at great prices
        </p>
        <Link
          href="/products"
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Shop Now
        </Link>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
