import './footer.css';

export function Footer() {
  return (
    <footer className="text-center py-3">
      <div className="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/face.png" alt="Facebook" className="social-icon" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/X.png" alt="Twitter" className="social-icon" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/instagram.png" alt="Instagram" className="social-icon" />
        </a>
      </div>
      <p>&copy; 2024 VidaSaudável. Todos os direitos reservados.</p>
      <p>
        <a href="/privacy-policy">Política de Privacidade</a> | <a href="/terms-of-service">Termos de Serviço</a>
      </p>
    </footer>
  );
}

export default Footer;
