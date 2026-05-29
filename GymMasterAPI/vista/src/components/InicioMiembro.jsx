import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './InicioMiembro.css';

// Mapea "07:00" → "7:00 AM"
function formatearHora12(hora24) {
  if (!hora24 || !hora24.includes(':')) return hora24 || '';
  const [hStr, mStr] = hora24.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr.padStart(2, '0');
  if (isNaN(h)) return hora24;
  const sufijo = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${sufijo}`;
}

function resumenHorarios(horarios) {
  if (!horarios || horarios.length === 0) return 'Horario por asignar';
  const primero = horarios[0];
  const dias = [...new Set(horarios.map(h => h.diaSemana))].slice(0, 3).join(', ');
  return `${dias} · ${formatearHora12(primero.horaInicio)}`;
}

function InicioMiembro() {
  const [nombreSocio, setNombreSocio] = useState('');
  const [socioId, setSocioId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  const [asistenciaRegistrada, setAsistenciaRegistrada] = useState(() => {
    return localStorage.getItem('asistenciaRegistrada') === 'true';
  });

  const navigate = useNavigate();

  const [modulosActivos, setModulosActivos] = useState([]);
  const [errorCargaModulos, setErrorCargaModulos] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('socioId');
    const nombre = localStorage.getItem('socioNombre');
    if (!id) {
      navigate('/login');
      return;
    }
    setSocioId(parseInt(id));
    setNombreSocio(nombre || 'Socio');

    fetch('http://localhost:5027/api/Modulos')
      .then(res => res.json())
      .then(data => {
        const visibles = data.filter(m => m.activo === true);
        setModulosActivos(visibles);
      })
      .catch(() => setErrorCargaModulos('No se pudo cargar la lista de clases. Verifica que la API esté corriendo.'));
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
        
        setTimeout(() => {
          localStorage.setItem('asistenciaRegistrada', 'true');
          setAsistenciaRegistrada(true);
        }, 1500);
      } else {
        setTipoMensaje('error');
        setMensaje(data || 'Ocurrió un error al registrar la asistencia.');
      }
    } catch (error) {
      setTipoMensaje('error');
      setMensaje('No se pudo conectar con el servidor. Intenta de nuevo.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('socioId');
    localStorage.removeItem('socioNombre');
    localStorage.removeItem('socioRol');
    localStorage.removeItem('asistenciaRegistrada');
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
          <button className="nav-btn" onClick={() => navigate('/membresias')}>Membresía</button>
          <button className="nav-btn btn-salir" onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <main className="hero-miembro">
        <div className="hero-content-left">
          <h1 className="welcome-text">¡Hola, {nombreSocio}!</h1>
          <p className="welcome-sub">"Maquina voy ¡BliiiilleEEEEeeenNnnN!"</p>

          {errorCargaModulos && (
            <p style={{ color: '#ff4d4d', marginTop: '20px', fontWeight: 'bold' }}>{errorCargaModulos}</p>
          )}

          {!errorCargaModulos && modulosActivos.length === 0 ? (
            <p style={{ color: '#aaa', marginTop: '20px' }}>No hay clases asignadas o activas en este momento por la administración.</p>
          ) : (
            <div className="modules-grid">
              {modulosActivos.map(mod => {
                const slugRuta = mod.nombre.toLowerCase().trim().replace(/\s+/g, '-');
                return (
                  <div key={mod.id} className="mod-card">
                    <div className="mod-badge" style={{ background: mod.color }}>{mod.badge}</div>
                    <h3>{mod.nombre}</h3>

                    <p style={{ margin: '8px 0 4px', fontSize: '0.95rem', color: '#ccc' }}>
                      {mod.descripcion}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: mod.color, fontWeight: 'bold', marginBottom: '12px' }}>
                      {resumenHorarios(mod.horarios)}
                    </p>

                    <button className="btn-enter" onClick={() => navigate(`/modulo/${slugRuta}`)}>
                      Entrar
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default InicioMiembro;