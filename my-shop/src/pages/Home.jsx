import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
import ProductFilters from '../components/ProductFilters';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = ({ category, priceRange, sortBy }) => {
    let filtered = [...allProducts];

    // Filtrer par catégorie
    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }

    // Filtrer par prix
    if (priceRange !== 'all') {
      if (priceRange === '0-30') {
        filtered = filtered.filter(product => product.price < 30);
      } else if (priceRange === '30-60') {
        filtered = filtered.filter(product => product.price >= 30 && product.price < 60);
      } else if (priceRange === '60-100') {
        filtered = filtered.filter(product => product.price >= 60 && product.price < 100);
      } else if (priceRange === '100+') {
        filtered = filtered.filter(product => product.price >= 100);
      }
    }

    // Trier
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(filtered);
  };

  const categories = [...new Set(allProducts.map(product => product.category))];

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Chargement des produits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error">Erreur : {error}</div>
      </div>
    );
  }

  return (
    <div className="page-container-full">
      <div className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title-large">Découvrez nos produits</h1>
          <p className="hero-subtitle-large">
            Une sélection d'articles de qualité pour tous vos besoins
          </p>
          
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/add-product" className="btn-add-product-hero">
              ➕ Ajouter un nouveau produit
            </Link>
          )}
        </div>
      </div>
      
      <div className="page-container">
        <div className="products-section">
          <ProductFilters 
            onFilterChange={handleFilterChange}
            categories={categories}
          />
          
          <div className="products-content">
            <div className="products-count">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </div>
            <ProductList products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
