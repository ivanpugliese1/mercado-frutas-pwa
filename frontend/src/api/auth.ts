import { apiRequest } from "./client";
import type { AuthDTO, Usuario } from "../types";

export const authApi = {
  login: (dto: AuthDTO) =>
    apiRequest<Usuario>("/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  registro: (dto: AuthDTO) =>
    apiRequest<string>("/auth/registro", {
      method: "POST",
      body: JSON.stringify(dto),
    }),
};