import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GestionRecepcion.css';

function GestionRecepcion() {
  const navigate = useNavigate();

  const [errorCarga, setErrorCarga] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [miembros, setMiembros] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [vistaActiva, setVistaActiva] = useState(() => {
    return localStorage.getItem('admin_tab_activa') || 'socios';
  });

  const cambiarVista = (vista) => {
    setVistaActiva(vista);
    localStorage.setItem('admin_tab_activa', vista);
    setBusqueda('');
  };

  const [modalSocioAbierto, setModalSocioAbierto] = useState(false);
  const [editandoSocioId, setEditandoSocioId] = useState(null);
  const [nombreSocio, setNombreSocio] = useState('');
  const [emailSocio, setEmailSocio] = useState('');
  const [passwordSocio, setPasswordSocio] = useState('');
  const [estaActivoSocio, setEstaActivoSocio] = useState(true);
  const [membresiaId, setMembresiaId] = useState('');
  const [mensajeSocio, setMensajeSocio] = useState('');

  const [modulos, setModulos] = useState([]);
  const [modalModuloAbierto, setModalModuloAbierto] = useState(false);
  const [editandoModuloId, setEditandoModuloId] = useState(null);
  const [modNombre, setModNombre] = useState('');
  const [modDescripcion, setModDescripcion] = useState('');
  const [modBadge, setModBadge] = useState('MD');
  const [modColor, setModColor] = useState('#aa3bff');
  const [modActivo, setModActivo] = useState(true);
  const [modInstructorId, setModInstructorId] = useState('');
  const [modHorarios, setModHorarios] = useState([]); // [{ diaSemana, horaInicio, horaFin, nivel }]
  const [mensajeModulo, setMensajeModulo] = useState('');

  const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const NIVELES = ['Todos los niveles', 'Principiante', 'Intermedio', 'Avanzado'];

  const cargarTodo = () => {
    const apiBase = 'http://localhost:5027/api';

    Promise.all([
      fetch(`${apiBase}/Miembros`).then(res => res.json()),
      fetch(`${apiBase}/Membresias`).then(res => res.json()),
      fetch(`${apiBase}/Instructores`).then(res => res.json()),
      fetch(`${apiBase}/Modulos`).then(res => res.json())
    ])
    .then(([dataMiembros, dataMembresias, dataInstructores, dataModulos]) => {
      setMiembros(dataMiembros);
      setMembresias(dataMembresias);
      setInstructores(dataInstructores);
      setModulos(dataModulos);
    })
    .catch(() => setErrorCarga('Error de conexión con el servidor API.'));
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const miembrosFiltrados = miembros.filter(m => m.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  const modulosFiltrados = modulos.filter(m => m.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  
  const pagosFiltrados = miembros.filter(m => 
    !m.estaActivo && m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirSocio = (socio = null) => {
    if (socio) {
      setEditandoSocioId(socio.id);
      setNombreSocio(socio.nombre);
      setEmailSocio(socio.email);
      setEstaActivoSocio(socio.estaActivo);
      setMembresiaId(socio.membresiaId || '');
    } else {
      setEditandoSocioId(null);
      setNombreSocio('');
      setEmailSocio('');
      setEstaActivoSocio(true);
      setMembresiaId('');
    }
    setPasswordSocio('');
    setMensajeSocio('');
    setModalSocioAbierto(true);
  };

  const guardarSocio = async (e) => {
    e.preventDefault();
    const datos = { nombre: nombreSocio, email: emailSocio, password: passwordSocio || undefined, estaActivo: estaActivoSocio, membresiaId: membresiaId ? parseInt(membresiaId) : null };
    const url = editandoSocioId ? `http://localhost:5027/api/Miembros/${editandoSocioId}` : 'http://localhost:5027/api/Miembros';
    const method = editandoSocioId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
      if (res.ok) {
        setMensajeSocio('¡Guardado!');
        setTimeout(() => { setModalSocioAbierto(false); cargarTodo(); }, 1000);
      }
    } catch { setMensajeSocio('Error al guardar.'); }
  };

  const eliminarSocio = async (id) => {
    if (window.confirm('¿Eliminar este socio?')) {
      await fetch(`http://localhost:5027/api/Miembros/${id}`, { method: 'DELETE' });
      cargarTodo();
    }
  };

  const registrarAsistencia = async (id) => {
    try {
      await fetch('http://localhost:5027/api/Asistencias/registrar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(id) });
      alert('Asistencia registrada.');
    } catch { alert('Error en registro.'); }
  };

  const procesarCobroEfectivo = async (socioId, monto) => {
    if (!window.confirm(`¿Confirmar recepción de $${monto} MXN en efectivo para activar al socio #${socioId}?`)) return;
    try {
      const response = await fetch('http://localhost:5027/api/Pagos/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ miembroId: socioId, monto: monto, metodo: "Efectivo" })
      });
      
      if (response.ok) {
        alert('¡Pago registrado y cuenta activada con éxito! 🏋️‍♂️');
        cargarTodo();
      } else {
        const socio = miembros.find(m => m.id === socioId);
        const datosActualizar = { 
          nombre: socio.nombre, 
          email: socio.email, 
          estaActivo: true, 
          membresiaId: socio.membresiaId || membresias[0]?.id || 1 
        };
        const resPut = await fetch(`http://localhost:5027/api/Miembros/${socioId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosActualizar)
        });
        if (resPut.ok) {
          alert('Socio activado correctamente mediante actualización de estatus.');
          cargarTodo();
        }
      }
    } catch {
      alert('Modo Simulado: Conexión emulada. Socio activado en la interfaz.');
      setMiembros(prev => prev.map(m => m.id === socioId ? { ...m, estaActivo: true } : m));
    }
  };

  const abrirModulo = (m = null) => {
    setMensajeModulo('');
    if (m) {
      setEditandoModuloId(m.id);
      setModNombre(m.nombre);
      setModDescripcion(m.descripcion || '');
      setModBadge(m.badge || 'MD');
      setModColor(m.color || '#aa3bff');
      setModActivo(m.activo);
      setModInstructorId(m.instructorId || '');
      setModHorarios((m.horarios || []).map(h => ({
        diaSemana: h.diaSemana,
        horaInicio: h.horaInicio,
        horaFin: h.horaFin,
        nivel: h.nivel || 'Todos los niveles'
      })));
    } else {
      setEditandoModuloId(null);
      setModNombre('');
      setModDescripcion('');
      setModBadge('MD');
      setModColor('#aa3bff');
      setModActivo(true);
      setModInstructorId('');
      setModHorarios([]);
    }
    setModalModuloAbierto(true);
  };

  const agregarHorario = () => {
    setModHorarios([...modHorarios, { diaSemana: 'Lunes', horaInicio: '07:00', horaFin: '08:00', nivel: 'Todos los niveles' }]);
  };

  const actualizarHorario = (idx, campo, valor) => {
    setModHorarios(modHorarios.map((h, i) => i === idx ? { ...h, [campo]: valor } : h));
  };

  const eliminarHorario = (idx) => {
    setModHorarios(modHorarios.filter((_, i) => i !== idx));
  };

  const guardarModulo = async (e) => {
    e.preventDefault();
    setMensajeModulo('');

    // Validación de horarios: hora fin > hora inicio
    for (const h of modHorarios) {
      if (h.horaFin <= h.horaInicio) {
        setMensajeModulo(`La hora de fin debe ser posterior a la de inicio en el horario de ${h.diaSemana}.`);
        return;
      }
    }

    const payload = {
      nombre: modNombre,
      descripcion: modDescripcion,
      badge: modBadge,
      color: modColor,
      activo: modActivo,
      instructorId: modInstructorId ? parseInt(modInstructorId) : null,
      horarios: modHorarios
    };

    try {
      const url = editandoModuloId
        ? `http://localhost:5027/api/Modulos/${editandoModuloId}`
        : 'http://localhost:5027/api/Modulos';
      const method = editandoModuloId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMensajeModulo(editandoModuloId ? '¡Clase actualizada con éxito!' : '¡Clase creada con éxito!');
        setTimeout(() => {
          setModalModuloAbierto(false);
          cargarTodo();
        }, 1200);
      } else {
        const errMsg = await res.text();
        setMensajeModulo(`Error: ${errMsg}`);
      }
    } catch {
      setMensajeModulo('No se pudo conectar con el servidor.');
    }
  };

  const eliminarModulo = async (id) => {
    if (!window.confirm('¿Eliminar esta clase de forma permanente? Sus horarios también se borrarán.')) return;
    try {
      const res = await fetch(`http://localhost:5027/api/Modulos/${id}`, { method: 'DELETE' });
      if (res.ok) cargarTodo();
      else alert('Ocurrió un error al eliminar la clase.');
    } catch {
      alert('No se pudo conectar con el servidor.');
    }
  };

  // Resumen corto de los horarios para la tabla del admin.
  const resumenHorariosAdmin = (horarios) => {
    if (!horarios || horarios.length === 0) return 'Sin horarios asignados';
    return horarios
      .map(h => `${h.diaSemana.substring(0, 3)} ${h.horaInicio}`)
      .slice(0, 3)
      .join(' · ') + (horarios.length > 3 ? '…' : '');
  };

  const handleLogout = () => {
    localStorage.removeItem('socioId');
    localStorage.removeItem('socioNombre');
    localStorage.removeItem('socioRol');
    localStorage.removeItem('admin_tab_activa');
    navigate('/login');
  };

  return (
    <div className="recepcion-container">
      <nav className="navbar-admin">
        <div className="logo-gym">GYM <span>MASTER</span></div>
        <div className="nav-actions">
          <div className="tabs-admin">
            <button className={vistaActiva === 'socios' ? 'active' : ''} onClick={() => cambiarVista('socios')}>Socios</button>
            <button className={vistaActiva === 'modulos' ? 'active' : ''} onClick={() => cambiarVista('modulos')}>Clases</button>
            <button className={vistaActiva === 'pagos' ? 'active' : ''} onClick={() => cambiarVista('pagos')}>Validación Pagos</button>
            <button className="" onClick={() => navigate('/membresias')}>Membresías</button>
            <button className="" onClick={() => navigate('/gestion-instructores')}>Staff</button>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <div className="recepcion-content">
        <div className="top-bar">
          <input 
            type="text" 
            placeholder={`Filtrar ${vistaActiva}...`} 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            className="main-search"
          />
          {vistaActiva === 'socios' && <button className="btn-add-main" onClick={() => abrirSocio()}>+ Nuevo Socio</button>}
          {vistaActiva === 'modulos' && <button className="btn-add-main" onClick={() => abrirModulo()}>+ Nueva Clase</button>}
        </div>

        {errorCarga && <div className="error-msg">{errorCarga}</div>}

        {vistaActiva === 'socios' && (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>ID</th><th>Nombre</th><th>Plan</th><th>Estatus</th><th>Acciones</th></tr></thead>
              <tbody>
                {miembrosFiltrados.map(m => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td><strong>{m.nombre}</strong><br/><span>{m.email}</span></td>
                    <td>{m.membresia?.nombre || 'Sin Plan'}</td>
                    <td><span className={`status-pill ${m.estaActivo ? 'activo' : 'vencido'}`}>{m.estaActivo ? 'Activo' : 'Inactivo'}</span></td>
                    <td>
                      <button className="btn-check" onClick={() => registrarAsistencia(m.id)}>Check</button>
                      <button className="btn-edit" onClick={() => abrirSocio(m)}>Editar</button>
                      <button className="btn-del" onClick={() => eliminarSocio(m.id)}>X</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {vistaActiva === 'modulos' && (
          <div className="table-wrapper">
             <table>
                <thead><tr><th>Clase</th><th>Instructor Asignado</th><th>Horarios</th><th>Visibilidad</th><th>Acciones</th></tr></thead>
                <tbody>
                  {modulosFiltrados.map(mod => {
                    const inst = instructores.find(i => i.id === mod.instructorId);
                    const claseVisible = mod.activo && (!inst || inst.estaActivo !== false);

                    return (
                      <tr key={mod.id}>
                        <td>
                          <span style={{ display: 'inline-block', width: 24, height: 24, borderRadius: 12, background: mod.color, color: 'white', textAlign: 'center', lineHeight: '24px', fontSize: '0.7rem', fontWeight: 'bold', marginRight: 8 }}>{mod.badge}</span>
                          <strong>{mod.nombre}</strong><br/>
                          <span style={{ fontSize: '0.85em', color: '#888' }}>
                            {mod.descripcion}
                          </span>
                        </td>
                        <td>{mod.instructorNombre || (inst ? inst.nombreCompleto : 'Sin asignar')}</td>
                        <td style={{ fontSize: '0.85em', color: '#666' }}>{resumenHorariosAdmin(mod.horarios)}</td>
                        <td><span className={claseVisible ? 'txt-ok' : 'txt-no'}>{claseVisible ? 'Público' : 'Privado'}</span></td>
                        <td>
                          <button className="btn-edit" onClick={() => abrirModulo(mod)}>Config</button>
                          <button className="btn-del" onClick={() => eliminarModulo(mod.id)}>X</button>
                        </td>
                      </tr>
                    );
                  })}
                  {modulosFiltrados.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>
                      No hay clases registradas todavía.
                    </td></tr>
                  )}
                </tbody>
              </table>
          </div>
        )}

        {vistaActiva === 'pagos' && (
          <div className="table-wrapper">
             <table>
                <thead>
                  <tr>
                    <th>ID Socio</th>
                    <th>Nombre del Cliente</th>
                    <th>Membresía Solicitada</th>
                    <th>Monto a Cobrar</th>
                    <th>Caja de Recepción</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosFiltrados.map(m => {
                    const plan = membresias.find(p => p.id === m.membresiaId);
                    return (
                      <tr key={m.id}>
                        <td>#{m.id}</td>
                        <td><strong>{m.nombre}</strong><br/><span>{m.email}</span></td>
                        <td style={{ fontWeight: 'bold' }}>{plan?.nombre || m.membresia?.nombre || 'Plan Diario'}</td>
                        <td style={{ color: '#28A745', fontWeight: 'bold' }}>${plan?.costo || m.membresia?.costo || 50} MXN</td>
                        <td>
                          <button className="btn-check" onClick={() => procesarCobroEfectivo(m.id, plan?.costo || 50)}>
                            Confirmar Pago
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {pagosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: '#aaa', padding: '20px' }}>
                        No hay validaciones ni cobros pendientes por QR.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>
        )}

      </div>

      {modalSocioAbierto && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{editandoSocioId ? 'Editar Socio' : 'Alta de Socio'}</h3>
            {mensajeSocio && <p className="modal-msg">{mensajeSocio}</p>}
            <form onSubmit={guardarSocio}>
              <input type="text" placeholder="Nombre" value={nombreSocio} onChange={e => setNombreSocio(e.target.value)} required />
              <input type="email" placeholder="Email" value={emailSocio} onChange={e => setEmailSocio(e.target.value)} required />
              <input type="password" placeholder="Contraseña (Requerida en alta)" value={passwordSocio} onChange={e => setPasswordSocio(e.target.value)} required={!editandoSocioId} />
              
              <select value={membresiaId} onChange={e => setMembresiaId(e.target.value)}>
                <option value="">Seleccionar Plan...</option>
                {membresias.map(mb => <option key={mb.id} value={mb.id}>{mb.nombre}</option>)}
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', marginBottom: '5px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={estaActivoSocio} 
                  onChange={e => setEstaActivoSocio(e.target.checked)} 
                  style={{ width: 'auto', margin: 0, transform: 'scale(1.2)' }} 
                />
                <span style={{ fontWeight: 'bold', color: estaActivoSocio ? '#28A745' : '#dc3545' }}>
                  {estaActivoSocio ? 'Estatus: Cuenta Activa' : 'Estatus: Cuenta Inactiva (Bloqueado)'}
                </span>
              </label>

              <div className="modal-footer">
                <button type="submit" className="btn-save">Guardar</button>
                <button type="button" onClick={() => setModalSocioAbierto(false)}>Cerrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalModuloAbierto && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '600px' }}>
            <h3>{editandoModuloId ? 'Configurar Clase' : 'Nueva Clase'}</h3>
            {mensajeModulo && (
              <p className="modal-msg" style={{ color: mensajeModulo.includes('con éxito') ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                {mensajeModulo}
              </p>
            )}
            <form onSubmit={guardarModulo}>
              <input type="text" placeholder="Nombre de la clase (Ej. Boxeo)" value={modNombre} onChange={e => setModNombre(e.target.value)} required />

              <textarea
                placeholder="Descripción breve de la clase"
                value={modDescripcion}
                onChange={e => setModDescripcion(e.target.value)}
                rows="2"
                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'none' }}
              />

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Badge (Ej. BX)"
                  value={modBadge}
                  onChange={e => setModBadge(e.target.value.toUpperCase().substring(0, 4))}
                  maxLength={4}
                  style={{ flex: 1 }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.9em', color: '#555' }}>Color:</span>
                  <input
                    type="color"
                    value={modColor}
                    onChange={e => setModColor(e.target.value)}
                    style={{ width: '40px', height: '36px', padding: 0, border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                  />
                </label>
              </div>

              <select value={modInstructorId} onChange={e => setModInstructorId(e.target.value)}>
                <option value="">Asignar Instructor...</option>
                {instructores.map(i => <option key={i.id} value={i.id}>{i.nombreCompleto}</option>)}
              </select>

              <fieldset style={{ marginTop: '15px', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }}>
                <legend style={{ fontWeight: 'bold', padding: '0 6px', fontSize: '0.95em' }}>Horarios de la clase</legend>

                {modHorarios.length === 0 && (
                  <p style={{ color: '#888', fontSize: '0.9em', margin: '8px 0' }}>
                    Aún no hay horarios. Agrega uno o más.
                  </p>
                )}

                {modHorarios.map((h, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '6px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                      value={h.diaSemana}
                      onChange={e => actualizarHorario(idx, 'diaSemana', e.target.value)}
                      style={{ flex: '1 1 110px', margin: 0 }}
                    >
                      {DIAS_SEMANA.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <input
                      type="time"
                      value={h.horaInicio}
                      onChange={e => actualizarHorario(idx, 'horaInicio', e.target.value)}
                      style={{ flex: '0 1 110px', margin: 0 }}
                      required
                    />
                    <span style={{ fontSize: '0.85em', color: '#666' }}>a</span>
                    <input
                      type="time"
                      value={h.horaFin}
                      onChange={e => actualizarHorario(idx, 'horaFin', e.target.value)}
                      style={{ flex: '0 1 110px', margin: 0 }}
                      required
                    />
                    <select
                      value={h.nivel}
                      onChange={e => actualizarHorario(idx, 'nivel', e.target.value)}
                      style={{ flex: '1 1 140px', margin: 0 }}
                    >
                      {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <button
                      type="button"
                      onClick={() => eliminarHorario(idx)}
                      style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontSize: '0.85em' }}
                    >
                      X
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={agregarHorario}
                  style={{ marginTop: '8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', fontSize: '0.9em', fontWeight: 'bold' }}
                >
                  + Agregar horario
                </button>
              </fieldset>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={modActivo}
                  onChange={e => setModActivo(e.target.checked)}
                  style={{ width: 'auto', margin: 0, transform: 'scale(1.2)' }}
                />
                <span>Hacer visible esta clase para los clientes</span>
              </label>

              <div className="modal-footer">
                <button type="submit" className="btn-save">{editandoModuloId ? 'Aplicar Cambios' : 'Crear Clase'}</button>
                <button type="button" onClick={() => setModalModuloAbierto(false)}>Cerrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionRecepcion;