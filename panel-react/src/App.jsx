import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Articulos from './pages/Articulos.jsx';
import ArticuloForm from './pages/ArticuloForm.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas que exigen sesión iniciada */}
          <Route element={<RutaProtegida />}>
            <Route path="/articulos" element={<Articulos />} />
            <Route path="/articulos/nuevo" element={<ArticuloForm />} />
          </Route>

          {/* Rutas solo para administradores */}
          <Route element={<RutaProtegida soloAdmin />}>
            <Route path="/articulos/editar/:id" element={<ArticuloForm />} />
          </Route>

          <Route path="*" element={<Navigate to="/articulos" replace />} />
        </Routes>
      </main>
    </>
  );
}
