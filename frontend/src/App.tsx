import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";
import Ventas from "./pages/Ventas";
import Proveedores from "./pages/Proveedores";

function RutaProtegida({ children }: { children: React.ReactNode }) {
  const estaAutenticado = useAuthStore((state) => state.estaAutenticado);
  return estaAutenticado() ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="stock" element={<Stock />} />
        <Route path="ventas" element={<Ventas />} />
        <Route path="proveedores" element={<Proveedores />} />
      </Route>
    </Routes>
  );
}