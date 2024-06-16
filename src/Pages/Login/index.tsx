import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout';


export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert('Login realizado com sucesso!');
    } catch (error) {
      if (error instanceof Error) {
        alert('Erro ao realizar login: ' + error.message);
      } else {
        alert('Erro ao realizar login.');
      }
    }
  };

  return (
    <Layout>
      <main className="container">
        <div className="login-content">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-custom">Login</button>
          </form>
        </div>
      </main>
    </Layout>
  );
}

export default Login;
