import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Membresias.css';
import './GestionRecepcion.css';

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
  const [errorCarga, setErrorCarga] = useState('');
  
  const socioNombre = localStorage.getItem('socioNombre');
  const userRol = localStorage.getItem('socioRol');
  const socioId = localStorage.getItem('socioId');

  const [miEstatusActual, setMiEstatusActual] = useState({ activo: false, membresiaId: null });

  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [exitoMensaje, setExitoMensaje] = useState('');

  const [modalAdminAbierto, setModalAdminAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [costo, setCosto] = useState('');
  const [duracionDias, setDuracionDias] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensajeAdmin, setMensajeAdmin] = useState('');

  const cargarPlanes = () => {
    fetch('http://localhost:5027/api/Membresias')
      .then(res => res.json())
      .then(data => setPlanes(data.map(mapearPlan)))
      .catch(() => setErrorCarga('No se pudo conectar con el servidor. Verifica que la API esté corriendo.'));
  };

  const verificarEstatusCliente = () => {
    if (userRol !== 'Admin' && socioId) {
      fetch(`http://localhost:5027/api/Miembros/${socioId}`)
        .then(res => res.json())
        .then(socio => {
          setMiEstatusActual({
            activo: socio.estaActivo,
            membresiaId: socio.membresiaId
          });
        })
        .catch(err => console.log('Error verificando estatus del cliente', err));
    }
  };

  useEffect(() => {
    cargarPlanes();
    verificarEstatusCliente();
  }, []);

  const handleVolver = () => {
    if (userRol === 'Admin' || userRol === 'Recepcionista') {
      navigate('/gestion-recepcion');
    } else {
      navigate('/inicio-miembro');
    }
  };
  
  const abrirCrearAdmin = () => {
    setEditandoId(null);
    setNombre('');
    setCosto('');
    setDuracionDias('');
    setDescripcion('');
    setMensajeAdmin('');
    setModalAdminAbierto(true);
  };

  const abrirEditarAdmin = (plan) => {
    setEditandoId(plan.id);
    setNombre(plan.nombre);
    setCosto(plan.costo);
    setDuracionDias(plan.duracionDias);
    setDescripcion(plan.descripcion);
    setMensajeAdmin('');
    setModalAdminAbierto(true);
  };

  const guardarMembresia = async (e) => {
    e.preventDefault();
    setMensajeAdmin('');

    const payload = {
      nombre,
      costo: parseFloat(costo),
      duracionDias: parseInt(duracionDias),
      descripcion
    };

    try {
      const url = editandoId 
        ? `http://localhost:5027/api/Membresias/${editandoId}`
        : 'http://localhost:5027/api/Membresias';
      const method = editandoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMensajeAdmin(editandoId ? '¡Membresía actualizada con éxito!' : '¡Membresía creada con éxito!');
        setTimeout(() => {
          setModalAdminAbierto(false);
          cargarPlanes();
        }, 1500);
      } else {
        const errMsg = await response.text();
        setMensajeAdmin(`Error en servidor: ${errMsg}`);
      }
    } catch (err) {
      setMensajeAdmin('No se pudo conectar con el servidor.');
    }
  };

  const eliminarMembresia = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar permanentemente este plan de membresía?')) return;

    try {
      const response = await fetch(`http://localhost:5027/api/Membresias/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        cargarPlanes();
      } else {
        alert('Ocurrió un error al intentar eliminar la membresía.');
      }
    } catch (err) {
      alert('No se pudo conectar con el servidor.');
    }
  };

  const confirmarPagoCliente = async () => {
    try {
      const resSocio = await fetch(`http://localhost:5027/api/Miembros/${socioId}`);
      const socioActual = await resSocio.json();
      
      const payloadAct = {
        ...socioActual,
        membresiaId: planSeleccionado.id,
        estaActivo: false
      };

      await fetch(`http://localhost:5027/api/Miembros/${socioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadAct)
      });

      setExitoMensaje(`¡Solicitud enviada, ${socioNombre}! Paga tu ${planSeleccionado.nombre} en recepción.`);
      setTimeout(() => {
        setPlanSeleccionado(null);
        setExitoMensaje('');
        navigate('/inicio-miembro');
      }, 3000);

    } catch (error) {
      setExitoMensaje(`¡Solicitud local creada, ${socioNombre}! Ve a recepción.`);
      setTimeout(() => { navigate('/inicio-miembro'); }, 2000);
    }
  };

  const abrirModalCliente = (plan) => { setExitoMensaje(''); setPlanSeleccionado(plan); };
  const cerrarModalCliente = () => { setPlanSeleccionado(null); setExitoMensaje(''); };

  if (userRol === 'Admin') {
    return (
      <div className="membresias-page">
        <nav className="navbar-admin">
          <div className="logo-gym">GYM <span>MASTER</span></div>
          <div className="nav-actions">
            <div className="tabs-admin">
              <button className="" onClick={() => { localStorage.setItem('admin_tab_activa', 'socios'); navigate('/gestion-recepcion'); }}>Socios</button>
              <button className="" onClick={() => { localStorage.setItem('admin_tab_activa', 'modulos'); navigate('/gestion-recepcion'); }}>Clases</button>
              
              {}
              <button className="" onClick={() => { localStorage.setItem('admin_tab_activa', 'pagos'); navigate('/gestion-recepcion'); }}>Validación Pagos</button>
              
              <button className="active" onClick={() => navigate('/membresias')}>Membresías</button>
              <button className="" onClick={() => navigate('/gestion-instructores')}>Staff</button>
            </div>
            <button className="btn-logout" onClick={() => {
              localStorage.removeItem('socioId');
              localStorage.removeItem('socioNombre');
              localStorage.removeItem('socioRol');
              localStorage.removeItem('admin_tab_activa');
              navigate('/login');
            }}>Salir</button>
          </div>
        </nav>

        {errorCarga && <div style={{ background: '#dc3545', color: 'white', padding: '12px 20px', textAlign: 'center', fontWeight: 'bold' }}>{errorCarga}</div>}

        <div className="membresias-content">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#aa3bff' }}>Administración de Membresías</h1>
              <p style={{ color: '#aaa', margin: '5px 0 0' }}>Catálogo operativo en tiempo real conectado a SQL Server.</p>
            </div>
            <button onClick={abrirCrearAdmin} style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
              Crear Nuevo Plan
            </button>
          </header>

          <section style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
                  <th style={{ padding: '15px' }}>ID</th>
                  <th style={{ padding: '15px' }}>Nombre del Plan</th>
                  <th style={{ padding: '15px' }}>Costo</th>
                  <th style={{ padding: '15px' }}>Duración</th>
                  <th style={{ padding: '15px' }}>Descripción</th>
                  <th style={{ padding: '15px' }}>Acciones Administrativas</th>
                </tr>
              </thead>
              <tbody>
                {planes.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '15px' }}>{p.id}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#aa3bff' }}>{p.nombre}</td>
                    <td style={{ padding: '15px' }}>${p.costo}</td>
                    <td style={{ padding: '15px' }}>{p.duracion}</td>
                    <td style={{ padding: '15px', fontSize: '0.85rem', color: '#ccc', maxWidth: '300px' }}>{p.descripcion}</td>
                    <td style={{ padding: '15px' }}>
                      <button onClick={() => abrirEditarAdmin(p)} style={{ padding: '8px 15px', marginRight: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#ffc107', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>Editar</button>
                      <button onClick={() => eliminarMembresia(p.id)} style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#dc3545', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {modalAdminAbierto && (
          <div className="modal-overlay">
            <div className="modal-card" style={{ maxWidth: '450px', textAlign: 'left' }}>
              <h2 style={{ color: '#aa3bff', marginTop: 0 }}>{editandoId ? 'Modificar Membresía' : 'Dar de Alta Membresía'}</h2>
              
              {mensajeAdmin && (
                <p style={{ fontWeight: 'bold', color: mensajeAdmin.includes('con éxito') ? '#28a745' : '#dc3545', textAlign: 'center' }}>
                  {mensajeAdmin}
                </p>
              )}

              <form onSubmit={guardarMembresia} style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'white' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Nombre de la membresía:</label>
                  <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Costo ($):</label>
                    <input type="number" step="0.01" value={costo} onChange={e => setCosto(e.target.value)} required style={{ width: '90%', padding: '10px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Duración (Días):</label>
                    <input type="number" value={duracionDias} onChange={e => setDuracionDias(e.target.value)} required style={{ width: '90%', padding: '10px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Descripción del servicio:</label>
                  <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows="3" required style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white', resize: 'none', fontFamily: 'sans-serif' }} />
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#aa3bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {editandoId ? 'Guardar Cambios' : 'Publicar Plan'}
                  </button>
                  <button type="button" onClick={() => setModalAdminAbierto(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  const miPlanData = miEstatusActual.activo && miEstatusActual.membresiaId 
    ? planes.find(p => p.id === miEstatusActual.membresiaId) 
    : null;

  return (
    <div className="membresias-page">
      <nav className="membresias-navbar">
        <div className="membresias-logo">GYM <span>MASTER</span></div>
        <button className="btn-volver" onClick={handleVolver}>← Volver</button>
      </nav>

      {errorCarga && <div style={{ background: '#dc3545', color: 'white', padding: '12px 20px', textAlign: 'center', fontWeight: 'bold' }}>{errorCarga}</div>}

      <div className="membresias-content">
        {miEstatusActual.activo && miPlanData ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#1a1a1a', borderRadius: '15px', border: '1px solid #28a745', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ color: '#28a745', fontSize: '2.5rem', margin: '0 0 10px' }}>Suscripción Activa</h1>
            <p style={{ color: '#ccc', fontSize: '1.2rem', marginBottom: '30px' }}>Actualmente estás disfrutando de los beneficios de:</p>
            
            <div className={`plan-card ${miPlanData.conModulo ? 'con-modulo' : ''}`} style={{ margin: '0 auto' }}>
              <span className="plan-badge" style={{ background: miPlanData.conModulo ? 'rgba(170,59,255,0.3)' : 'rgba(255,255,255,0.1)', color: miPlanData.conModulo ? '#aa3bff' : '#aaa' }}>
                {miPlanData.badge}
              </span>
              <p className="plan-nombre" style={{ fontSize: '2rem' }}>{miPlanData.nombre}</p>
              <p className="plan-precio">${miPlanData.precio} <span>/ {miPlanData.duracion}</span></p>
              <p className="plan-descripcion">{miPlanData.descripcion}</p>
              
              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(40, 167, 69, 0.2)', borderRadius: '8px', color: '#28a745', fontWeight: 'bold' }}>
                Tu plan vencerá en {miPlanData.duracionDias} días a partir de tu último pago.
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="membresias-titulo">Nuestros Planes</h1>
            <p className="membresias-subtitulo">Elige el plan que más se adapte a ti. Los planes con módulo incluyen Boxeo o Zumba.</p>

            {planes.length === 0 && !errorCarga && <p style={{ textAlign: 'center', color: '#aaa' }}>Cargando planes...</p>}

            <div className="membresias-grid">
              {planes.map((plan) => (
                <div key={plan.id} className={`plan-card ${plan.conModulo ? 'con-modulo' : ''}`}>
                  <span className="plan-badge" style={{ background: plan.conModulo ? 'rgba(170,59,255,0.3)' : 'rgba(255,255,255,0.1)', color: plan.conModulo ? '#aa3bff' : '#aaa' }}>
                    {plan.badge}
                  </span>
                  <p className="plan-nombre">{plan.nombre}</p>
                  <p className="plan-precio">${plan.precio} <span>/ {plan.duracion}</span></p>
                  <p className="plan-descripcion">{plan.descripcion}</p>
                  <button className="btn-contratar" onClick={() => abrirModalCliente(plan)}>Contratar Plan</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {planSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModalCliente}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar Solicitud</h2>
            <p>Estás a punto de solicitar el <strong>{planSeleccionado.nombre}</strong> con duración de <strong>{planSeleccionado.duracion}</strong>.</p>
            <div className="modal-precio">${planSeleccionado.precio}</div>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>* Presenta tu código QR en recepción y paga en efectivo para activar tu cuenta.</p>
            {exitoMensaje ? (
              <p className="exito-mensaje" style={{ color: '#28a745', fontWeight: 'bold' }}>{exitoMensaje}</p>
            ) : (
              <div className="modal-botones">
                <button className="btn-confirmar-pago" onClick={confirmarPagoCliente}>Generar Código QR</button>
                <button className="btn-cancelar-pago" onClick={cerrarModalCliente}>Cancelar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Membresias;