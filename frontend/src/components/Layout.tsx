import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { to: "/", label: "Inicio", icon: "◈" },
  { to: "/stock", label: "Stock", icon: "⊞" },
  { to: "/ventas", label: "Ventas", icon: "◎" },
  { to: "/proveedores", label: "Proveedores", icon: "◉" },
];

export default function Layout() {
  const { usuario, cerrarSesion } = useAuthStore();
  const esAdmin = useAuthStore((s) => s.esAdmin);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">

      {/* Sidebar — solo en PC */}
      <aside className="hidden lg:flex flex-col w-64 bg-green-950 min-h-screen p-6">
        <div className="mb-10">
          <h1 className="text-white text-xl font-bold">🌿 Mercado Frutas</h1>
          <p className="text-green-400 text-xs mt-1">{usuario?.nombreUsuario} · {usuario?.rol}</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            if (item.to === "/proveedores" && !esAdmin()) return null;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${isActive
                    ? "bg-green-700 text-white"
                    : "text-green-300 hover:bg-green-900 hover:text-white"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={cerrarSesion}
          className="text-green-400 hover:text-white text-sm font-semibold text-left px-4 py-3 rounded-xl hover:bg-green-900 transition-colors"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">

        {/* Header mobile */}
        <header className="lg:hidden bg-green-950 px-5 py-4 flex justify-between items-center">
          <h1 className="text-white font-bold text-lg">🌿 Mercado Frutas</h1>
          <span className="text-green-400 text-xs">{usuario?.nombreUsuario}</span>
        </header>

        {/* Contenido de cada página */}
        <div className="flex-1 p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Bottom nav — solo en mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        {navItems.map((item) => {
          if (item.to === "/proveedores" && !esAdmin()) return null;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${isActive ? "text-green-700" : "text-gray-400"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

    </div>
  );
}