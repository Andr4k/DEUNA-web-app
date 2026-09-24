import "server-only";

import { pedir } from "@/services/http";

/**
 * Sesión — espejo del servicio Identity del backend.
 *
 * Contrato real verificado contra el código de Identity: el login responde
 * **envuelto** en `{ success, message, data }`, no plano. Los tokens vienen
 * dentro de `data`. Cuando falla devuelve `401` sin cuerpo (credenciales
 * inválidas) o `403` (cuenta desactivada).
 */

/** Envoltorio que Identity usa en todas sus respuestas de autenticación. */
interface RespuestaAuth<T> {
  success: boolean;
  message: string;
  data: T | null;
}

/** Lo que devuelve `data` en un login exitoso. */
export interface DatosLogin {
  accessToken: string;
  refreshToken: string;
  /** ISO 8601. El token dura 8 horas. */
  expiresAt: string;
  userId: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
}

export const sesionService = {
  /**
   * Inicia sesión. Lanza si las credenciales no sirven.
   *
   * No devuelve un booleano: quien llama necesita distinguir "credenciales mal"
   * de "cuenta desactivada" de "el gateway no responde", y eso viaja en el
   * estado del error, no en un `false`.
   */
  async iniciarSesion(email: string, password: string): Promise<DatosLogin> {
    const respuesta = await pedir<RespuestaAuth<DatosLogin>>("/api/v1/identity/login", {
      method: "POST",
      body: { email, password, rememberMe: false },
    });

    if (!respuesta.success || !respuesta.data) {
      // Identity devolvió 200 pero sin tokens: se trata como fallo, no se sigue.
      throw new Error(respuesta.message || "El inicio de sesión no devolvió una sesión");
    }

    return respuesta.data;
  },

  /** Revoca el refresh token en el backend. */
  async cerrarSesion(refreshToken: string): Promise<void> {
    await pedir<void>("/api/v1/identity/logout", {
      method: "POST",
      body: { refreshToken },
    });
  },

  /**
   * Renueva el token de acceso.
   *
   * Todavía no se usa: escribir la cookie de sesión solo se puede desde una
   * Server Action o un Route Handler, y Next lo bloquea durante el render. El
   * refresco automático necesita una de esas dos puertas; queda anotado como
   * pendiente en lugar de quedar a medio hacer.
   */
  async refrescar(refreshToken: string): Promise<RespuestaAuth<DatosLogin>> {
    return pedir<RespuestaAuth<DatosLogin>>("/api/v1/identity/refresh", {
      method: "POST",
      body: { refreshToken },
    });
  },
};
