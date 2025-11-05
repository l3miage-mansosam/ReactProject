import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/product-detail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsAdded(true);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleDeleteProduct = async () => {
    setDeleteLoading(true);
    try {
      await api.deleteProduct(id);
      alert('Produit supprimé avec succès !');
      navigate('/');
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Chargement du produit...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Produit introuvable</h2>
          <p>{error || "Ce produit n'existe pas"}</p>
          <Link to="/" className="btn-primary">Retour aux produits</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="breadcrumb">
        <Link to="/">Accueil</Link>
        <span className="separator">›</span>
        <span className="current">{product.name}</span>
      </div>

      {isAuthenticated && user?.role === 'admin' && (
        <div className="admin-actions">
          <Link to={`/edit-product/${product.id}`} className="btn-edit">
            ✏️ Modifier
          </Link>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className="btn-delete"
          >
            🗑️ Supprimer
          </button>
        </div>
      )}

      <div className="product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-detail-info">
          <div className="product-category-badge">{product.category}</div>
          
          <h1 className="product-detail-title">{product.name}</h1>
          
          <div className="product-detail-price">
            {product.price.toFixed(2)} €
          </div>
          
          <div className="product-detail-stock">
            {product.stock > 0 ? (
              <span className="in-stock">
                ✓ En stock ({product.stock} disponibles)
              </span>
            ) : (
              <span className="out-of-stock">
                ✗ Rupture de stock
              </span>
            )}
          </div>

          <div className="product-detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.stock > 0 && (
            <>
              <div className="quantity-selector">
                <label>Quantité :</label>
                <div className="quantity-controls">
                  <button 
                    onClick={decrementQuantity}
                    className="quantity-btn"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="quantity-btn"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="product-detail-actions">
                <button 
                  onClick={handleAddToCart}
                  className={`btn-add-large ${isAdded ? 'btn-added' : ''}`}
                >
                  {isAdded ? '✓ Ajouté au panier' : 'Ajouter au panier'}
                </button>
                
                <button 
                  onClick={() => navigate(-1)}
                  className="btn-back"
                >
                  ← Retour
                </button>
              </div>
            </>
          )}

          <div className="product-detail-features">
            <h3>Informations</h3>
            <ul>
              <li><strong>Catégorie :</strong> {product.category}</li>
              <li><strong>Stock :</strong> {product.stock} unités</li>
              <li><strong>Prix unitaire :</strong> {product.price.toFixed(2)} €</li>
              <li><strong>Référence :</strong> PROD-{product.id.toString().padStart(4, '0')}</li>
            </ul>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer "{product.name}" ?</p>
            <p className="modal-warning">Cette action est irréversible.</p>
            <div className="modal-actions">
              <button 
                onClick={handleDeleteProduct} 
                className="btn-confirm-delete"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Suppression...' : 'Oui, supprimer'}
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="btn-cancel-delete"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
