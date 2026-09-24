/**
 * Cliente de la API de DEUNA.
 *
 * El portal habla con el **gateway** (puerto 5000), no con cada servicio: el
 * gateway resuelve el enrutamiento y aplica el rate limit. Se configura con
 * `NEXT_PUBLIC_API_URL` (ver `.env.example`).
 *
 * Solo están los endpoints que el backend expone HOY. Los que el panel necesita
 * y todavía no existen están anotados abajo como TODO: no inventar rutas acá,
 * porque una ruta inventada falla en tiempo de ejecución y no de compilación.
 */

import type { Pedido } from "@/lib/tipos";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ErrorApi extends Error {
  constructor(
    message: string,
    readonly estado: number,
  ) {
    super(message);
    this.name = "ErrorApi";
  }
}

async function pedir<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const respuesta = await fetch(`${BASE}${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...opciones.headers,
    },
  });

  if (!respuesta.ok) {
    // 401/403 se manejan arriba (redirigir al login); acá se propaga el motivo
    // para que la pantalla pueda decir algo útil en lugar de "algo falló".
    throw new ErrorApi(`La petición a ${ruta} falló`, respuesta.status);
  }

  if (respuesta.status === 204) {
    return undefined as T;
  }

  return (await respuesta.json()) as T;
}

export const api = {
  /**
   * Pedidos de un restaurante. Es lo único que Orders expone para listar.
   * Requiere el rol RESTAURANT en el token.
   */
  pedidosDelRestaurante: (restauranteId: string) =>
    pedir<Pedido[]>(`/api/v1/orders/restaurante/${restauranteId}`),

  /** Un pedido puntual, con su estado actual. */
  pedido: (pedidoId: string) => pedir<Pedido>(`/api/v1/orders/${pedidoId}`),

  /** Posición en tiempo real del domiciliario de un pedido (rol RESTAURANT). */
  seguimiento: (pedidoId: string) =>
    pedir<{ latitud: number; longitud: number; distanciaMetros: number; actualizadoEn: string }>(
      `/api/v1/delivery/tracking/${pedidoId}`,
    ),
};

/* --------------------------------------------------------------------------
   Lo que el panel necesita y el backend todavía NO expone.
   Cada uno es una tarea de backend, no un problema del frontend:

   - GET /api/v1/orders?estado=&desde=&hasta=   listado global con filtros
   - GET /api/v1/metrics/panel                  agregados del día (los cinco KPI)
   - GET /api/v1/metrics/zonas                  pedidos y recaudo por zona
   - GET /api/v1/metrics/rendimiento            entregas a tiempo, tiempo promedio
   - GET /api/v1/feedback/restaurant/{id}/summary   promedio por criterio y comentarios
   - POST /api/v1/orders/{id}/assign            asignación manual desde el panel
   -------------------------------------------------------------------------- */
