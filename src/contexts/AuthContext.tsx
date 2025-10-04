import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  managerId?: string;
  currency: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  country: string;
  currency: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  company: Company | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, companyName: string, country: string, currency: string) => Promise<void>;
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Country to currency mapping
  const getCurrencyForCountry = (country: string): string => {
    const currencyMap: Record<string, string> = {
      'United States': 'USD',
      'United Kingdom': 'GBP',
      'Germany': 'EUR',
      'France': 'EUR',
      'Italy': 'EUR',
      'Spain': 'EUR',
      'Netherlands': 'EUR',
      'India': 'INR',
      'Japan': 'JPY',
      'China': 'CNY',
      'Canada': 'CAD',
      'Australia': 'AUD',
      'Brazil': 'BRL',
      'Mexico': 'MXN',
      'South Korea': 'KRW',
      'Singapore': 'SGD',
      'Switzerland': 'CHF',
      'Sweden': 'SEK',
      'Norway': 'NOK',
      'Denmark': 'DKK',
    };
    return currencyMap[country] || 'USD';
  };

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    const storedCompany = localStorage.getItem('company');
    const storedUsers = localStorage.getItem('users');
    
    if (storedUser && storedCompany) {
      setUser(JSON.parse(storedUser));
      setCompany(JSON.parse(storedCompany));
    }
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For local/demo mode: allow quick login using credentials defined in .env (Vite)
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const demoUsername = import.meta.env.VITE_DEMO_USERNAME || 'Spencer';
      const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'mysql';

      // If user used demo credentials, create or reuse a demo user from localStorage
      if ((email === demoUsername || email === demoUsername.toLowerCase()) && password === demoPassword) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const storedUsers = localStorage.getItem('users');
        const allUsers = storedUsers ? JSON.parse(storedUsers) : [];
        let foundUser = allUsers.find((u: User) => u.email === demoUsername || u.name === demoUsername);
        if (!foundUser) {
          // create a demo admin user for quick testing
          foundUser = {
            id: `user-${Date.now()}`,
            email: `${demoUsername.toLowerCase()}@example.com`,
            name: demoUsername,
            role: 'admin',
            companyId: `company-${Date.now()}`,
            currency: 'USD',
            status: 'active',
            createdAt: new Date().toISOString(),
          };
          const demoCompany = {
            id: foundUser.companyId,
            name: `${demoUsername}'s Company`,
            country: 'United States',
            currency: 'USD',
            createdAt: new Date().toISOString(),
          };
          setCompany(demoCompany);
          setUsers([foundUser]);
          localStorage.setItem('company', JSON.stringify(demoCompany));
          localStorage.setItem('users', JSON.stringify([foundUser]));
        } else {
          const storedCompany = localStorage.getItem('company');
          if (storedCompany) setCompany(JSON.parse(storedCompany));
        }

        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return;
      }

      // Simulate API call for non-demo users - placeholder for real API integration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in stored users
      const storedUsers = localStorage.getItem('users');
      const allUsers = storedUsers ? JSON.parse(storedUsers) : [];
      const foundUser = allUsers.find((u: User) => u.email === email);

      if (!foundUser) {
        throw new Error('User not found');
      }

      const storedCompany = localStorage.getItem('company');
      const companyData = storedCompany ? JSON.parse(storedCompany) : null;

      setUser(foundUser);
      setCompany(companyData);
      setUsers(allUsers);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    companyName: string,
    country: string,
    currency: string
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const companyCurrency = currency || getCurrencyForCountry(country);
      
      const newCompany: Company = {
        id: `company-${Date.now()}`,
        name: companyName,
        country,
        currency: companyCurrency,
        createdAt: new Date().toISOString(),
      };

      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: 'admin', // First user is always admin
        companyId: newCompany.id,
        currency: companyCurrency,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      setCompany(newCompany);
      setUsers([newUser]);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('company', JSON.stringify(newCompany));
      localStorage.setItem('users', JSON.stringify([newUser]));
    } catch (error) {
      throw new Error('Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'status'>) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Only admins can create users');
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Only admins can update users');
    }

    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, ...updates } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update current user if it's the same user
    if (user.id === userId) {
      const updatedUser = updatedUsers.find(u => u.id === userId);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
  };

  const deleteUser = async (userId: string) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Only admins can delete users');
    }

    if (user.id === userId) {
      throw new Error('Cannot delete your own account');
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
    setUsers([]);
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    localStorage.removeItem('users');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      company, 
      users, 
      login, 
      signup, 
      createUser, 
      updateUser, 
      deleteUser, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
