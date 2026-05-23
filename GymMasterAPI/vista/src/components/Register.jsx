import { Link } from 'react-router-dom';

function Register() {
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Registro de Nuevo Socio</h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nombre Completo:</label>
          <input type="text" placeholder="Juan Pérez" style={{ width: '95%', padding: '8px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico:</label>
          <input type="email" placeholder="juan@gym.com" style={{ width: '95%', padding: '8px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
          <input type="password" placeholder="********" style={{ width: '95%', padding: '8px' }} />
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