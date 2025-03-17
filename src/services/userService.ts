
import { User } from "../types/user";

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get all users from localStorage
export const getUsers = (): User[] => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

// Add a new user
export const addUser = (userData: Omit<User, "id" | "createdAt">): User => {
  const users = getUsers();
  
  // Check if email already exists
  const existingUser = users.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error("Email already registered");
  }
  
  const newUser: User = {
    ...userData,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem("users", JSON.stringify([...users, newUser]));
  return newUser;
};

// Login user
export const loginUser = (email: string, password: string): User | null => {
  const users = getUsers();
  
  // Special admin login
  if (email === "admin" && password === "admin") {
    return {
      id: "admin",
      firstName: "Admin",
      lastName: "User",
      email: "admin",
      age: 0,
      mobile: "",
      password: "",
      createdAt: "",
    };
  }
  
  const user = users.find(user => user.email === email && user.password === password);
  return user || null;
};

// Set current logged in user
export const setCurrentUser = (user: User): void => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

// Get current logged in user
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem("currentUser");
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.email === "admin";
};
