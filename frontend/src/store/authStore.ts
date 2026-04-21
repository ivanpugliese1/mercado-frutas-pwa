import { create } from 'zustand';
import { persist } from "zustand/middleware";
import type { Usuario } from "../types/index.ts";

interface AuthState {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario) => void;
  cerrarSesion: () => void;
  estaAutenticado: () => boolean;
  esAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,

      setUsuario: (usuario) => set({ usuario }),

      cerrarSesion: () => set({ usuario: null }),

      estaAutenticado: () => get().usuario !== null,

      esAdmin: () => get().usuario?.rol === "admin",
    }),
    {
      name: "auth-storage",
    }
  )
);