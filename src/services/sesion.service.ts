import "server-only";

import { pedir } from "@/services/http";

/**
 * Sesión — espejo del servicio Identity del backend.
 *
 * El login del portal todavía no está construido (ver Fase 3 del plan). Cuando
 * se construya, el token se guarda en una cookie `httpOnly` y estas funciones
 * son las únicas que lo manejan.
 */
export const sesionService = {
  /** Inicia sesión y devuelve el token. Endpoint real de Identity. */
  async iniciarSesion(email: string, password: string): Promise<{ accessToken: string }> {
    return pedir<{ accessToken: string }>("/api/v1/identity/login", {
      method: "POST",
      body: { email, password },
    });
  },

  /** Renueva el token antes de que venza. */
  async refrescar(refreshToken: string): Promise<{ accessToken: string }> {
    return pedir<{ accessToken: string }>("/api/v1/identity/refresh", {
      method: "POST",
      body: { refreshToken },
    });
  },
};
