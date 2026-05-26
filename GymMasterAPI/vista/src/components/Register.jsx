import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoSocio = {
      nombre: nombre,
      email: email,
      password: password,
      membresiaId: null
    };

    try {
      const response = await fetch('http://localhost:5027/api/Miembros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoSocio)
      });

      if (response.ok) {
        setMensaje('Socio registrado con éxito en la Base de Datos');
        setTimeout(() => navigate('/login'), 2000); 
      } else {
        const errorText = await response.text();
        setMensaje(`Error en el servidor: ${errorText}`);
      }
    } catch (error) {
      setMensaje('No se pudo establecer conexión con el servidor de .NET.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Registro de Nuevo Socio</h2>
      
      {}
      {mensaje && (
        <p style={{ color: mensaje.includes('éxito') ? '#28A745' : '#DC3545', fontWeight: 'bold', fontSize: '14px' }}>
          {mensaje}
        </p>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nombre Completo:</label>
          <input 
            type="text" 
            placeholder="Juan Pérez" 
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required 
            style={{ width: '95%', padding: '8px' }} 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico:</label>
          <input 
            type="email" 
            placeholder="juan@gym.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            style={{ width: '95%', padding: '8px' }} 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <input 
            type="password" 
            placeholder="********" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{ width: '95%', padding: '8px' }} 
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28A745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Crear Cuenta
        </button>
      </form>
      
      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        ¿Ya estás registrado? <Link to="/login">Inicia sesión</Link>
      </p>
      <div style={{ marginTop: '10px' }}>
        <Link to="/" style={{ fontSize: '14px', textDecoration: 'none' }}>← Volver al inicio</Link>
      </div>
    </div>
  );
}

export default Register;