import "server-only";

import { cookies } from "next/headers";

import {
  DURACION_COOKIE,
  NOMBRE_COOKIE,
  leerSesion,
  serializarSesion,
  sesionVencida,
} from "@/lib/sesion";
import type { SesionPortal } from "@/lib/tipos/sesion";

/**
 * Acceso a la sesión desde el servidor.
 *
 * Usa `cookies()` de Next, que solo existe en el render del servidor y en las
 * Server Actions — por eso el middleware no usa este archivo, usa la parte pura
 * de `lib/sesion.ts`.
 *
 * Escribir la cookie solo se puede desde una Server Action o un Route Handler;
 * Next lo bloquea durante el render. Es el motivo por el que el refresco de
 * token queda como pendiente y no como algo a medio hacer acá.
 */

/** Sesión vigente, o `null` si no hay o si el token venció. */
export async function obtenerSesion(): Promise<SesionPortal | null> {
  const almacen = await cookies();
  const sesion = leerSesion(almacen.get(NOMBRE_COOKIE)?.value);

  if (!sesion || sesionVencida(sesion)) {
    return null;
  }

  return sesion;
}

/** Token de acceso para llamar a la API. */
export async function obtenerToken(): Promise<string | null> {
  return (await obtenerSesion())?.accessToken ?? null;
}

/** Guarda la sesión. Solo desde una Server Action. */
export async function guardarSesion(sesion: SesionPortal): Promise<void> {
  const almacen = await cookies();

  almacen.set(NOMBRE_COOKIE, serializarSesion(sesion), {
    httpOnly: true,
    // En producción el portal va por HTTPS; en desarrollo local no hay TLS.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACION_COOKIE,
  });
}

/** Borra la sesión. Solo desde una Server Action. */
export async function borrarSesion(): Promise<void> {
  const almacen = await cookies();
  almacen.delete(NOMBRE_COOKIE);
}
