import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GestionRecepcion.css';

function GestionInstructores() {
  const [instructores, setInstructores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [errorCarga, setErrorCarga] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [turno, setTurno] = useState('');
  const [estaActivo, setEstaActivo] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const navigate = useNavigate();

  const cargarInstructores = () => {
    fetch('http://localhost:5027/api/Instructores')
      .then(res => res.json())
      .then(data => setInstructores(data))
      .catch(() => setErrorCarga('No se pudo conectar con el servidor. Verifica que la API esté corriendo.'));
  };

  useEffect(() => {
    cargarInstructores();
  }, []);

  const instructoresFiltrados = instructores.filter(i =>
    i.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('socioId');
    localStorage.removeItem('socioNombre');
    localStorage.removeItem('socioRol');
    navigate('/login');
  };

  const abrirCrear = () => { setEditandoId(null); setNombreCompleto(''); setEspecialidad(''); setTurno(''); setEstaActivo(true); setMensaje(''); setModalAbierto(true); };
  const abrirEditar = (instructor) => { setEditandoId(instructor.id); setNombreCompleto(instructor.nombreCompleto); setEspecialidad(instructor.especialidad); setTurno(instructor.turno); setEstaActivo(instructor.estaActivo); setMensaje(''); setModalAbierto(true); };

  const guardarInstructor = async (e) => {
    e.preventDefault();
    setMensaje('');
    const datos = editandoId ? { id: editandoId, nombreCompleto, especialidad, turno, estaActivo } : { nombreCompleto, especialidad, turno };
    try {
      const url = editandoId ? `http://localhost:5027/api/Instructores/${editandoId}` : 'http://localhost:5027/api/Instructores';
      const method = editandoId ? 'PUT' : 'POST';
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
      if (response.ok) { setMensaje(editandoId ? '¡Instructor actualizado con éxito!' : '¡Instructor registrado con éxito!'); setTimeout(() => { setModalAbierto(false); cargarInstructores(); }, 1500); } 
      else { const errorMsg = await response.text(); setMensaje(`Error en servidor: ${errorMsg}`); }
    } catch (err) { setMensaje('No se pudo conectar con el servidor.'); }
  };

  const eliminarInstructor = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar permanentemente a este instructor?')) return;
    try {
      const response = await fetch(`http://localhost:5027/api/Instructores/${id}`, { method: 'DELETE' });
      if (response.ok) { cargarInstructores(); } else { alert('Ocurrió un error al intentar eliminar al instructor.'); }
    } catch (err) { alert('No se pudo conectar con el servidor.'); }
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
            <button onClick={() => { localStorage.setItem('admin_tab_activa', 'socios'); navigate('/gestion-recepcion'); }} style={{ background: 'none', color: '#aa3bff', border: '1px solid #aa3bff', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Gestión Socios
            </button>
            <button onClick={() => { localStorage.setItem('admin_tab_activa', 'modulos'); navigate('/gestion-recepcion'); }} style={{ background: 'none', color: '#aa3bff', border: '1px solid #aa3bff', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Control Clases
            </button>
          </div>

          <button onClick={() => navigate('/membresias')} style={{ background: 'none', border: '1px solid #aa3bff', color: '#aa3bff', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Membresías</button>
          
          {}
          <button style={{ background: '#aa3bff', border: '1px solid #aa3bff', color: 'white', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Instructores</button>
          
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Salir</button>
        </div>
      </nav>

      {errorCarga && <div style={{ background: '#dc3545', color: 'white', padding: '12px 20px', textAlign: 'center', fontWeight: 'bold' }}>{errorCarga}</div>}

      <div className="recepcion-content">
        <header className="recepcion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <div>
            <h1>Gestión de Instructores</h1>
            <div className="search-box">
              <input type="text" placeholder="Buscar instructor por nombre..." onChange={(e) => setBusqueda(e.target.value)} />
            </div>
          </div>
          <button onClick={abrirCrear} style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            Registrar Nuevo Instructor
          </button>
        </header>

        <section className="tabla-socios">
          <table>
            <thead>
              <tr><th>ID</th><th>Nombre Completo</th><th>Especialidad</th><th>Turno</th><th>Estatus</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {instructoresFiltrados.map(i => (
                <tr key={i.id}>
                  <td>{i.id}</td><td>{i.nombreCompleto}</td><td>{i.especialidad}</td><td>{i.turno}</td>
                  <td><span className={`badge ${i.estaActivo ? 'activo' : 'vencido'}`}>{i.estaActivo ? 'Activo' : 'Inactivo'}</span></td>
                  <td>
                    <button onClick={() => abrirEditar(i)} style={{ padding: '8px 15px', marginRight: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#ffc107', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => eliminarInstructor(i.id)} style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#dc3545', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {modalAbierto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '450px', border: '1px solid #aa3bff', color: 'white' }}>
            <h2 style={{ color: '#aa3bff', marginTop: 0 }}>{editandoId ? 'Modificar Instructor' : 'Dar de Alta Instructor'}</h2>
            {mensaje && <p style={{ fontWeight: 'bold', color: mensaje.includes('con éxito') ? '#28a745' : '#dc3545', textAlign: 'center' }}>{mensaje}</p>}
            <form onSubmit={guardarInstructor} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div><label>Nombre Completo:</label><input type="text" value={nombreCompleto} onChange={e => setNombreCompleto(e.target.value)} required style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} /></div>
              <div><label>Especialidad:</label><input type="text" value={especialidad} onChange={e => setEspecialidad(e.target.value)} required placeholder="Ej. Boxeo, Zumba" style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} /></div>
              <div>
                <label>Turno:</label>
                <select value={turno} onChange={e => setTurno(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }}>
                  <option value="">Selecciona un turno</option><option value="Matutino">Matutino</option><option value="Vespertino">Vespertino</option><option value="Matutino y Vespertino">Matutino y Vespertino</option>
                </select>
              </div>
              {editandoId && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
                  <input type="checkbox" id="activoCheckInstructor" checked={estaActivo} onChange={e => setEstaActivo(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
                  <label htmlFor="activoCheckInstructor" style={{ cursor: 'pointer' }}>Instructor Activo</label>
                </div>
              )}
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#aa3bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{editandoId ? 'Guardar Cambios' : 'Confirmar Registro'}</button>
                <button type="button" onClick={() => setModalAbierto(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionInstructores;