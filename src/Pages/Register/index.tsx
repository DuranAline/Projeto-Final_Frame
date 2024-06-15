import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Layout from '../../components/layout';
import './style.css';
export function Register() {
  const { register } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, gender);
  };

  return (
    <Layout>
      <main className="container">
        <div className="register-content">
          <h1>Cadastro de Usuário</h1>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="mb-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome"
                className="form-control"
                required
              />
            </div>
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
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="form-control"
                required
              >
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
              </select>
            </div>
            <button type="submit" className="btn btn-custom">Registrar</button>
          </form>
        </div>
      </main>
    </Layout>
  );
}

export default Register;
