import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { frutasApi } from "../api/frutas";
import { proveedoresApi, ingresosApi } from "../api/proveedores";
import { useAuthStore } from "../store/authStore";
import type { Fruta, IngresoStockDTO } from "../types";

export default function Stock() {
  const esAdmin = useAuthStore((s) => s.esAdmin);
  const queryClient = useQueryClient();
  const [mostrarFormIngreso, setMostrarFormIngreso] = useState(false);
  const [ingreso, setIngreso] = useState<IngresoStockDTO>({
    frutaId: 0,
    proveedorId: 0,
    cantidadKg: 0,
    precioPorKg: 0,
    notas: "",
  });

  const { data: frutas, isLoading } = useQuery({
    queryKey: ["frutas"],
    queryFn: frutasApi.getAll,
  });

  const { data: proveedores } = useQuery({
    queryKey: ["proveedores"],
    queryFn: proveedoresApi.getAll,
    enabled: esAdmin(),
  });

  const mutacionIngreso = useMutation({
    mutationFn: ingresosApi.crear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["frutas"] });
      setMostrarFormIngreso(false);
      setIngreso({ frutaId: 0, proveedorId: 0, cantidadKg: 0, precioPorKg: 0 });
    },
  });

  const mutacionTemporada = useMutation({
    mutationFn: ({ id, fruta }: { id: number; fruta: Fruta }) =>
      frutasApi.actualizar(id, { ...fruta, enTemporada: !fruta.enTemporada }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["frutas"] }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-950">Stock</h2>
        {esAdmin() && (
          <button
            onClick={() => setMostrarFormIngreso(!mostrarFormIngreso)}
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            + Ingreso
          </button>
        )}
      </div>

      {/* Formulario de ingreso */}
      {mostrarFormIngreso && esAdmin() && (
        <div className="bg-green-950 rounded-2xl p-5 mb-6">
          <h3 className="text-white font-bold mb-4">Registrar ingreso de mercadería</h3>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <select
              value={ingreso.frutaId}
              onChange={(e) => setIngreso({ ...ingreso, frutaId: Number(e.target.value) })}
              className="col-span-2 bg-green-900 text-white rounded-xl px-3 py-2 text-sm"
            >
              <option value={0}>Seleccioná una fruta</option>
              {frutas?.map((f: Fruta) => (
                <option key={f.id} value={f.id}>{f.nombre}</option>
              ))}
            </select>

            <select
              value={ingreso.proveedorId}
              onChange={(e) => setIngreso({ ...ingreso, proveedorId: Number(e.target.value) })}
              className="col-span-2 bg-green-900 text-white rounded-xl px-3 py-2 text-sm"
            >
              <option value={0}>Seleccioná un proveedor</option>
              {proveedores?.map((p: any) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Cantidad (kg)"
              value={ingreso.cantidadKg || ""}
              onChange={(e) => setIngreso({ ...ingreso, cantidadKg: Number(e.target.value) })}
              className="bg-green-900 text-white rounded-xl px-3 py-2 text-sm placeholder-green-500"
            />

            <input
              type="number"
              placeholder="Precio por kg"
              value={ingreso.precioPorKg || ""}
              onChange={(e) => setIngreso({ ...ingreso, precioPorKg: Number(e.target.value) })}
              className="bg-green-900 text-white rounded-xl px-3 py-2 text-sm placeholder-green-500"
            />

            <input
              type="text"
              placeholder="Notas (opcional)"
              value={ingreso.notas || ""}
              onChange={(e) => setIngreso({ ...ingreso, notas: e.target.value })}
              className="col-span-2 bg-green-900 text-white rounded-xl px-3 py-2 text-sm placeholder-green-500"
            />
          </div>

          {mutacionIngreso.isError && (
            <p className="text-red-400 text-xs mb-3">
              {(mutacionIngreso.error as Error).message}
            </p>
          )}

          <button
            onClick={() => mutacionIngreso.mutate(ingreso)}
            disabled={mutacionIngreso.isPending || !ingreso.frutaId || !ingreso.proveedorId}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-800 text-white font-bold py-3 rounded-xl transition-colors text-sm"
          >
            {mutacionIngreso.isPending ? "Guardando..." : "Confirmar ingreso"}
          </button>
        </div>
      )}

      {/* Lista de frutas */}
      <div className="space-y-3">
        {frutas?.map((fruta: Fruta) => (
          <div
            key={fruta.id}
            className={`bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center ${!fruta.enTemporada ? "opacity-50" : ""
              } ${fruta.enTemporada && fruta.stockKg < 50 ? "border-2 border-yellow-300" : ""}`}
          >
            <div>
              <p className="font-bold text-green-950">{fruta.nombre}</p>
              <div className="flex gap-2 mt-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${fruta.enTemporada
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
                  }`}>
                  {fruta.enTemporada ? "En temporada" : "Fuera de temporada"}
                </span>
                {fruta.enTemporada && fruta.stockKg < 50 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                    Stock bajo
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className={`text-2xl font-extrabold ${fruta.enTemporada && fruta.stockKg < 50 ? "text-yellow-600" : "text-green-950"
                  }`}>
                  {fruta.stockKg}
                </p>
                <p className="text-xs text-gray-400">kg</p>
              </div>

              {esAdmin() && (
                <button
                  onClick={() => mutacionTemporada.mutate({ id: fruta.id, fruta })}
                  className="text-xs text-gray-400 hover:text-green-700 font-semibold transition-colors"
                >
                  {fruta.enTemporada ? "Desactivar" : "Activar"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}