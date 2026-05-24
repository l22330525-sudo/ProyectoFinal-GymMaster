import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InicioMiembro.css';

function InicioMiembro() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); 
  };

  return (
    <div className="inicio-miembro-page">
      <nav className="navbar-miembro">
        <div className="logo-gym">GYM <span>MASTER</span></div>
        <div className="nav-links">
          <button className="nav-btn">Comunidad</button>
          <button className="nav-btn">Membresía</button>
          <button className="nav-btn btn-salir" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </nav>

      <main className="hero-miembro">
        <div className="hero-content-left">
          <h1 className="welcome-text">¡Hola, Flacow <span>"prueba"</span>!</h1>
          <p className="welcome-sub">"Maquina voy ¡BliiiilleEEEEeeenNnnN!"</p>
          
          <div className="modules-grid">
            <div className="mod-card">
              <div className="mod-badge">BX</div>
              <h3>Módulo de Boxeo</h3>
              <p>Aprende defensa personal</p>
              <button className="btn-enter">Entrar</button>
            </div>

            <div className="mod-card">
              <div className="mod-badge">ZB</div>
              <h3>Módulo de Zumba</h3>
              <p>Mejora tu resistencia</p>
              <button className="btn-enter">Entrar</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InicioMiembro;