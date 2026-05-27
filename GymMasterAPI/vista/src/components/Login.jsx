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
  console.warn('Modo desarrollo desde la mac, simulando el acceso');
  const emailLower = email.toLowerCase();

  if (emailLower.includes('recepcion') || emailLower.includes('admin')) {
    localStorage.setItem('socioNombre', 'Recepcionista (Modo Simulado)');
    navigate('/gestion-recepcion');
  } else {
    localStorage.setItem('socioId', '1');
    localStorage.setItem('socioNombre', 'Socio de Prueba');
    navigate('/inicio-miembro');
  }
}
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', color: '#333' }}>
      <h2 style={{ textAlign: 'center' }}>Identificación de Ingreso</h2>
      
      {error && (
        <p style={{ color: '#DC3545', fontWeight: 'bold', fontSize: '14px', marginBottom: '15px', textAlign: 'center' }}>
           {error}
        </p>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico:</label>
          <input 
            type="email" 
            placeholder="recepcion@gym.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '95%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
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
            style={{ width: '95%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
          Ingresar
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        <p>¿No tienes cuenta? <Link to="/registro" style={{ color: '#007BFF' }}>Regístrate aquí</Link></p>
        <Link to="/" style={{ textDecoration: 'none', color: '#666' }}>← Volver al inicio</Link>
      </div>
    </div>
  );
}

export default Login;