import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GestionRecepcion.css';

function GestionRecepcion() {
  const [busqueda, setBusqueda] = useState('');
  const [miembros, setMiembros] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [errorCarga, setErrorCarga] = useState('');
  
  // --- ESTADO PARA CONTROLAR LAS PESTAÑAS (Con Memoria) ---
  const [vistaActiva, setVistaActiva] = useState(() => {
    return localStorage.getItem('admin_tab_activa') || 'socios';
  });

  const cambiarVista = (vista) => {
    setVistaActiva(vista);
    localStorage.setItem('admin_tab_activa', vista);
  };

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [estaActivo, setEstaActivo] = useState(true);
  const [membresiaId, setMembresiaId] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [modulos, setModulos] = useState(() => {
    const guardados = localStorage.getItem('gym_modulos_config');
    return guardados ? JSON.parse(guardados) : [
      { id: 1, nombre: 'Boxeo', descripcion: 'Entrenamiento de alta intensidad y técnica de golpeo.', activo: true, instructorId: '' },
      { id: 2, nombre: 'Zumba', descripcion: 'Clases rítmicas aérobicas para quema calórica.', activo: true, instructorId: '' }
    ];
  });

  const [modalModuloAbierto, setModalModuloAbierto] = useState(false);
  const [editandoModuloId, setEditandoModuloId] = useState(null);
  const [modNombre, setModNombre] = useState('');
  const [modDescripcion, setModDescripcion] = useState('');
  const [modActivo, setModActivo] = useState(true);
  const [modInstructorId, setModInstructorId] = useState('');

  const navigate = useNavigate();

  const cargarDatosBase = () => {
    fetch('http://localhost:5027/api/Miembros')
      .then(res => res.json())
      .then(data => setMiembros(data))
      .catch(() => setErrorCarga('No se pudo conectar con el servidor.'));

    fetch('http://localhost:5027/api/Membresias')
      .then(res => res.json())
      .then(data => setMembresias(data))
      .catch(() => setErrorCarga('No se pudo conectar con el servidor.'));

    fetch('http://localhost:5027/api/Instructores')
      .then(res => res.json())
      .then(data => setInstructores(data))
      .catch(() => setErrorCarga('No se pudo conectar con el servidor.'));
  };

  useEffect(() => {
    cargarDatosBase();
  }, []);

  useEffect(() => {
    localStorage.setItem('gym_modulos_config', JSON.stringify(modulos));
  }, [modulos]);

  const miembrosFiltrados = miembros.filter(m =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('socioId');
    localStorage.removeItem('socioNombre');
    localStorage.removeItem('socioRol');
    navigate('/login');
  };

  // --- HANDLERS SOCIOS ---
  const abrirCrear = () => { setEditandoId(null); setNombre(''); setEmail(''); setPassword(''); setEstaActivo(true); setMembresiaId(''); setMensaje(''); setModalAbierto(true); };
  const abrirEditar = (miembro) => { setEditandoId(miembro.id); setNombre(miembro.nombre); setEmail(miembro.email); setPassword(''); setEstaActivo(miembro.estaActivo); setMembresiaId(miembro.membresiaId || ''); setMensaje(''); setModalAbierto(true); };
  
  const guardarSocio = async (e) => {
    e.preventDefault();
    const datosSocio = { nombre, email, password: password || undefined, estaActivo, membresiaId: membresiaId ? parseInt(membresiaId) : null };
    try {
      let url = editandoId ? `http://localhost:5027/api/Miembros/${editandoId}` : 'http://localhost:5027/api/Miembros';
      let method = editandoId ? 'PUT' : 'POST';
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datosSocio) });
      if (response.ok) { setMensaje(editandoId ? '¡Socio actualizado con éxito!' : '¡Socio registrado con éxito!'); setTimeout(() => { setModalAbierto(false); cargarMiembros(); }, 1500); }
    } catch { setMensaje('Error de conexión.'); }
  };

  const eliminarSocio = async (id) => {
    if (!window.confirm('¿Deseas eliminar permanentemente a este cliente?')) return;
    const response = await fetch(`http://localhost:5027/api/Miembros/${id}`, { method: 'DELETE' });
    if (response.ok) cargarDatosBase();
  };

  const registrarAsistenciaManual = async (id) => {
    const response = await fetch('http://localhost:5027/api/Asistencias/registrar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(id) });
    if (response.ok) alert('Asistencia registrada con éxito.');
  };

  const abrirCrearModulo = () => { setEditandoModuloId(null); setModNombre(''); setModDescripcion(''); setModActivo(true); setModInstructorId(''); setModalModuloAbierto(true); };
  const abrirEditarModulo = (mod) => { setEditandoModuloId(mod.id); setModNombre(mod.nombre); setModDescripcion(mod.descripcion); setModActivo(mod.activo); setModInstructorId(mod.instructorId); setModalModuloAbierto(true); };
  
  const guardarModulo = (e) => {
    e.preventDefault();
    if (editandoModuloId) { setModulos(modulos.map(m => m.id === editandoModuloId ? { ...m, nombre: modNombre, descripcion: modDescripcion, activo: modActivo, instructorId: modInstructorId } : m)); } 
    else { const nuevoMod = { id: Date.now(), nombre: modNombre, descripcion: modDescripcion, activo: modActivo, instructorId: modInstructorId }; setModulos([...modulos, nuevoMod]); }
    setModalModuloAbierto(false);
  };

  const eliminarModulo = (id) => {
    if (!window.confirm('¿Seguro que deseas borrar permanentemente este módulo/disciplina?')) return;
    setModulos(modulos.filter(m => m.id !== id));
  };

  return (
    <div className="recepcion-container">
      {}
      {}
      {}
      <nav className="navbar-miembro">
        <div className="logo-gym">GYM <span>MASTER</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', gap: '8px', marginRight: '15px', paddingRight: '15px', borderRight: '1px solid #444' }}>
            <button onClick={() => cambiarVista('socios')} style={{ background: vistaActiva === 'socios' ? '#aa3bff' : 'none', color: vistaActiva === 'socios' ? 'white' : '#aa3bff', border: '1px solid #aa3bff', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Gestión Socios
            </button>
            <button onClick={() => cambiarVista('modulos')} style={{ background: vistaActiva === 'modulos' ? '#aa3bff' : 'none', color: vistaActiva === 'modulos' ? 'white' : '#aa3bff', border: '1px solid #aa3bff', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Control Clases
            </button>
          </div>

          <button onClick={() => navigate('/membresias')} style={{ background: 'none', border: '1px solid #aa3bff', color: '#aa3bff', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Membresías</button>
          <button onClick={() => navigate('/gestion-instructores')} style={{ background: 'none', border: '1px solid #aa3bff', color: '#aa3bff', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Instructores</button>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Salir</button>
        </div>
      </nav>

      {errorCarga && <div style={{ background: '#dc3545', color: 'white', padding: '12px 20px', textAlign: 'center' }}>{errorCarga}</div>}

      <div className="recepcion-content">
        {}
        {vistaActiva === 'socios' && (
          <>
            <header className="recepcion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
              <div>
                <h1>Gestión de Clientes (Socios)</h1>
                <div className="search-box"><input type="text" placeholder="Buscar socio por nombre..." onChange={(e) => setBusqueda(e.target.value)} /></div>
              </div>
              <button onClick={abrirCrear} style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Registrar Nuevo Socio</button>
            </header>

            <section className="tabla-socios">
              <table>
                <thead>
                  <tr><th>ID</th><th>Nombre</th><th>Correo Electrónico</th><th>Membresía</th><th>Estatus</th><th>Acciones Administrativas</th></tr>
                </thead>
                <tbody>
                  {miembrosFiltrados.map(m => (
                    <tr key={m.id}>
                      <td>{m.id}</td><td>{m.nombre}</td><td>{m.email || 'No registrado'}</td><td>{m.membresia ? m.membresia.nombre : 'Sin plan activo'}</td>
                      <td><span className={`badge ${m.estaActivo ? 'activo' : 'vencido'}`}>{m.estaActivo ? 'Activo' : 'Inactivo'}</span></td>
                      <td>
                        <button className="btn-checkin" onClick={() => registrarAsistenciaManual(m.id)}>Checar Entrada</button>
                        <button onClick={() => abrirEditar(m)} style={{ padding: '6px 12px', marginRight: '5px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                        <button onClick={() => eliminarSocio(m.id)} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {}
        {vistaActiva === 'modulos' && (
          <>
            <header className="recepcion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
              <div>
                <h1>Control y Activación de Módulos (Clases)</h1>
                <p style={{ color: '#aaa', margin: '5px 0 0' }}>Administra qué disciplinas ve el cliente y qué instructores las imparten.</p>
              </div>
              <button onClick={abrirCrearModulo} style={{ padding: '12px 24px', backgroundColor: '#aa3bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Agregar Nueva Disciplina</button>
            </header>

            <section className="tabla-socios">
              <table>
                <thead>
                  <tr><th>Módulo</th><th>Descripción</th><th>Instructor Asignado</th><th>Estatus Visibilidad</th><th>Acciones de Control</th></tr>
                </thead>
                <tbody>
                  {modulos.map(mod => {
                    const instructorAsignado = instructores.find(i => i.id === parseInt(mod.instructorId));
                    return (
                      <tr key={mod.id}>
                        <td style={{ fontWeight: 'bold', color: '#aa3bff' }}>{mod.nombre}</td>
                        <td style={{ fontSize: '0.85rem', color: '#ccc', maxWidth: '300px' }}>{mod.descripcion}</td>
                        <td style={{ fontWeight: '500' }}>
                          {instructorAsignado ? (
                            <span style={{ color: '#28a745' }}>👤 {instructorAsignado.nombreCompleto || instructorAsignado.nombre} — <small style={{color: '#aaa'}}>{instructorAsignado.especialidad}</small></span>
                          ) : (
                            <span style={{ color: '#dc3545', fontWeight: 'bold' }}>⚠️ Sin Instructor Asignado</span>
                          )}
                        </td>
                        <td>
                          {}
                          <span style={{ 
                            color: mod.activo ? '#28a745' : '#dc3545', 
                            fontWeight: 'bold',
                            fontSize: '0.95rem'
                          }}>
                            {mod.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => abrirEditarModulo(mod)} style={{ padding: '6px 12px', marginRight: '5px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Configurar / Asignar</button>
                          <button onClick={() => eliminarModulo(mod.id)} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Borrar</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </>
        )}
      </div>

      {}
      {modalAbierto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '450px', border: '1px solid #aa3bff', color: 'white' }}>
            <h2 style={{ color: '#aa3bff', marginTop: 0 }}>{editandoId ? 'Modificar Información' : 'Dar de Alta Socio'}</h2>
            {mensaje && <p style={{ fontWeight: 'bold', color: '#28a745', textAlign: 'center' }}>{mensaje}</p>}
            <form onSubmit={guardarSocio} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div><label>Nombre Completo:</label><input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ width: '95%', padding: '10px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #555', borderRadius: '6px' }} /></div>
              <div><label>Correo Electrónico:</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '95%', padding: '10px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #555', borderRadius: '6px' }} /></div>
              <div><label>Contraseña:</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="********" style={{ width: '95%', padding: '10px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #555', borderRadius: '6px' }} /></div>
              <div>
                <label>Asignar Membresía:</label>
                <select value={membresiaId} onChange={e => setMembresiaId(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #555', borderRadius: '6px' }}>
                  <option value="">Sin membresía (Inactivo)</option>
                  {membresias.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#aa3bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar</button>
                <button type="button" onClick={() => setModalAbierto(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: '6px' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {modalModuloAbierto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', center: 'center', justifyContent: 'center', zIndex: 110 }}>
          <div style={{ backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '450px', border: '1px solid #aa3bff', color: 'white' }}>
            <h2 style={{ color: '#aa3bff', marginTop: 0 }}>{editandoModuloId ? 'Configurar Módulo' : 'Nueva Disciplina / Clase'}</h2>
            <form onSubmit={guardarModulo} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div><label>Nombre de la Disciplina:</label><input type="text" value={modNombre} onChange={e => setModNombre(e.target.value)} required style={{ width: '95%', padding: '10px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #555', borderRadius: '6px' }} /></div>
              <div><label>Descripción:</label><textarea value={modDescripcion} onChange={e => setModDescripcion(e.target.value)} rows="2" required style={{ width: '95%', padding: '10px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #555', borderRadius: '6px', resize: 'none' }} /></div>
              <div>
                <label>Asignar Instructor del Gimnasio:</label>
                <select value={modInstructorId} onChange={e => setModInstructorId(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #555', borderRadius: '6px' }}>
                  <option value="">-- Seleccionar Entrenador Disponible --</option>
                  {instructores.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.nombreCompleto || inst.nombre} ({inst.especialidad})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
                <input type="checkbox" id="modActivoCheck" checked={modActivo} onChange={e => setModActivo(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
                <label htmlFor="modActivoCheck" style={{ cursor: 'pointer' }}>Módulo Activo (Visible para Clientes)</label>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#aa3bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Aplicar Configuración</button>
                <button type="button" onClick={() => setModalModuloAbierto(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: '6px' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionRecepcion;