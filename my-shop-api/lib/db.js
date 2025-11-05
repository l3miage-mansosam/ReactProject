import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export const readJSON = (filename) => {
  try {
    const filePath = path.join(dataDir, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

export const writeJSON = (filename, data) => {
  try {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
};

export const getProducts = () => readJSON('products.json');
export const saveProducts = (products) => writeJSON('products.json', products);

export const getUsers = () => readJSON('users.json');
export const saveUsers = (users) => writeJSON('users.json', users);

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
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};
