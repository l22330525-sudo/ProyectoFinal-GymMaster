import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Membresias.css';

const planesFallback = [
  {
    id: 1, nombre: 'Plan Diario', costo: 50, duracionDias: 1,
    descripcion: 'Acceso completo al gimnasio por un día. Ideal para visitantes o prueba.',
    conModulo: false,
    incluye: ['Acceso a equipos', 'Vestidores', 'Casillero'],
  },
  {
    id: 2, nombre: 'Plan Semanal', costo: 200, duracionDias: 7,
    descripcion: 'Una semana completa de entrenamiento sin restricciones.',
    conModulo: false,
    incluye: ['Acceso a equipos', 'Vestidores', 'Casillero', 'Evaluación física'],
  },
  {
    id: 3, nombre: 'Plan Mensual', costo: 600, duracionDias: 30,
    descripcion: 'Un mes entero con acceso completo. La mejor opción para resultados reales.',
    conModulo: false,
    incluye: ['Acceso a equipos', 'Vestidores', 'Casillero', 'Evaluación física', 'Rutina personalizada'],
  },
  {
    id: 4, nombre: 'Diario + Módulo', costo: 150, duracionDias: 1,
    descripcion: 'Acceso diario al gimnasio más un módulo de Boxeo o Zumba a tu elección.',
    conModulo: true,
    incluye: ['Todo del Plan Diario', 'Módulo Boxeo o Zumba', 'Instructor incluido'],
  },
  {
    id: 5, nombre: 'Semanal + Módulo', costo: 300, duracionDias: 7,
    descripcion: 'Una semana con acceso al gimnasio y clases de Boxeo o Zumba incluidas.',
    conModulo: true,
    incluye: ['Todo del Plan Semanal', 'Módulo Boxeo o Zumba', 'Instructor incluido'],
  },
  {
    id: 6, nombre: 'Mensual + Módulo', costo: 700, duracionDias: 30,
    descripcion: 'El plan más completo. Un mes con gimnasio y clases de Boxeo o Zumba.',
    conModulo: true,
    incluye: ['Todo del Plan Mensual', 'Módulo Boxeo o Zumba', 'Instructor incluido', 'Seguimiento semanal'],
  },
];

function mapearPlan(p) {
  const conModulo =
    p.nombre.toLowerCase().includes('módulo') ||
    p.nombre.toLowerCase().includes('modulo');
  return {
    ...p,
    precio: p.costo,
    duracion: `${p.duracionDias} día${p.duracionDias > 1 ? 's' : ''}`,
    conModulo,
    badge: conModulo ? '+ Módulo' : 'Plan',
    incluye: p.incluye ?? ['Acceso a equipos', 'Vestidores', 'Casillero'],
  };
}

function Membresias() {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [exitoMensaje, setExitoMensaje] = useState('');
  const socioNombre = localStorage.getItem('socioNombre');

  useEffect(() => {
    fetch('http://localhost:5027/api/Membresias')
      .then(res => res.json())
      .then(data => setPlanes(data.map(mapearPlan)))
      .catch(() => {
        console.warn('desde mac, usando planes de respaldo');
        setPlanes(planesFallback.map(mapearPlan));
      });
  }, []);

  const abrirModal = (plan) => {
    setExitoMensaje('');
    setPlanSeleccionado(plan);
  };

  const cerrarModal = () => {
    setPlanSeleccionado(null);
    setExitoMensaje('');
  };

  const confirmarPago = () => {
    setExitoMensaje(
      `¡Listo, ${socioNombre}! Tu ${planSeleccionado.nombre} fue activado.`
    );
    setTimeout(() => {
      cerrarModal();
      navigate('/inicio-miembro');
    }, 3000);
  };

  return (
    <div className="membresias-page">
      <nav className="membresias-navbar">
        <div className="membresias-logo">
          GYM <span>MASTER</span>
        </div>
        <button className="btn-volver" onClick={() => navigate('/inicio-miembro')}>
          ← Volver
        </button>
      </nav>

      <div className="membresias-content">
        <h1 className="membresias-titulo">Nuestros Planes</h1>
        <p className="membresias-subtitulo">
          Elige el plan que más se adapte a ti. Los planes con módulo incluyen Boxeo o Zumba.
        </p>

        <div className="membresias-grid">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.conModulo ? 'con-modulo' : ''}`}
            >
              <span
                className="plan-badge"
                style={{
                  background: plan.conModulo ? 'rgba(170,59,255,0.3)' : 'rgba(255,255,255,0.1)',
                  color: plan.conModulo ? '#aa3bff' : '#aaa',
                }}
              >
                {plan.badge}
              </span>

              <p className="plan-nombre">{plan.nombre}</p>

              <p className="plan-precio">
                ${plan.precio} <span>/ {plan.duracion}</span>
              </p>

              <p className="plan-descripcion">{plan.descripcion}</p>

              <ul className="plan-incluye">
                {plan.incluye.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              <button className="btn-contratar" onClick={() => abrirModal(plan)}>
                Contratar Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {planSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar Plan</h2>
            <p>
              Estás a punto de contratar el{' '}
              <strong>{planSeleccionado.nombre}</strong> con duración de{' '}
              <strong>{planSeleccionado.duracion}</strong>.
            </p>
            <div className="modal-precio">${planSeleccionado.precio}</div>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>
              * El pago se realiza en recepción al presentarte.
            </p>
            {exitoMensaje ? (
              <p className="exito-mensaje">{exitoMensaje}</p>
            ) : (
              <div className="modal-botones">
                <button className="btn-confirmar-pago" onClick={confirmarPago}>
                  Confirmar
                </button>
                <button className="btn-cancelar-pago" onClick={cerrarModal}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Membresias;