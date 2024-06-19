import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './header.css';

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      alert('Logout realizado com sucesso!');
    } catch (error) {
      if (error instanceof Error) {
        alert('Erro ao realizar logout: ' + error.message);
      } else {
        alert('Erro ao realizar logout.');
      }
    }
  };

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src="/images/logo.png" alt="Logo" className="logo" />
            <span>VidaSaudável</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/atividades">Atividades</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/alimentacao">Alimentação</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/relatorios">Relatórios</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sinais-vitais">Sinais Vitais</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cadastro">Cadastro</Link>
              </li>
            </ul>
            {user ? (
              <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
            ) : (
              <Link className="btn btn-outline-success" to="/login">Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
