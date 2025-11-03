import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'E-Commerce Store',
  description: 'Modern e-commerce site built with React and Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 E-Commerce Store. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
