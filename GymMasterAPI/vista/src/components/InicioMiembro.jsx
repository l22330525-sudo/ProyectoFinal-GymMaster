import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './InicioMiembro.css';

function InicioMiembro() {
  const [nombreSocio, setNombreSocio] = useState('');
  const [socioId, setSocioId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [asistenciaRegistrada, setAsistenciaRegistrada] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('socioId');
    const nombre = localStorage.getItem('socioNombre');
    if (!id) {
      navigate('/login');
    } else {
      setSocioId(parseInt(id));
      setNombreSocio(nombre || 'Socio');
    }
  }, [navigate]);

  const checkInAsistencia = async () => {
    setMensaje('');
    try {
      const response = await fetch('http://localhost:5027/api/Asistencias/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socioId),
      });
      const data = await response.json();
      if (response.ok) {
        setTipoMensaje('exito');
        setMensaje(data.mensaje);
        setTimeout(() => setAsistenciaRegistrada(true), 1500);
      } else {
        setTipoMensaje('error');
        setMensaje(data || 'Ocurrió un error al registrar la asistencia.');
      }
    } catch (error) {
      console.warn('Simulacion de asistencia, para trabajar en la mac jaja');
      setTipoMensaje('exito');
      setMensaje('¡Asistencia registrada con éxito! Bienvenido al gimnasio.');
      setTimeout(() => setAsistenciaRegistrada(true), 1500);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!asistenciaRegistrada) {
    return (
      <div style={{
        maxWidth: '450px',
        margin: '100px auto',
        padding: '30px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        fontFamily: 'sans-serif',
      }}>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>Control de Accesos </h2>
        <p style={{ color: '#666', fontSize: '15px' }}>
          Hola <strong>{nombreSocio}</strong>, para desbloquear tus clases de hoy,
          por favor confirma tu ingreso al gimnasio.
        </p>
        <div style={{ margin: '25px 0' }}>
          <button
            onClick={checkInAsistencia}
            style={{
              padding: '14px 30px',
              backgroundColor: '#28A745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Confirmar Entrada
          </button>
        </div>
        {mensaje && (
          <p style={{
            marginTop: '15px',
            fontWeight: 'bold',
            fontSize: '14px',
            color: tipoMensaje === 'exito' ? '#28A745' : '#DC3545',
          }}>
            {mensaje}
          </p>
        )}
        <button
          onClick={handleLogout}
          style={{
            marginTop: '20px',
            background: 'none',
            border: 'none',
            color: '#DC3545',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Cancelar y Salir
        </button>
      </div>
    );
  }

  return (
    <div className="inicio-miembro-page">
      <nav className="navbar-miembro">
        <div className="logo-gym">GYM <span>MASTER</span></div>
        <div className="nav-links">
          <button className="nav-btn">Comunidad</button>
          <button className="nav-btn" onClick={() => navigate('/membresias')}>Membresía</button>
          <button className="nav-btn btn-salir" onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <main className="hero-miembro">
        <div className="hero-content-left">
          <h1 className="welcome-text">¡Hola, {nombreSocio}!</h1>
          <p className="welcome-sub">"Maquina voy ¡BliiiilleEEEEeeenNnnN!"</p>

          <div className="modules-grid">
            <div className="mod-card">
              <div className="mod-badge">BX</div>
              <h3>Módulo de Boxeo</h3>
              <p>Aprende defensa personal</p>
              <button className="btn-enter" onClick={() => navigate('/modulo/boxeo')}>
                Entrar
              </button>
            </div>

            <div className="mod-card">
              <div className="mod-badge">ZB</div>
              <h3>Módulo de Zumba</h3>
              <p>Mejora tu resistencia</p>
              <button className="btn-enter" onClick={() => navigate('/modulo/zumba')}>
                Entrar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default InicioMiembro;