import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Bienvenido a GymMaster</h1>
      <p>Sistema de gestión de gimnasio y control de membresías.</p>
      
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <Link to="/login">
          <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Iniciar Sesión</button>
        </Link>
        <Link to="/registro">
          <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Registrarse</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;