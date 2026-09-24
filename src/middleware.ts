import { NextResponse, type NextRequest } from "next/server";

import { NOMBRE_COOKIE, leerSesion, rolHabilitado, sesionVencida } from "@/lib/sesion";

/**
 * Guarda del portal.
 *
 * Toda la aplicación queda detrás del login: sin cookie de sesión válida no se
 * llega a ninguna pantalla. El middleware corre **antes** de resolver la ruta,
 * así que una página protegida no se renderiza ni un instante — no hay contenido
 * que se filtre antes de redirigir.
 *
 * Qué verifica y qué no:
 *
 * - **Verifica**: que la cookie exista, que tenga forma de sesión, que el token
 *   no esté vencido y que el rol pueda entrar al portal.
 * - **No verifica la firma del token.** Eso lo hace el backend en cada llamada:
 *   el portal no tiene la clave de firma de Identity, y no debería tenerla. Un
 *   token manipulado pasa el middleware y muere en la API con 401. La guarda de
 *   acá es de navegación, la de allá es de seguridad.
 *
 * Lee la cookie con la parte pura de `lib/sesion.ts` porque en el Edge no
 * existen `cookies()` de Next.
 */

/** Rutas alcanzables sin sesión. */
const PUBLICAS = ["/login"];

export function middleware(peticion: NextRequest) {
  const { pathname } = peticion.nextUrl;
  const esPublica = PUBLICAS.some((ruta) => pathname.startsWith(ruta));

  const sesion = leerSesion(peticion.cookies.get(NOMBRE_COOKIE)?.value);
  const vigente = sesion !== null && !sesionVencida(sesion) && rolHabilitado(sesion.usuario.rol);

  if (vigente) {
    // Ya tiene sesión: el login no tiene nada que hacer.
    if (esPublica) {
      return NextResponse.redirect(new URL("/", peticion.url));
    }
    return NextResponse.next();
  }

  if (esPublica) {
    return NextResponse.next();
  }

  // Se recuerda a dónde iba para devolverlo ahí después de entrar. Es la
  // diferencia entre "te logueás y volvés a tu pedido" y "te logueás y buscás
  // de nuevo dónde estabas".
  const destino = pathname + peticion.nextUrl.search;
  const url = new URL("/login", peticion.url);
  if (destino !== "/") {
    url.searchParams.set("destino", destino);
  }

  return NextResponse.redirect(url);
}

export const config = {
  /**
   * Todo, menos los archivos estáticos y el propio favicon: no tiene sentido
   * consultar la sesión para servir un `.css` o una imagen.
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
