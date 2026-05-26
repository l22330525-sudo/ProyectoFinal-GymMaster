import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const credenciales = {
      email: email,
      password: password
    };

    try {
      const response = await fetch('http://localhost:5027/api/Miembros/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credenciales)
      });

      if (response.ok) {
        const data = await response.json();
       
        localStorage.setItem('socioId', data.id);
        localStorage.setItem('socioNombre', data.nombre);

        navigate('/inicio-miembro'); 
      } else {
        const mensajeError = await response.text();
        setError(mensajeError || 'Credenciales inválidas.');
      }
    } catch (err) {
      setError('No hay conexión con el servidor de .NET.');
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Identificación de Ingreso</h2>
      
      {error && (
        <p style={{ color: '#DC3545', fontWeight: 'bold', fontSize: '14px', marginBottom: '15px' }}>
          ⚠️ {error}
        </p>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Ingresar
        </button>
      </form>

      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>
      <div style={{ marginTop: '10px' }}>
        <Link to="/" style={{ fontSize: '14px', textDecoration: 'none' }}>← Volver al inicio</Link>
      </div>
    </div>
  );
}

export default Login;