import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@workspace/api-client-react';

interface AuthContextType {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const getWixUser = (): User | null => {
  const searchParams = new URLSearchParams(window.location.search);
  const memberId = searchParams.get('memberId');
  const role = searchParams.get('role');

  if (!memberId || (role !== 'user' && role !== 'doctor' && role !== 'admin')) return null;

  return {
    id: memberId,
    name: memberId,
    email: '',
    role,
    membershipPlan: 'standard',
    journeyStage: 'Consultation Pending',
    createdAt: new Date().toISOString(),
  } as unknown as User;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const wixUser = getWixUser();
  const [user, setUser] = useState<User | null>(() => {
    if (wixUser) return wixUser;
    const stored = localStorage.getItem('efff_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [authenticated, setAuthenticated] = useState(() => Boolean(wixUser || user));
  const [loading] = useState(false);

  const login = (newUser: User, token: string) => {
    setUser(newUser);
    setAuthenticated(true);
    localStorage.setItem('efff_user', JSON.stringify(newUser));
    localStorage.setItem('efff_token', token);
  };

  const logout = () => {
    setUser(null);
    setAuthenticated(false);
    localStorage.removeItem('efff_user');
    localStorage.removeItem('efff_token');
  };

  return (
    <AuthContext.Provider value={{ user, authenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
