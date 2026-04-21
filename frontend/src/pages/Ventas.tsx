import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ventasApi } from "../api/ventas";
import { frutasApi } from "../api/frutas";
import type { Fruta, VentaDTO } from "../types";

export default function Ventas() {
  const queryClient = useQueryClient();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [venta, setVenta] = useState<VentaDTO>({
    frutaId: 0,
    cantidadKg: 0,
    precioPorKg: 0,
    tipoVenta: "minorista",
  });

  const { data: ventasHoy, isLoading } = useQuery({
    queryKey: ["ventas", "hoy"],
    queryFn: ventasApi.getHoy,
  });

  const { data: frutas } = useQuery({
    queryKey: ["frutas"],
    queryFn: frutasApi.getAll,
  });

  const frutasActivas = frutas?.filter((f: Fruta) => f.enTemporada) ?? [];

  const mutacion = useMutation({
    mutationFn: ventasApi.crear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas", "hoy"] });
      queryClient.invalidateQueries({ queryKey: ["frutas"] });
      setMostrarForm(false);
      setVenta({ frutaId: 0, cantidadKg: 0, precioPorKg: 0, tipoVenta: "minorista" });
    },
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
        <div>
          <h2 className="text-2xl font-bold text-green-950">Ventas del día</h2>
          <p className="text-green-700 font-bold text-lg mt-1">
            ${ventasHoy?.total?.toLocaleString("es-AR") ?? 0}
          </p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
        >
          + Venta
        </button>
      </div>

      {/* Formulario */}
      {mostrarForm && (
        <div className="bg-green-950 rounded-2xl p-5 mb-6">
          <h3 className="text-white font-bold mb-4">Registrar venta</h3>

          <div className="space-y-3">
            <select
              value={venta.frutaId}
              onChange={(e) => setVenta({ ...venta, frutaId: Number(e.target.value) })}
              className="w-full bg-green-900 text-white rounded-xl px-3 py-2 text-sm"
            >
              <option value={0}>Seleccioná una fruta</option>
              {frutasActivas.map((f: Fruta) => (
                <option key={f.id} value={f.id}>
                  {f.nombre} — {f.stockKg} kg disponibles
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Cantidad (kg)"
                value={venta.cantidadKg || ""}
                onChange={(e) => setVenta({ ...venta, cantidadKg: Number(e.target.value) })}
                className="bg-green-900 text-white rounded-xl px-3 py-2 text-sm placeholder-green-500"
              />
              <input
                type="number"
                placeholder="Precio por kg"
                value={venta.precioPorKg || ""}
                onChange={(e) => setVenta({ ...venta, precioPorKg: Number(e.target.value) })}
                className="bg-green-900 text-white rounded-xl px-3 py-2 text-sm placeholder-green-500"
              />
            </div>

            {/* Tipo de venta */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setVenta({ ...venta, tipoVenta: "mayorista" })}
                className={`py-2 rounded-xl text-sm font-bold transition-colors ${venta.tipoVenta === "mayorista"
                  ? "bg-green-500 text-white"
                  : "bg-green-900 text-green-300"
                  }`}
              >
                Mayorista
              </button>
              <button
                onClick={() => setVenta({ ...venta, tipoVenta: "minorista" })}
                className={`py-2 rounded-xl text-sm font-bold transition-colors ${venta.tipoVenta === "minorista"
                  ? "bg-green-500 text-white"
                  : "bg-green-900 text-green-300"
                  }`}
              >
                Minorista
              </button>
            </div>

            {venta.cantidadKg > 0 && venta.precioPorKg > 0 && (
              <div className="bg-green-900 rounded-xl px-4 py-3 text-center">
                <p className="text-green-400 text-xs">Total de la venta</p>
                <p className="text-white font-extrabold text-xl">
                  ${(venta.cantidadKg * venta.precioPorKg).toLocaleString("es-AR")}
                </p>
              </div>
            )}

            {mutacion.isError && (
              <p className="text-red-400 text-xs">
                {(mutacion.error as Error).message}
              </p>
            )}

            <button
              onClick={() => mutacion.mutate(venta)}
              disabled={mutacion.isPending || !venta.frutaId || !venta.cantidadKg || !venta.precioPorKg}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-800 text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              {mutacion.isPending ? "Guardando..." : "Confirmar venta"}
            </button>
          </div>
        </div>
      )}

      {/* Lista de ventas */}
      <div className="space-y-2">
        {ventasHoy?.ventas?.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">
            No hay ventas registradas hoy.
          </p>
        )}
        {ventasHoy?.ventas?.map((v: any) => (
          <div key={v.id} className="bg-white rounded-xl px-4 py-3 shadow-sm flex justify-between items-center">
            <div>
              <p className="font-semibold text-sm text-green-950">{v.fruta?.nombre}</p>
              <p className="text-xs text-gray-400">
                {v.cantidadKg} kg ·{" "}
                <span className={`font-semibold ${v.tipoVenta === "mayorista" ? "text-green-600" : "text-gray-500"
                  }`}>
                  {v.tipoVenta}
                </span>{" "}
                · {new Date(v.fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <p className="font-bold text-green-800 text-sm">
              ${(v.cantidadKg * v.precioPorKg).toLocaleString("es-AR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}