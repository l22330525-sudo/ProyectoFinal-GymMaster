import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import InicioMiembro from './components/InicioMiembro';
import GestionRecepcion from "./components/GestionRecepcion";
import GestionInstructores from './components/GestionInstructores';
import ModuloDetalle from './components/ModuloDetalle';
import Membresias from './components/Membresias';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/inicio-miembro" element={<InicioMiembro />} />
        <Route path="/gestion-recepcion" element={<GestionRecepcion />} />
        <Route path="/gestion-instructores" element={<GestionInstructores />} />
        <Route path="/modulo/:tipo" element={<ModuloDetalle />} />
        <Route path="/membresias" element={<Membresias />} />
      </Routes>
    </Router>
  );
}

export default App;