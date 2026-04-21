import { apiRequest } from "./client";
import type { Fruta, FrutaDTO } from "../types";

export const frutasApi = {
  getAll: () => apiRequest<Fruta[]>("/frutas"),

  getById: (id: number) => apiRequest<Fruta>(`/frutas/${id}`),

  crear: (dto: FrutaDTO) =>
    apiRequest<Fruta>("/frutas", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  actualizar: (id: number, dto: Partial<FrutaDTO>) =>
    apiRequest<void>(`/frutas/${id}`, {
      method: "PUT",
      body: JSON.stringify({ id, ...dto }),
    }),
};