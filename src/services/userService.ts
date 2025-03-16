
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  mobile: string;
  password: string;
  createdAt: Date;
}

// Store users in local storage
class UserService {
  private readonly USERS_STORAGE_KEY = 'voice_learning_users';
  private readonly CURRENT_USER_KEY = 'voice_learning_current_user';
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  getUsers(): User[] {
    const usersJSON = localStorage.getItem(this.USERS_STORAGE_KEY);
    return usersJSON ? JSON.parse(usersJSON) : [];
  }
  
  saveUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Email already registered');
    }
    
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date()
    };
    
    users.push(newUser);
    localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(users));
    
    return newUser;
  }
  
  login(email: string, password: string): User | null {
    // Special case for admin
    if (email === 'admin' && password === 'admin') {
      const adminUser: User = {
        id: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin',
        age: 0,
        mobile: '',
        password: 'admin',
        createdAt: new Date()
      };
      this.setCurrentUser(adminUser);
      return adminUser;
    }
    
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.setCurrentUser(user);
      return user;
    }
    
    return null;
  }
  
  setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }
  
  getCurrentUser(): User | null {
    const userJSON = localStorage.getItem(this.CURRENT_USER_KEY);
    return userJSON ? JSON.parse(userJSON) : null;
  }
  
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
  
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
  
  isAdmin(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.id === 'admin';
  }
}

export const userService = new UserService();
export type { User };
