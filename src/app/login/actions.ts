"use server";

import { redirect } from "next/navigation";

import { ErrorApi } from "@/services/http";
import { sesionService } from "@/services/sesion.service";
import { borrarSesion, guardarSesion, obtenerSesion } from "@/lib/sesion-servidor";
import { rolHabilitado, sesionDesdeLogin } from "@/lib/sesion";
import type { Rol } from "@/lib/tipos/sesion";

/**
 * Acciones de sesión.
 *
 * Son Server Actions: corren en el servidor, así que la contraseña viaja del
 * formulario al servidor de Next y de ahí al gateway — nunca se guarda en el
 * navegador. Es también el único lugar donde se puede escribir la cookie.
 */

export interface EstadoLogin {
  error?: string;
}

export async function iniciarSesion(
  _estadoPrevio: EstadoLogin,
  formulario: FormData,
): Promise<EstadoLogin> {
  const email = String(formulario.get("email") ?? "").trim();
  const password = String(formulario.get("password") ?? "");
  const destino = rutaSegura(String(formulario.get("destino") ?? "/"));

  if (!email || !password) {
    return { error: "Escribí tu correo y tu contraseña." };
  }

  let datos;
  try {
    datos = await sesionService.iniciarSesion(email, password);
  } catch (error) {
    return { error: mensajeDeError(error) };
  }

  if (!rolHabilitado(datos.role as Rol)) {
    // El domiciliario y el cliente tienen su propia app. Credenciales válidas no
    // alcanzan: el portal es del administrador y del restaurante.
    return { error: "Esta cuenta no tiene acceso al portal administrativo." };
  }

  await guardarSesion(sesionDesdeLogin(datos));

  // `redirect` corta la ejecución lanzando: tiene que quedar fuera del try/catch,
  // si no el catch se traga la redirección y el login "no hace nada".
  redirect(destino);
}

export async function cerrarSesion(): Promise<void> {
  const sesion = await obtenerSesion();

  if (sesion) {
    try {
      // Se revoca el refresh token en el backend. Si falla, igual se borra la
      // cookie: dejar la sesión abierta acá porque el backend no respondió sería
      // peor que un token huérfano que vence solo en 7 días.
      await sesionService.cerrarSesion(sesion.refreshToken);
    } catch {
      // Sin acción: el cierre local es lo que importa.
    }
  }

  await borrarSesion();
  redirect("/login");
}

/** Traduce el error de la API a algo que el usuario pueda leer. */
function mensajeDeError(error: unknown): string {
  if (error instanceof ErrorApi) {
    if (error.estado === 401) {
      return "El correo o la contraseña no son correctos.";
    }
    if (error.estado === 403) {
      return "La cuenta está desactivada.";
    }
    if (error.estado === 429) {
      return "Demasiados intentos seguidos. Esperá un minuto y volvé a probar.";
    }
  }

  return "No se pudo conectar con el servidor. Revisá que el backend esté levantado.";
}

/**
 * Solo se acepta una ruta interna.
 *
 * Sin esto, `?destino=https://otro-sitio` convertiría el login en un trampolín
 * para redirigir a un sitio ajeno después de iniciar sesión.
 */
function rutaSegura(destino: string): string {
  return destino.startsWith("/") && !destino.startsWith("//") ? destino : "/";
}
