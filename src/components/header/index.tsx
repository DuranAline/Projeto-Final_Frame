import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-primary text-white text-center py-3">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Registro de Atividades Físicas</Link>
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
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;