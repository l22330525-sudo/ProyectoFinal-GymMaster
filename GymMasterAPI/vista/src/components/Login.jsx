import { Link, useNavigate } from 'react-router-dom'; 

function Login() {
  const navigate = useNavigate(); 

  
  const manejarIngreso = (e) => {
    e.preventDefault(); 
    navigate('/inicio-miembro'); 
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Iniciar Sesión</h2>
      {}
      <form onSubmit={manejarIngreso} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Correo:</label>
          <input type="text" placeholder="Ej. carlos@gym.com" style={{ width: '95%', padding: '8px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <input type="password" placeholder="********" style={{ width: '95%', padding: '8px' }} />
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