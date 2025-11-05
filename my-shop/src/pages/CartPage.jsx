import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/cart.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="cart-empty">
          <div className="empty-icon">🛒</div>
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des produits pour commencer vos achats</p>
          <Link to="/" className="btn-primary">Voir les produits</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="cart-header">
        <h1>Mon Panier</h1>
        <button onClick={clearCart} className="btn-clear">
          Vider le panier
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-price">{item.price.toFixed(2)} €</p>
              </div>

              <div className="cart-item-quantity">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="btn-quantity"
                >
                  -
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="btn-quantity"
                >
                  +
                </button>
              </div>

              <div className="cart-item-total">
                {(item.price * item.quantity).toFixed(2)} €
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="btn-remove"
                title="Retirer du panier"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Récapitulatif</h2>
          <div className="summary-line">
            <span>Sous-total</span>
            <span>{getTotalPrice().toFixed(2)} €</span>
          </div>
          <div className="summary-line">
            <span>Livraison</span>
            <span>Gratuite</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{getTotalPrice().toFixed(2)} €</span>
          </div>
          <button className="btn-checkout">
            Valider la commande
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
