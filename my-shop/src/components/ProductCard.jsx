import { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/product.css';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.image} 
            alt={product.name}
            className="product-image"
          />
        </div>
      </Link>
      
      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <span className="product-price">{product.price.toFixed(2)} €</span>
          <button 
            onClick={handleAddToCart}
            className={`btn-add-cart ${isAdded ? 'btn-added' : ''}`}
          >
            {isAdded ? '✓ Ajouté' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
