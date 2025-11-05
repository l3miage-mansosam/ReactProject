// Stockage en mémoire des paniers (objet clé-valeur)
// Clé = userId, Valeur = tableau de produits
let carts = {};

// Récupérer le panier d'un utilisateur
export const getCart = (userId) => {
  return carts[userId] || [];
};

// Ajouter un produit au panier
export const addToCart = (userId, productId, quantity = 1) => {
  if (!carts[userId]) {
    carts[userId] = [];
  }
  
  const existingItem = carts[userId].find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userId].push({ productId, quantity });
  }
  
  return carts[userId];
};

// Mettre à jour la quantité d'un produit
export const updateCartItem = (userId, productId, quantity) => {
  if (!carts[userId]) {
    return [];
  }
  
  const itemIndex = carts[userId].findIndex(item => item.productId === productId);
  
  if (itemIndex !== -1) {
    if (quantity <= 0) {
      carts[userId].splice(itemIndex, 1);
    } else {
      carts[userId][itemIndex].quantity = quantity;
    }
  }
  
  return carts[userId];
};

// Supprimer un produit du panier
export const removeFromCart = (userId, productId) => {
  if (!carts[userId]) {
    return [];
  }
  
  carts[userId] = carts[userId].filter(item => item.productId !== productId);
  return carts[userId];
};

// Vider complètement le panier
export const clearCart = (userId) => {
  carts[userId] = [];
  return [];
};
