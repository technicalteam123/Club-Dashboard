import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@workspace/api-client-react';

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('efff_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (newUser: User, token: string) => {
    setUser(newUser);
    localStorage.setItem('efff_user', JSON.stringify(newUser));
    localStorage.setItem('efff_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('efff_user');
    localStorage.removeItem('efff_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
