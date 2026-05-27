import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GestionRecepcion.css';

const miembrosFallback = [
  { id: 1, nombre: "Flacow Prueba", estaActivo: true, membresia: { nombre: "Semanal + Boxeo" } },
  { id: 2, nombre: "Cristopher Valdez", estaActivo: false, membresia: { nombre: "Mensual" } },
];

function GestionRecepcion() {
  const [busqueda, setBusqueda] = useState('');
  const [miembros, setMiembros] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5027/api/Miembros')
      .then(res => res.json())
      .then(data => setMiembros(data))
      .catch(() => {
        console.warn('Modo Mac: usando datos de respaldo');
        setMiembros(miembrosFallback);
      });
  }, []);

  const miembrosFiltrados = miembros.filter(m =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="recepcion-container">
      <nav className="navbar-miembro">
        <div className="logo-gym">GYM <span>MASTER</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="user-role">Panel de Recepción</div>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: '1px solid #ff4d4d',
              color: '#ff4d4d',
              padding: '6px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="recepcion-content">
        <header className="recepcion-header">
          <h1>Control de Acceso</h1>
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar socio por nombre..."
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </header>

        <section className="tabla-socios">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Plan</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {miembrosFiltrados.map(m => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.nombre}</td>
                  <td>{m.membresia ? m.membresia.nombre : 'Sin plan'}</td>
                  <td>
                    <span className={`badge ${m.estaActivo ? 'activo' : 'vencido'}`}>
                      {m.estaActivo ? 'Activo' : 'Vencido'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-checkin">Registrar Entrada</button>
                    <button className="btn-pago">Cobrar Mensualidad</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default GestionRecepcion;