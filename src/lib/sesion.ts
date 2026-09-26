import type { Rol, SesionPortal, UsuarioSesion } from "@/lib/tipos/sesion";
import { ROLES_DEL_PORTAL } from "@/lib/tipos/sesion";

/**
 * Cookie de sesión: nombre, lectura y escritura del valor.
 *
 * Este archivo es **puro** (no importa `next/headers`) por un motivo concreto:
 * el middleware corre en el Edge y necesita leer la cookie, pero ahí `cookies()`
 * no existe. La parte que sí usa `cookies()` vive en `sesion-servidor.ts`.
 *
 * La cookie es `httpOnly`: el token nunca es accesible desde el navegador. Es la
 * razón por la que el portal resuelve las lecturas en el servidor.
 */

export const NOMBRE_COOKIE = "deuna_sesion";

/** Duración de la cookie. El token del backend dura 8 horas; se alinea. */
export const DURACION_COOKIE = 60 * 60 * 8;

/** Lee y valida el valor crudo de la cookie. Devuelve `null` si no sirve. */
export function leerSesion(valor: string | undefined): SesionPortal | null {
  if (!valor) {
    return null;
  }

  try {
    const sesion = JSON.parse(valor) as SesionPortal;

    if (!sesion.accessToken || !sesion.expiraEn || !sesion.usuario?.email) {
      return null;
    }

    return sesion;
  } catch {
    // Una cookie corrupta o de una versión anterior se trata como "sin sesión":
    // el usuario vuelve al login en lugar de ver un error raro.
    return null;
  }
}

/** Serializa la sesión para guardarla en la cookie. */
export function serializarSesion(sesion: SesionPortal): string {
  return JSON.stringify(sesion);
}

/** ¿El token ya venció? El middleware lo usa para no dejar pasar sesiones muertas. */
export function sesionVencida(sesion: SesionPortal): boolean {
  return new Date(sesion.expiraEn).getTime() <= Date.now();
}

/** ¿El rol puede entrar al portal? */
export function rolHabilitado(rol: Rol): boolean {
  return ROLES_DEL_PORTAL.includes(rol);
}

/** Nombre para mostrar a partir de lo que devuelve el backend. */
export function nombreDeUsuario(datos: {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}): string {
  const nombre = [datos.firstName, datos.lastName].filter(Boolean).join(" ").trim();
  return nombre || datos.email;
}

/** Iniciales para el avatar. "Carlos Rodríguez" → "CR". */
export function inicialesDe(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

/** Etiqueta legible del rol. El backend manda el literal en mayúsculas. */
export function etiquetaDeRol(rol: string): string {
  return ROLES_LEGIBLES[rol] ?? rol;
}

const ROLES_LEGIBLES: Record<string, string> = {
  ADMIN: "Administrador",
  RESTAURANT: "Restaurante",
  RIDER: "Domiciliario",
  CUSTOMER: "Cliente",
};

/** Sesión a partir de la respuesta del login. */
export function sesionDesdeLogin(datos: {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  email: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
}): SesionPortal {
  const usuario: UsuarioSesion = {
    id: datos.userId,
    email: datos.email,
    rol: datos.role as Rol,
    nombre: nombreDeUsuario(datos),
  };

  return {
    accessToken: datos.accessToken,
    refreshToken: datos.refreshToken,
    expiraEn: datos.expiresAt,
    usuario,
  };
}
