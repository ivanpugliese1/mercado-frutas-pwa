import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.ts';
import { useAuthStore } from '../store/authStore.ts';

export default function Login() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setUsuario = useAuthStore((state) => state.setUsuario);
  const navigate = useNavigate();

  async function handleLogin() {
    if (!nombreUsuario || !password) {
      setError("Por favor, ingresa tu nombre de usuario y contraseña.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const usuario = await authApi.login({ nombreUsuario: nombreUsuario, password });
      setUsuario(usuario);
      navigate('/');
    } catch (error) {
      setError("Nombre de usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">🌿 Mercado Frutas</h1>
          <p className="text-green-400 mt-2 text-sm">Iniciá sesión para continuar</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Tu nombre de usuario"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Tu contraseña"
            />
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-300 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>

      </div>
    </div>
  );
}