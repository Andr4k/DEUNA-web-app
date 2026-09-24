import "server-only";

import { cookies, headers } from "next/headers";

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
    secure: await laConexionEsHttps(),
    sameSite: "lax",
    path: "/",
    maxAge: DURACION_COOKIE,
  });
}

/**
 * ¿La cookie debe viajar solo por HTTPS?
 *
 * Antes esto era `process.env.NODE_ENV === "production"`, y estaba mal: `npm run
 * start` sobre `http://` es una compilación de producción **sin TLS**. Una cookie
 * `Secure` enviada por HTTP el navegador la descarta sin avisar —salvo si el host
 * es exactamente `localhost`, que es la única razón por la que en la máquina de
 * desarrollo parecía funcionar—. Consecuencia: entrabas al portal y en la
 * siguiente navegación ya no había sesión, como si el token se hubiera borrado.
 *
 * Lo que decide no es cómo se compiló el portal, sino cómo llegó la petición. El
 * proxy de producción termina el TLS y lo declara en `x-forwarded-proto`; en
 * desarrollo, sin esa cabecera, es HTTP y la cookie no lleva `Secure`. Si el
 * despliegue no pone la cabecera, `COOKIE_SEGURA=true` lo fuerza.
 */
async function laConexionEsHttps(): Promise<boolean> {
  if (process.env.COOKIE_SEGURA === "true") {
    return true;
  }

  const cabeceras = await headers();
  const protocolo = cabeceras.get("x-forwarded-proto")?.split(",")[0]?.trim();
  return protocolo === "https";
}

/** Borra la sesión. Solo desde una Server Action. */
export async function borrarSesion(): Promise<void> {
  const almacen = await cookies();
  almacen.delete(NOMBRE_COOKIE);
}
