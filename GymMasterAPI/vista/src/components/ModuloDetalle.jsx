import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ModuloDetalle.css';

const esteticaModulos = {
  boxeo: {
    badge: 'BX',
    color: '#aa3bff',
    horarios: [
      { dia: 'Lunes y Miércoles', hora: '7:00 AM - 8:30 AM',  nivel: 'Principiante' },
      { dia: 'Lunes y Miércoles', hora: '6:00 PM - 7:30 PM',  nivel: 'Intermedio' },
      { dia: 'Viernes',           hora: '8:00 AM - 9:30 AM',  nivel: 'Avanzado' },
      { dia: 'Sábado',            hora: '9:00 AM - 11:00 AM', nivel: 'Todos los niveles' },
    ],
  },
  zumba: {
    badge: 'ZB',
    color: '#ff3b9a',
    horarios: [
      { dia: 'Martes y Jueves', hora: '7:00 AM - 8:00 AM',   nivel: 'Todos los niveles' },
      { dia: 'Martes y Jueves', hora: '5:00 PM - 6:00 PM',   nivel: 'Principiante' },
      { dia: 'Miércoles',       hora: '7:00 PM - 8:00 PM',   nivel: 'Intermedio' },
      { dia: 'Sábado',          hora: '10:00 AM - 11:30 AM', nivel: 'Todos los niveles' },
    ],
  },
  default: {
    badge: 'MD',
    color: '#28a745',
    horarios: [
      { dia: 'Lunes a Viernes', hora: 'Horarios por definir', nivel: 'Todos los niveles' }
    ]
  }
};

function ModuloDetalle() {
  const { tipo } = useParams();
  const navigate = useNavigate();
  
  const [instructor, setInstructor] = useState(null);
  const [cargandoInstructor, setCargandoInstructor] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [registrando, setRegistrando] = useState(false);

  const socioNombre = localStorage.getItem('socioNombre');
  const socioId = localStorage.getItem('socioId');

  const configGuardada = localStorage.getItem('gym_modulos_config');
  const modulosAdmin = configGuardada ? JSON.parse(configGuardada) : [];

  const moduloDinamico = modulosAdmin.find(m => m.nombre.toLowerCase().includes(tipo.toLowerCase()));

  const estetica = esteticaModulos[tipo.toLowerCase()] || esteticaModulos.default;
  
  const modulo = moduloDinamico ? {
    ...estetica,
    nombre: moduloDinamico.nombre,
    descripcion: moduloDinamico.descripcion,
    activo: moduloDinamico.activo,
    instructorId: moduloDinamico.instructorId
  } : null;

  useEffect(() => {
    if (!socioId) navigate('/login');
    if (!modulo || !modulo.activo) navigate('/inicio-miembro');
  }, [modulo, socioId, navigate]);

  useEffect(() => {
    if (!modulo || !modulo.activo) return;
    setCargandoInstructor(true);

    if (!modulo.instructorId) {
      setInstructor(null);
      setCargandoInstructor(false);
      return;
    }

    fetch('http://localhost:5027/api/Instructores')
      .then(res => res.json())
      .then(data => {
        const asignado = data.find(i => i.id === parseInt(modulo.instructorId));
        setInstructor(asignado ?? null);
      })
      .catch(() => setInstructor(null))
      .finally(() => setCargandoInstructor(false));
  }, [modulo?.instructorId]);

  if (!modulo || !modulo.activo) return null;

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
        setMensaje(`¡Asistencia al ${modulo.nombre} registrada con éxito!`);
      } else {
        setTipoMensaje('error');
        setMensaje(data || 'Error al registrar.');
      }
    } catch {
      setTipoMensaje('exito');
      setMensaje(`¡Asistencia al ${modulo.nombre} registrada! (modo simulado)`);
    } finally {
      setRegistrando(false);
    }
  };

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
            <h1>{modulo.nombre}</h1>
            <p>{modulo.descripcion}</p>
          </div>
        </div>

        <div className="modulo-grid">
          <div className="card-modulo">
            <h2 style={{ color: modulo.color }}> Horarios</h2>
            {modulo.horarios.map((h, i) => (
              <div key={i} className="horario-item">
                <div className="horario-dia">{h.dia}</div>
                <div className="horario-hora">{h.hora}</div>
                <span className="horario-nivel" style={{ background: `${modulo.color}33`, color: modulo.color }}>
                  {h.nivel}
                </span>
              </div>
            ))}
          </div>

          <div className="card-derecha">
            <div className="card-modulo">
              <h2 style={{ color: modulo.color }}> Instructor Asignado</h2>
              {cargandoInstructor ? (
                <p style={{ color: '#bbb' }}>Cargando datos de la base...</p>
              ) : instructor ? (
                <>
                  {}
                  <div className="instructor-nombre">👤 {instructor.nombre || instructor.nombreCompleto}</div>
                  <div className="instructor-dato">🥊 Especialidad: {instructor.especialidad}</div>
                  {instructor.turno && <div className="instructor-dato"> Turno: {instructor.turno}</div>}
                </>
              ) : (
                <p style={{ color: '#ff4d4d', fontWeight: 'bold' }}>
                  ⚠️ El Administrador aún no asigna un instructor para esta clase.
                </p>
              )}
            </div>

            <div className="card-modulo card-registro" style={{ border: `1px solid ${modulo.color}` }}>
              <h2 style={{ color: modulo.color }}> Registrar Asistencia</h2>
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