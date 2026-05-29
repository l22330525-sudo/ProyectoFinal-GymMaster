import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ModuloDetalle.css';

// Mapea "07:00" → "7:00 AM", "13:30" → "1:30 PM"
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

function rangoHorario(inicio, fin) {
  return `${formatearHora12(inicio)} - ${formatearHora12(fin)}`;
}

function ModuloDetalle() {
  const { tipo } = useParams();
  const navigate = useNavigate();

  const [modulo, setModulo] = useState(null);
  const [cargandoModulo, setCargandoModulo] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [registrando, setRegistrando] = useState(false);

  const socioNombre = localStorage.getItem('socioNombre');
  const socioId = localStorage.getItem('socioId');

  useEffect(() => {
    if (!socioId) {
      navigate('/login');
      return;
    }

    setCargandoModulo(true);
    fetch('http://localhost:5027/api/Modulos')
      .then(res => res.json())
      .then(data => {
        const slug = (tipo || '').toLowerCase();
        const encontrado = data.find(m => m.nombre.toLowerCase() === slug)
                        || data.find(m => m.nombre.toLowerCase().includes(slug))
                        || data.find(m => String(m.id) === slug);

        if (!encontrado) {
          setErrorCarga('La clase que buscas no existe.');
          setTimeout(() => navigate('/inicio-miembro'), 2000);
          return;
        }
        if (!encontrado.activo) {
          setErrorCarga('Esta clase no está disponible en este momento.');
          setTimeout(() => navigate('/inicio-miembro'), 2000);
          return;
        }
        setModulo(encontrado);
      })
      .catch(() => setErrorCarga('No se pudo conectar con el servidor. Verifica que la API esté corriendo.'))
      .finally(() => setCargandoModulo(false));
  }, [tipo, socioId, navigate]);

  const registrarAsistencia = async () => {
    setRegistrando(true);
    setMensaje('');
    try {
      const response = await fetch('http://localhost:5027/api/Asistencias/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parseInt(socioId)),
      });
      const data = await response.json();
      if (response.ok) {
        setTipoMensaje('exito');
        setMensaje(`¡Asistencia al módulo ${modulo.nombre} registrada con éxito!`);
      } else {
        setTipoMensaje('error');
        setMensaje(typeof data === 'string' ? data : 'Error al registrar la asistencia.');
      }
    } catch {
      setTipoMensaje('error');
      setMensaje('No se pudo conectar con el servidor.');
    } finally {
      setRegistrando(false);
    }
  };

  if (cargandoModulo) {
    return (
      <div className="modulo-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#bbb' }}>Cargando información del módulo...</p>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="modulo-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#ff4d4d', fontWeight: 'bold' }}>{errorCarga}</p>
      </div>
    );
  }

  if (!modulo) return null;

  return (
    <div className="modulo-page">
      <nav className="modulo-navbar">
        <div className="modulo-logo">GYM <span>MASTER</span></div>
        <button className="btn-volver" onClick={() => navigate('/inicio-miembro')}>← Volver</button>
      </nav>

      <div className="modulo-content">
        <div className="modulo-header">
          <div className="modulo-badge-grande" style={{ background: modulo.color }}>
            {modulo.badge}
          </div>
          <div>
            <h1 className="modulo-titulo" style={{ color: modulo.color }}>{modulo.nombre}</h1>
            <p>{modulo.descripcion}</p>
          </div>
        </div>

        <div className="modulo-grid">
          <div className="card-modulo">
            <h2 style={{ color: modulo.color }}>Horarios</h2>
            {modulo.horarios.length === 0 ? (
              <p style={{ color: '#bbb' }}>Aún no se han asignado horarios para esta clase.</p>
            ) : (
              modulo.horarios.map((h) => (
                <div key={h.id} className="horario-item">
                  <div className="horario-dia">{h.diaSemana}</div>
                  <div className="horario-hora">{rangoHorario(h.horaInicio, h.horaFin)}</div>
                  <span className="horario-nivel" style={{ background: `${modulo.color}33`, color: modulo.color }}>
                    {h.nivel}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="card-derecha">
            <div className="card-modulo">
              <h2 style={{ color: modulo.color }}>Instructor Asignado</h2>
              {modulo.instructorNombre ? (
                <>
                  <div className="instructor-nombre">👤 {modulo.instructorNombre}</div>
                </>
              ) : (
                <p style={{ color: '#ff4d4d', fontWeight: 'bold' }}>
                  ⚠️ El Administrador aún no asigna un instructor para esta clase.
                </p>
              )}
            </div>

            <div className="card-modulo card-registro" style={{ border: `1px solid ${modulo.color}` }}>
              <h2 style={{ color: modulo.color }}>Registrar Asistencia</h2>
              <p style={{ color: '#bbb', fontSize: '0.9rem' }}>
                Hola <strong style={{ color: 'white' }}>{socioNombre}</strong>,
                confirma tu entrada a la clase de hoy.
              </p>
              <button
                className="btn-confirmar"
                style={{ background: modulo.color }}
                onClick={registrarAsistencia}
                disabled={registrando}
              >
                {registrando ? 'Registrando...' : 'Confirmar Entrada'}
              </button>
              {mensaje && (
                <p className={`mensaje-registro mensaje-${tipoMensaje}`}>
                  {mensaje}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModuloDetalle;
