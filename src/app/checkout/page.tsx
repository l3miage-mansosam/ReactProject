'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { products } from '@/lib/products';

interface CartItem {
  productId: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
  });

  useEffect(() => {
    setMounted(true);
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  if (!mounted) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (cartItems.length === 0) {
    router.push('/cart');
    return null;
  }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would process the payment
    alert('Order placed successfully!');
    localStorage.removeItem('cart');
    router.push('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Payment Information</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Place Order
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              {cartDetails.map((item) => {
                if (!item || !item.product) return null;
                return (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
