'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/products';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = products.find((p) => p.id === Number(params.id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        quantity: quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-96 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            unoptimized
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="mb-6">
            <span className="text-sm text-gray-600">Category: </span>
            <span className="font-semibold">{product.category}</span>
          </div>

          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-24"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{addedToCart ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>
            </>
          )}

          <button
            onClick={() => router.back()}
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}
