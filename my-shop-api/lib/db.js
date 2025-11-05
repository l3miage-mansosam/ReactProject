import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const ensureDir = () => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
};

const ensureFile = (filename, initial = '[]') => {
  ensureDir();
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, initial, 'utf8');
  }
};

export const readJSON = (filename) => {
  try {
    ensureFile(filename);
    const filePath = path.join(dataDir, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    return [];
  }
};

export const writeJSON = (filename, data) => {
  try {
    ensureFile(filename);
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    return false;
  }
};

export const getProducts = () => readJSON('products.json');
export const saveProducts = (products) => writeJSON('products.json', products);

export const getUsers = () => readJSON('users.json');
export const saveUsers = (users) => writeJSON('users.json', users);

export const getCart = () => readJSON('cart.json');
export const saveCart = (cart) => writeJSON('cart.json', cart);

export const getProductById = (id) => {
  const products = getProducts();
  return products.find(p => p.id === parseInt(id));
};

export const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(u => u.email === email);
};

export const authenticateUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return null;
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Cart helpers (per-user map)
export const getCartByUser = (userId) => {
  const store = getCart() || {};
  return store[userId] || [];
};

export const saveCartForUser = (userId, items) => {
  const store = getCart() || {};
  store[userId] = items;
  saveCart(store);
  return store[userId];
};

export const addToCart = (userId, productId, quantity = 1) => {
  const items = getCartByUser(userId);
  const idx = items.findIndex(i => i.productId === parseInt(productId));
  if (idx !== -1) {
    items[idx].quantity += quantity;
  } else {
    items.push({ productId: parseInt(productId), quantity });
  }
  saveCartForUser(userId, items);
  return items;
};

export const removeFromCart = (userId, productId) => {
  const items = getCartByUser(userId);
  const newItems = items.filter(i => i.productId !== parseInt(productId));
  saveCartForUser(userId, newItems);
  return newItems;
};

export const updateCartItem = (userId, productId, quantity) => {
  const items = getCartByUser(userId);
  const idx = items.findIndex(i => i.productId === parseInt(productId));
  if (idx !== -1) {
    if (quantity <= 0) items.splice(idx, 1);
    else items[idx].quantity = quantity;
    saveCartForUser(userId, items);
  }
  return items;
};

export const clearCartForUser = (userId) => {
  saveCartForUser(userId, []);
  return [];
};
export const clearCart = (userId) => {
  const store = getCart() || {};
  store[userId] = [];
  return saveCart(store);
};
