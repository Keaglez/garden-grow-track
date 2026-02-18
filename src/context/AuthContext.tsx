import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials for local auth
const INITIAL_USERS = [
  { email: 'admin@gardentrack.co.za', password: 'admin123', name: 'Admin' },
  { email: 'manager@gardentrack.co.za', password: 'manager123', name: 'Manager' },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('gardentrack_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<{ email: string; password: string; name: string }[]>(() => {
    const saved = localStorage.getItem('gardentrack_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const login = (email: string, password: string): boolean => {
    const found = registeredUsers.find(u => u.email === email && u.password === password);
    if (found) {
      const userData = { name: found.name, email: found.email };
      setUser(userData);
      localStorage.setItem('gardentrack_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string): boolean => {
    if (registeredUsers.find(u => u.email === email)) return false;
    const newUser = { name, email, password };
    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    localStorage.setItem('gardentrack_users', JSON.stringify(updated));
    const userData = { name, email };
    setUser(userData);
    localStorage.setItem('gardentrack_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gardentrack_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
