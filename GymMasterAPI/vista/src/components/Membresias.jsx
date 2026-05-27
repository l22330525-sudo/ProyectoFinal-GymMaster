import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Membresias.css';

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
  };
}

function Membresias() {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [exitoMensaje, setExitoMensaje] = useState('');
  const [errorCarga, setErrorCarga] = useState('');
  const socioNombre = localStorage.getItem('socioNombre');

  useEffect(() => {
    fetch('http://localhost:5027/api/Membresias')
      .then(res => res.json())
      .then(data => setPlanes(data.map(mapearPlan)))
      .catch(() => setErrorCarga('No se pudo conectar con el servidor. Verifica que la API esté corriendo.'));
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

      {errorCarga && (
        <div style={{ background: '#dc3545', color: 'white', padding: '12px 20px', textAlign: 'center', fontWeight: 'bold' }}>
          {errorCarga}
        </div>
      )}

      <div className="membresias-content">
        <h1 className="membresias-titulo">Nuestros Planes</h1>
        <p className="membresias-subtitulo">
          Elige el plan que más se adapte a ti. Los planes con módulo incluyen Boxeo o Zumba.
        </p>

        {planes.length === 0 && !errorCarga && (
          <p style={{ textAlign: 'center', color: '#aaa' }}>Cargando planes...</p>
        )}

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
