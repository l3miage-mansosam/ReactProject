// lib/db.js
const API_KEY = "$2a$10$1jDeR.JHxQsNb2LGfUfhfe4LfZB0y0bNx11VPUSxhwZFcy7OmTd/K";
const PRODUCTS_BIN_ID = "690ba4bb43b1c97be99b3d92";
const USERS_BIN_ID = "690ba43b43b1c97be99b3ccf";

const BASE_HEADERS = {
  "Content-Type": "application/json",
  "X-Master-Key": API_KEY,
};

// ---------------- PRODUITS ----------------
export async function getProducts() {
      console.log("📡 Lecture des produits depuis JSONBin...");

  const res = await fetch(`https://api.jsonbin.io/v3/b/${PRODUCTS_BIN_ID}`, {
    headers: BASE_HEADERS,
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération des produits");
  const data = await res.json();
  return data.record || [];
}

export async function saveProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    console.warn("⚠️ Tentative de sauvegarde vide ignorée");
    return;
  }

  const res = await fetch(`https://api.jsonbin.io/v3/b/${PRODUCTS_BIN_ID}`, {
    method: "PUT",
    headers: BASE_HEADERS,
    body: JSON.stringify(products),
  });

  if (!res.ok) throw new Error("Erreur lors de la sauvegarde des produits");
  return await res.json();
}

// ---------------- UTILISATEURS ----------------
export async function getUsers() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}`, {
    headers: BASE_HEADERS,
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
  const data = await res.json();
  return data.record || [];
}

export async function saveUsers(users) {
  if (!Array.isArray(users) || users.length === 0) {
    console.warn("Tentative de sauvegarde vide ignorée");
    return;
  }

  const res = await fetch(`https://api.jsonbin.io/v3/b/${USERS_BIN_ID}`, {
    method: "PUT",
    headers: BASE_HEADERS,
    body: JSON.stringify(users),
  });

  if (!res.ok) throw new Error("Erreur lors de la sauvegarde des utilisateurs");
  return await res.json();
}

// ---------------- CART ----------------
let cartStore = {};

export const getCartByUser = (userId) => cartStore[userId] || [];

export const saveCartForUser = (userId, items) => {
  cartStore[userId] = items;
  return cartStore[userId];
};

export const addToCart = (userId, productId, quantity = 1) => {
  const items = getCartByUser(userId);
  const idx = items.findIndex(i => i.productId === parseInt(productId));
  if (idx !== -1) items[idx].quantity += quantity;
  else items.push({ productId: parseInt(productId), quantity });
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
  }
  saveCartForUser(userId, items);
  return items;
};

export const clearCartForUser = (userId) => {
  cartStore[userId] = [];
  return [];
};
