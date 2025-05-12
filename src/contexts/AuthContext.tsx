
import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // In a real app, this would call an API endpoint
  const login = async (email: string, password: string) => {
    try {
      // Mock login - would be replaced with actual API call
      if (email && password) {
        const mockUser = {
          id: '1',
          email,
          name: email.split('@')[0],
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast.success('Logged in successfully');
      } else {
        throw new Error('Email and password are required');
      }
    } catch (error) {
      toast.error('Login failed');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
