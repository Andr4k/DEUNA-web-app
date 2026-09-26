import "server-only";

import type {
  PaginaCalificacionesRestaurantes,
  ResumenCalificacionesRestaurantes,
} from "@/lib/tipos/calificaciones-restaurantes";
import { pedir } from "@/services/http";

/**
 * Calificaciones a restaurantes — espejo del servicio Feedback del backend.
 *
 * Una función por endpoint: la lista paginada y el resumen salen de dos rutas
 * distintas (`/restaurantes` y `/restaurantes/resumen`), así que son dos funciones y
 * no una que devuelva todo junto. Las dos reciben los mismos filtros —el resumen se
 * calcula sobre el mismo conjunto que las filas, si no el número de arriba y la lista
 * de abajo podrían discrepar— y **no se cachean**: el resumen incluye las
 * calificaciones de hoy y una respuesta de hace cinco minutos mostraría un "hoy" que
 * ya no es.
 *
 * Los endpoints todavía no están desplegados —los PRs están abiertos sin mergear—, así
 * que hoy responden 404 y la pantalla muestra ese error tal cual lo dijo el gateway. La
 * pantalla se programa contra el contrato de `lib/tipos/`, no contra una ruta
 * inventada: el día que el gateway los exponga esto funciona sin tocar la UI.
 */

/**
 * Los filtros de la pantalla, tal como los manda el portal.
 *
 * Es la forma de la PETICIÓN y sus nombres son los del query string del endpoint. El
 * contrato de la respuesta está en `lib/tipos/calificaciones-restaurantes.ts`; este
 * tipo vive acá porque describe la consulta, no el dato.
 *
 * La calificación se filtra por rango (`calificacionMin` / `calificacionMax`) y no por
 * un valor exacto: el operador busca "los que están entre 3 y 4", y un rango admite los
 * dos extremos por separado sin obligar a elegir entre ellos.
 */
export interface FiltrosCalificacionesRestaurantes {
  buscar?: string;
  zona?: string;
  tipoDeComida?: string;
  calificacionMin?: number;
  calificacionMax?: number;
  pagina?: number;
  tamano?: number;
}

const RUTA = "/api/v1/admin/feedback/restaurantes";

export const calificacionesRestaurantesService = {
  /** Lista paginada de restaurantes con sus calificaciones ya agregadas. */
  async listado(
    filtros: FiltrosCalificacionesRestaurantes,
    token: string,
  ): Promise<PaginaCalificacionesRestaurantes> {
    return pedir<PaginaCalificacionesRestaurantes>(`${RUTA}${consulta(filtros)}`, { token });
  },

  /**
   * Los KPIs de la cabecera y los bloques de resumen.
   *
   * No manda la paginación: el resumen es del conjunto filtrado entero, y mandarle
   * `pagina`/`tamano` sugeriría que devuelve una página.
   */
  async resumen(
    filtros: FiltrosCalificacionesRestaurantes,
    token: string,
  ): Promise<ResumenCalificacionesRestaurantes> {
    return pedir<ResumenCalificacionesRestaurantes>(`${RUTA}/resumen${consulta(filtros, false)}`, {
      token,
    });
  },
};

/**
 * Query string con los filtros que vengan definidos.
 *
 * Los que no vienen no se mandan, así el backend aplica su valor por defecto en lugar
 * de recibir un `zona=` vacío que podría leerse como "zona vacía". `tipoDeComida`
 * todavía no tiene dato —llega en `null`—, pero el filtro se manda igual cuando el
 * operador lo escribe: el contrato lo acepta y el día que exista la fuente no hay que
 * tocar esto.
 */
function consulta(filtros: FiltrosCalificacionesRestaurantes, conPagina = true): string {
  const params = new URLSearchParams();

  if (filtros.buscar) params.set("buscar", filtros.buscar);
  if (filtros.zona) params.set("zona", filtros.zona);
  if (filtros.tipoDeComida) params.set("tipoDeComida", filtros.tipoDeComida);
  if (filtros.calificacionMin !== undefined) {
    params.set("calificacionMin", String(filtros.calificacionMin));
  }
  if (filtros.calificacionMax !== undefined) {
    params.set("calificacionMax", String(filtros.calificacionMax));
  }

  if (conPagina) {
    if (filtros.pagina !== undefined) params.set("pagina", String(filtros.pagina));
    if (filtros.tamano !== undefined) params.set("tamano", String(filtros.tamano));
  }

  const cadena = params.toString();
  return cadena ? `?${cadena}` : "";
}
