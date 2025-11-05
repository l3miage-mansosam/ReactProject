export const users = [
  { 
    id: 1, 
    email: "user@test.com", 
    password: "1234", 
    name: "Utilisateur Test",
    role: "user"
  },
  { 
    id: 2, 
    email: "admin@test.com", 
    password: "admin", 
    name: "Admin Test",
    role: "admin"
  }
];

export const findUserByEmail = (email) => {
  return users.find(u => u.email === email);
};

export const authenticateUser = (email, password) => {
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};
