import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Bienvenido a GymMaster</h1>
        <p className="home-tagline">Sistema de gestión de gimnasio y control de membresías.</p>
        
        <div className="home-actions">
          <Link to="/login" className="btn-home primary">Iniciar Sesión</Link>
          <Link to="/registro" className="btn-home secondary">Registrarse</Link>
        </div>
      </div>
    </div>
  );
}
export default Home;