import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  name: string;
  gender: 'male' | 'female';
}

interface UserContextType {
  user: User | null;
  register: (name: string, gender: 'male' | 'female') => void;
}

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const register = (name: string, gender: 'male' | 'female') => {
    setUser({ name, gender });
  };

  return (
    <UserContext.Provider value={{ user, register }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
