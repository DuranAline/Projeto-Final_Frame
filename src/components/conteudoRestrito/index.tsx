import 'react';
import './style.css';

const ConteudoRestrito: React.FC = () => {
  return (
    <div className="restricted-container">
      <h1>Conteúdo Restrito</h1>
      <p>Esta página é acessível apenas para usuários cadastrados. Por favor, faça o cadastro ou efetue seu login.</p>
      <img src="/images/fun_padlock.png" alt="Conteúdo Restrito" className="restricted-image" />
    </div>
  );
}

export default ConteudoRestrito;
