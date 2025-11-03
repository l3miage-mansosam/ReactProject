# E-Commerce Store

A modern e-commerce web application built with React (Frontend) and Next.js (Backend).

## Features

- **Product Catalog**: Browse through a collection of products
- **Product Details**: View detailed information about each product
- **Shopping Cart**: Add products to cart and manage quantities
- **Checkout**: Complete purchase with shipping and payment information
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **API Routes**: RESTful API endpoints for products and cart management

## Tech Stack

- **Frontend**: React 19, Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (Backend)
│   │   ├── products/      # Product API endpoints
│   │   └── cart/          # Cart API endpoints
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── lib/                   # Utility functions and data
└── types/                 # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/l3miage-mansosam/ReactProject.git
cd ReactProject
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get product by ID

### Cart
- `GET /api/cart?sessionId=[id]` - Get cart items
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart?sessionId=[id]&productId=[id]` - Remove item from cart

## Features Overview

### Frontend (React)
- Product listing with grid layout
- Product detail pages with images and descriptions
- Shopping cart with quantity management
- Checkout form with validation
- Responsive navigation
- Local storage for cart persistence

### Backend (Next.js)
- Server-side rendering with App Router
- API routes for data management
- TypeScript for type safety
- Image optimization with next/image

## Contributing

Feel free to submit issues and pull requests.

## License

ISC