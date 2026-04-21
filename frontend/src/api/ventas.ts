import { apiRequest } from "./client";
import type { Venta, VentaDTO } from "../types";

export const ventasApi = {
  getAll: () => apiRequest<Venta[]>("/ventas"),

  getHoy: () =>
    apiRequest<{ ventas: Venta[]; total: number }>("/ventas/hoy"),

  crear: (dto: VentaDTO) =>
    apiRequest<Venta>("/ventas", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
};