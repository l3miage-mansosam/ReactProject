'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/products';
import { Trash2 } from 'lucide-react';

interface CartItem {
  productId: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <p>Loading...</p>
      </div>
    );
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId: number) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getCartDetails = () => {
    return cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    }).filter(Boolean);
  };

  const cartDetails = getCartDetails();
  const total = cartDetails.reduce(
    (sum, item) => sum + (item?.product.price || 0) * item!.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <p className="text-gray-600 mb-6">Your cart is empty</p>
        <Link
          href="/products"
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartDetails.map((item) => {
              if (!item || !item.product) return null;
              return (
                <div
                  key={item.productId}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4"
                >
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                      unoptimized
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-lg font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-primary text-white text-center px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block w-full text-center mt-4 text-gray-600 hover:text-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
