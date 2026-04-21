import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { proveedoresApi, pagosApi } from "../api/proveedores";
import type { PagoProveedorDTO } from "../types";

export default function Proveedores() {
  const queryClient = useQueryClient();
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<number | null>(null);
  const [pago, setPago] = useState<PagoProveedorDTO>({
    proveedorId: 0,
    monto: 0,
    metodoPago: "efectivo",
  });

  const { data: proveedores, isLoading } = useQuery({
    queryKey: ["proveedores"],
    queryFn: proveedoresApi.getAll,
  });

  const { data: detalle } = useQuery({
    queryKey: ["pagos", proveedorSeleccionado],
    queryFn: () => pagosApi.getByProveedor(proveedorSeleccionado!),
    enabled: proveedorSeleccionado !== null,
  });

  const mutacionPago = useMutation({
    mutationFn: pagosApi.crear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
      queryClient.invalidateQueries({ queryKey: ["pagos", proveedorSeleccionado] });
      setPago({ proveedorId: 0, monto: 0, metodoPago: "efectivo" });
    },
  });

  const mutacionProveedor = useMutation({
    mutationFn: proveedoresApi.crear,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proveedores"] }),
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
        <h2 className="text-2xl font-bold text-green-950">Proveedores</h2>
      </div>

      {/* Lista de proveedores */}
      {!proveedorSeleccionado && (
        <div className="space-y-3">
          {proveedores?.map((p: any) => (
            <div
              key={p.id}
              onClick={() => setProveedorSeleccionado(p.id)}
              className={`bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${p.saldoPendiente > 0 ? "border-l-4 border-orange-400" : "border-l-4 border-green-400"
                }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-green-950">{p.nombre}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.telefono}</p>
                </div>
                <div className="text-right">
                  <p className={`font-extrabold text-lg ${p.saldoPendiente > 0 ? "text-orange-600" : "text-green-600"
                    }`}>
                    {p.saldoPendiente > 0
                      ? `-$${p.saldoPendiente.toLocaleString("es-AR")}`
                      : "✓ Al día"}
                  </p>
                  {p.saldoPendiente > 0 && (
                    <p className="text-xs text-gray-400">pendiente</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Nuevo proveedor */}
          <NuevoProveedor onCrear={(nombre, telefono) =>
            mutacionProveedor.mutate({ nombre, telefono })
          } />
        </div>
      )}

      {/* Detalle de proveedor */}
      {proveedorSeleccionado && detalle && (
        <div>
          <button
            onClick={() => setProveedorSeleccionado(null)}
            className="text-green-700 text-sm font-semibold mb-4 flex items-center gap-1"
          >
            ← Volver
          </button>

          <h3 className="text-xl font-bold text-green-950 mb-1">{detalle.proveedor}</h3>

          {/* Resumen financiero */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Comprado</p>
              <p className="font-bold text-green-950 text-sm">
                ${detalle.totalIngresos.toLocaleString("es-AR")}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Pagado</p>
              <p className="font-bold text-green-700 text-sm">
                ${detalle.totalPagos.toLocaleString("es-AR")}
              </p>
            </div>
            <div className={`rounded-xl p-3 text-center ${detalle.saldoPendiente > 0 ? "bg-orange-50" : "bg-green-50"
              }`}>
              <p className="text-xs text-gray-400">Pendiente</p>
              <p className={`font-bold text-sm ${detalle.saldoPendiente > 0 ? "text-orange-600" : "text-green-600"
                }`}>
                ${detalle.saldoPendiente.toLocaleString("es-AR")}
              </p>
            </div>
          </div>

          {/* Formulario de pago */}
          {detalle.saldoPendiente > 0 && (
            <div className="bg-green-950 rounded-2xl p-5 mb-6">
              <h4 className="text-white font-bold mb-4">Registrar pago</h4>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Monto a pagar"
                  value={pago.monto || ""}
                  onChange={(e) => setPago({ ...pago, monto: Number(e.target.value), proveedorId: proveedorSeleccionado })}
                  className="w-full bg-green-900 text-white rounded-xl px-3 py-2 text-sm placeholder-green-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPago({ ...pago, metodoPago: "efectivo" })}
                    className={`py-2 rounded-xl text-sm font-bold transition-colors ${pago.metodoPago === "efectivo"
                      ? "bg-green-500 text-white"
                      : "bg-green-900 text-green-300"
                      }`}
                  >
                    Efectivo
                  </button>
                  <button
                    onClick={() => setPago({ ...pago, metodoPago: "transferencia" })}
                    className={`py-2 rounded-xl text-sm font-bold transition-colors ${pago.metodoPago === "transferencia"
                      ? "bg-green-500 text-white"
                      : "bg-green-900 text-green-300"
                      }`}
                  >
                    Transferencia
                  </button>
                </div>

                {mutacionPago.isError && (
                  <p className="text-red-400 text-xs">
                    {(mutacionPago.error as Error).message}
                  </p>
                )}

                <button
                  onClick={() => mutacionPago.mutate({ ...pago, proveedorId: proveedorSeleccionado })}
                  disabled={mutacionPago.isPending || !pago.monto}
                  className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-800 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  {mutacionPago.isPending ? "Guardando..." : "Confirmar pago"}
                </button>
              </div>
            </div>
          )}

          {/* Historial de pagos */}
          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Historial de pagos</h4>
          {detalle.pagos?.length === 0 && (
            <p className="text-gray-400 text-sm">No hay pagos registrados.</p>
          )}
          {detalle.pagos?.map((p: any, i: number) => (
            <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm mb-2 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-green-950">{p.metodoPago}</p>
                <p className="text-xs text-gray-400">
                  {new Date(p.fecha).toLocaleDateString("es-AR")}
                </p>
              </div>
              <p className="font-bold text-green-700">
                ${p.monto.toLocaleString("es-AR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para crear nuevo proveedor
function NuevoProveedor({ onCrear }: { onCrear: (nombre: string, telefono: string) => void }) {
  const [mostrar, setMostrar] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  function handleCrear() {
    if (!nombre) return;
    onCrear(nombre, telefono);
    setNombre("");
    setTelefono("");
    setMostrar(false);
  }

  if (!mostrar) {
    return (
      <button
        onClick={() => setMostrar(true)}
        className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-4 text-gray-400 text-sm font-semibold hover:border-green-300 hover:text-green-600 transition-colors"
      >
        + Agregar proveedor
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-green-200">
      <h4 className="font-bold text-green-950 mb-3">Nuevo proveedor</h4>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          placeholder="Teléfono (opcional)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMostrar(false)}
            className="py-2 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCrear}
            disabled={!nombre}
            className="py-2 rounded-xl text-sm font-bold bg-green-700 text-white hover:bg-green-800 disabled:bg-gray-200 transition-colors"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}