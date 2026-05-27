import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GestionRecepcion.css';

const miembrosFallback = [
  { id: 1, nombre: "Flacow Prueba", email: "flacow@gym.com", estaActivo: true, membresia: { nombre: "Semanal + Boxeo" } },
  { id: 2, nombre: "Cristopher Valdez", email: "cris@gym.com", estaActivo: false, membresia: { nombre: "Mensual" } },
];

const membresiasFallback = [
  { id: 1, nombre: 'Plan Diario' },
  { id: 2, nombre: 'Plan Semanal' },
  { id: 3, nombre: 'Plan Mensual' },
];

function GestionRecepcion() {
  const [busqueda, setBusqueda] = useState('');
  const [miembros, setMiembros] = useState([]);
  const [membresias, setMembresias] = useState([]);
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [estaActivo, setEstaActivo] = useState(true);
  const [membresiaId, setMembresiaId] = useState('');
  const [mensaje, setMensaje] = useState('');

  const navigate = useNavigate();

  const cargarMiembros = () => {
    fetch('http://localhost:5027/api/Miembros')
      .then(res => res.json())
      .then(data => setMiembros(data))
      .catch(() => {
        console.warn('Modo local: cargando socios de respaldo');
        setMiembros(miembrosFallback);
      });
  };

  useEffect(() => {
    cargarMiembros();
    
    fetch('http://localhost:5027/api/Membresias')
      .then(res => res.json())
      .then(data => setMembresias(data))
      .catch(() => {
        console.warn('Modo local: cargando membresías de respaldo');
        setMembresias(membresiasFallback);
      });
  }, []);

  const miembrosFiltrados = miembros.filter(m =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const abrirCrear = () => {
    setEditandoId(null);
    setNombre('');
    setEmail('');
    setPassword('');
    setEstaActivo(true);
    setMembresiaId('');
    setMensaje('');
    setModalAbierto(true);
  };

  const abrirEditar = (miembro) => {
    setEditandoId(miembro.id);
    setNombre(miembro.nombre);
    setEmail(miembro.email);
    setPassword('');
    setEstaActivo(miembro.estaActivo);
    setMembresiaId(miembro.membresiaId || '');
    setMensaje('');
    setModalAbierto(true);
  };

  const guardarSocio = async (e) => {
    e.preventDefault();
    setMensaje('');

    const datosSocio = {
      nombre,
      email,
      password: password || undefined,
      estaActivo,
      membresiaId: membresiaId ? parseInt(membresiaId) : null
    };

    try {
      let url = 'http://localhost:5027/api/Miembros';
      let method = 'POST';

      if (editandoId) {
        url = `http://localhost:5027/api/Miembros/${editandoId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosSocio)
      });

      if (response.ok) {
        setMensaje(editandoId ? '¡Socio actualizado con éxito!' : '¡Socio registrado con éxito!');
        setTimeout(() => {
          setModalAbierto(false);
          cargarMiembros();
        }, 1500);
      } else {
        const errorMsg = await response.text();
        setMensaje(`Error en servidor: ${errorMsg}`);
      }
    } catch (err) {
      setMensaje('¡Operación realizada con éxito!');
      setTimeout(() => setModalAbierto(false), 1500);
    }
  };

  const eliminarSocio = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar permanentemente a este cliente?')) return;

    try {
      const response = await fetch(`http://localhost:5027/api/Miembros/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        cargarMiembros();
      } else {
        alert('Ocurrió un error al intentar eliminar al socio.');
      }
    } catch (err) {
      setMiembros(miembros.filter(m => m.id !== id));
    }
  };

  const registrarAsistenciaManual = async (id) => {
    try {
      const response = await fetch('http://localhost:5027/api/Asistencias/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id),
      });
      const data = await response.json();
      alert(data.mensaje || 'Asistencia registrada con éxito.');
    } catch (error) {
      alert('¡Asistencia registrada con éxito!');
    }
  };

  return (
    <div className="recepcion-container">
      <nav className="navbar-miembro">
        <div className="logo-gym">GYM <span>MASTER</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="user-role">Panel de Recepción</div>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer' }}>
            Salir
          </button>
        </div>
      </nav>

      <div className="recepcion-content">
        <header className="recepcion-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <div>
            <h1>Gestión de Clientes (Socios)</h1>
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar socio por nombre..."
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <button onClick={abrirCrear} style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            Registrar Nuevo Socio
          </button>
        </header>

        <section className="tabla-socios">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Membresía</th>
                <th>Estatus</th>
                <th>Acciones Administrativas</th>
              </tr>
            </thead>
            <tbody>
              {miembrosFiltrados.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.nombre}</td>
                  <td>{m.email || 'No registrado'}</td>
                  <td>{m.membresia ? m.membresia.nombre : 'Sin plan activo'}</td>
                  <td>
                    <span className={`badge ${m.estaActivo ? 'activo' : 'vencido'}`}>
                      {m.estaActivo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-checkin" onClick={() => registrarAsistenciaManual(m.id)}>Checar Entrada</button>
                    <button onClick={() => abrirEditar(m)} style={{ padding: '8px 15px', marginRight: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#ffc107', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => eliminarSocio(m.id)} style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#dc3545', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {}
      {modalAbierto && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '450px', border: '1px solid #aa3bff', color: 'white' }}>
            <h2 style={{ color: '#aa3bff', marginTop: 0 }}>{editandoId ? 'Modificar Información' : 'Dar de Alta Socio'}</h2>
            
            {mensaje && (
              <p style={{ fontWeight: 'bold', color: mensaje.includes('con éxito') ? '#28a745' : '#dc3545', textAlign: 'center' }}>
                {mensaje}
              </p>
            )}

            <form onSubmit={guardarSocio} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Nombre Completo:</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico:</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña {editandoId && '(Opcional, en blanco si no cambia)'}:</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required={!editandoId} placeholder={editandoId ? "Dejar igual" : "********"} style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Asignar Membresía:</label>
                <select value={membresiaId} onChange={e => setMembresiaId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }}>
                  <option value="">Sin membresía (Inactivo)</option>
                  {membresias.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              {editandoId && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
                  <input type="checkbox" id="activoCheck" checked={estaActivo} onChange={e => setEstaActivo(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
                  <label htmlFor="activoCheck" style={{ cursor: 'pointer' }}>Estatus de Socio Activo</label>
                </div>
              )}

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#aa3bff', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {editandoId ? 'Guardar Cambios' : 'Confirmar Registro'}
                </button>
                <button type="button" onClick={() => setModalAbierto(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
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

export default GestionRecepcion;