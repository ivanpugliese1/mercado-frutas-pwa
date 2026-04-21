import { apiRequest } from "./client";
import type { Proveedor, IngresoStockDTO, PagoProveedorDTO } from "../types";

export const proveedoresApi = {
  getAll: () => apiRequest<Proveedor[]>("/proveedores"),

  getById: (id: number) => apiRequest<Proveedor>(`/proveedores/${id}`),

  crear: (proveedor: { nombre: string; telefono: string }) =>
    apiRequest<Proveedor>("/proveedores", {
      method: "POST",
      body: JSON.stringify(proveedor),
    }),
};

export const ingresosApi = {
  crear: (dto: IngresoStockDTO) =>
    apiRequest<void>("/ingresosstock", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
};

export const pagosApi = {
  crear: (dto: PagoProveedorDTO) =>
    apiRequest<void>("/pagosproveedores", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  getByProveedor: (proveedorId: number) =>
    apiRequest<{
      proveedor: string;
      totalIngresos: number;
      totalPagos: number;
      saldoPendiente: number;
      pagos: any[];
    }>(`/pagosproveedores/proveedor/${proveedorId}`),
};