import "server-only";

import { pedir } from "@/services/http";
import type { UbicacionDomiciliario } from "@/lib/tipos/repartidor";

/**
 * Entregas — espejo del servicio Delivery del backend.
 *
 * El portal solo lee: la asignación es automática (el backend busca el
 * domiciliario más cercano) y el domiciliario opera desde su app móvil.
 */
export const entregasService = {
  /**
   * Posición en tiempo real del domiciliario de un pedido.
   *
   * Requiere rol RESTAURANT. Es dato vivo: se consulta desde un componente
   * cliente que refresca solo, no desde el render del servidor.
   */
  async seguimiento(pedidoId: string, token: string): Promise<UbicacionDomiciliario> {
    return pedir<UbicacionDomiciliario>(`/api/v1/delivery/tracking/${pedidoId}`, {
      token,
      revalidar: 0,
    });
  },
};

/* --------------------------------------------------------------------------
   Pendientes en el backend:

   - GET /api/v1/delivery/riders?estado=&zona=
       Listado de domiciliarios con su estado para la pantalla Domiciliarios.
   - GET /api/v1/delivery/riders/{id}/deliveries
       Historial de entregas del domiciliario.
   -------------------------------------------------------------------------- */
