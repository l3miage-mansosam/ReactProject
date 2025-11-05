let carts = {};

export const getCart = (userId) => {
  return carts[userId] || [];
};

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

export const removeFromCart = (userId, productId) => {
  if (!carts[userId]) {
    return [];
  }
  
  carts[userId] = carts[userId].filter(item => item.productId !== productId);
  return carts[userId];
};

export const clearCart = (userId) => {
  carts[userId] = [];
  return [];
};
