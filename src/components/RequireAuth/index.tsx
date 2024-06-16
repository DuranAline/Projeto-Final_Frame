// src/components/RequireAuth/index.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ConteudoRestrito from '../conteudoRestrito';
import Layout from '../layout';

interface RequireAuthProps {
  children: JSX.Element;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <Layout>
      {!user ? <ConteudoRestrito /> : children}
    </Layout>
  );
};
