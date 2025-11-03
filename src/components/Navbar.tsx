'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            E-Shop
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link
              href="/products"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="flex items-center text-gray-700 hover:text-primary transition-colors"
            >
              <ShoppingCart className="w-5 h-5 mr-1" />
              Cart
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
