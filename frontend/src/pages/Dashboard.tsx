import { useQuery } from "@tanstack/react-query";
import { ventasApi } from "../api/ventas";
import { frutasApi } from "../api/frutas";
import { proveedoresApi } from "../api/proveedores";
import { useAuthStore } from "../store/authStore";
import type { Fruta, Proveedor } from "../types";

export default function Dashboard() {
  const esAdmin = useAuthStore((s) => s.esAdmin);

  const { data: ventasHoy, isLoading: loadingVentas } = useQuery({
    queryKey: ["ventas", "hoy"],
    queryFn: ventasApi.getHoy,
  });

  const { data: frutas, isLoading: loadingFrutas } = useQuery({
    queryKey: ["frutas"],
    queryFn: frutasApi.getAll,
  });

  const { data: proveedores } = useQuery({
    queryKey: ["proveedores"],
    queryFn: proveedoresApi.getAll,
    enabled: esAdmin(),
  });

  const frutasEnTemporada = frutas?.filter((f: Fruta) => f.enTemporada) ?? [];
  const frutasStockBajo = frutasEnTemporada.filter((f: Fruta) => f.stockKg < 50);
  const proveedoresConDeuda = proveedores?.filter((p: Proveedor) => p.saldoPendiente > 0) ?? [];
  const totalDeuda = proveedoresConDeuda.reduce((acc: number, p: Proveedor) => acc + p.saldoPendiente, 0);

  if (loadingVentas || loadingFrutas) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-950">Buenos días 🌿</h2>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString("es-AR", {
            weekday: "long", day: "numeric", month: "long"
          })}
        </p>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-green-950 rounded-2xl p-4 text-white">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-wider">Ventas hoy</p>
          <p className="text-3xl font-extrabold mt-1">
            ${ventasHoy?.total?.toLocaleString("es-AR") ?? 0}
          </p>
          <p className="text-green-300 text-xs mt-1">
            {ventasHoy?.ventas?.length ?? 0} operaciones
          </p>
        </div>

        <div className="bg-green-100 rounded-2xl p-4">
          <p className="text-green-700 text-xs font-semibold uppercase tracking-wider">Stock activo</p>
          <p className="text-3xl font-extrabold mt-1 text-green-950">
            {frutasEnTemporada.reduce((acc: number, f: Fruta) => acc + f.stockKg, 0).toFixed(0)} kg
          </p>
          <p className="text-green-600 text-xs mt-1">
            {frutasEnTemporada.length} frutas en temporada
          </p>
        </div>

        {esAdmin() && (
          <div className="col-span-2 bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <p className="text-orange-600 text-xs font-semibold uppercase tracking-wider">Deuda proveedores</p>
            <p className="text-3xl font-extrabold mt-1 text-orange-700">
              ${totalDeuda.toLocaleString("es-AR")}
            </p>
            <p className="text-orange-500 text-xs mt-1">
              {proveedoresConDeuda.length} proveedores con saldo pendiente
            </p>
          </div>
        )}
      </div>

      {/* Alertas stock bajo */}
      {frutasStockBajo.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">⚠️ Stock bajo</h3>
          {frutasStockBajo.map((f: Fruta) => (
            <div key={f.id} className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-2 flex justify-between items-center">
              <p className="font-semibold text-yellow-800 text-sm">{f.nombre}</p>
              <p className="text-yellow-600 text-sm font-bold">{f.stockKg} kg</p>
            </div>
          ))}
        </div>
      )}

      {/* Últimas ventas */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Últimas ventas</h3>
        {ventasHoy?.ventas?.length === 0 && (
          <p className="text-gray-400 text-sm">No hay ventas registradas hoy.</p>
        )}
        {ventasHoy?.ventas?.slice(0, 5).map((v: any) => (
          <div key={v.id} className="bg-white rounded-xl px-4 py-3 mb-2 flex justify-between items-center shadow-sm">
            <div>
              <p className="font-semibold text-sm text-green-950">{v.fruta?.nombre}</p>
              <p className="text-xs text-gray-400">
                {v.cantidadKg} kg · {v.tipoVenta}
              </p>
            </div>
            <p className="font-bold text-green-800">
              ${(v.cantidadKg * v.precioPorKg).toLocaleString("es-AR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}