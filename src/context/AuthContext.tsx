import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../services/firebaseConnection';


interface AuthContextType {
 user: User | null;
 login: (email: string, password: string) => Promise<void>;
 logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | null>(null);


interface AuthProviderProps {
 children: ReactNode;
}


export function AuthProvider({ children }: AuthProviderProps) {
 const [user, setUser] = useState<User | null>(null);


 useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, (user) => {
     if (user) {
       setUser(user);
     } else {
       setUser(null);
     }
   });


   return () => unsubscribe();
 }, []);


 const login = async (email: string, password: string) => {
   await signInWithEmailAndPassword(auth, email, password);
 };


 const logout = async () => {
   await signOut(auth);
 };


 return (
   <AuthContext.Provider value={{ user, login, logout }}>
     {children}
   </AuthContext.Provider>
 );
}


export const useAuth = () => useContext(AuthContext);
