import "server-only";

/**
 * Métricas del portal.
 *
 * **Este servicio todavía no tiene implementación porque el backend no expone
 * ningún agregado.** El panel necesita contar pedidos del día, entregas a
 * tiempo, recaudo por zona y calificación promedio; hoy lo único posible es
 * traer los pedidos y sumar en el navegador, que es exactamente lo que no hay
 * que hacer: el agregado es del backend.
 *
 * Las funciones se dejan declaradas con su contrato para que el día que existan
 * los endpoints solo haya que completar el cuerpo, y para que el tipo que
 * espera el panel ya esté acordado.
 *
 * TODO (backend):
 *   GET /api/v1/metrics/panel      → IndicadoresDelDia
 *   GET /api/v1/metrics/zonas      → Zona[]
 *   GET /api/v1/metrics/rendimiento→ RendimientoDelDia
 *   GET /api/v1/metrics/actividad  → Actividad[]
 */

import type {
  Actividad,
  IndicadoresDelDia,
  RendimientoDelDia,
  Zona,
} from "@/lib/tipos/metricas";

export const metricasService = {
  async delPanel(token: string): Promise<IndicadoresDelDia> {
    return pendiente("GET /api/v1/metrics/panel", token);
  },

  async porZona(token: string): Promise<Zona[]> {
    return pendiente("GET /api/v1/metrics/zonas", token);
  },

  async rendimiento(token: string): Promise<RendimientoDelDia> {
    return pendiente("GET /api/v1/metrics/rendimiento", token);
  },

  async actividad(token: string): Promise<Actividad[]> {
    return pendiente("GET /api/v1/metrics/actividad", token);
  },
};

/**
 * Falla explícitamente en lugar de devolver datos vacíos: una pantalla en blanco
 * se investiga durante horas; un error que dice qué endpoint falta, no.
 */
function pendiente<T>(endpoint: string, _token: string): Promise<T> {
  return Promise.reject(
    new Error(`El backend todavía no expone ${endpoint} (ver services/metricas.service.ts)`),
  );
}
