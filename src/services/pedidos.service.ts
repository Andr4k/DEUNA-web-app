import "server-only";

import { pedir } from "@/services/http";
import type { Pedido, PedidoResumen } from "@/lib/tipos/pedido";

/**
 * Pedidos — espejo del servicio Orders del backend.
 *
 * Cada función corresponde a un endpoint real. Si un endpoint no existe todavía,
 * NO se agrega acá: se anota abajo como pendiente. Una ruta inventada falla en
 * tiempo de ejecución, no de compilación, y el error aparece en producción.
 */
export const pedidosService = {
  /** Pedidos de un restaurante. Requiere rol RESTAURANT en el token. */
  async delRestaurante(restauranteId: string, token: string): Promise<PedidoResumen[]> {
    return pedir<PedidoResumen[]>(`/api/v1/orders/restaurante/${restauranteId}`, { token });
  },

  /** Un pedido puntual con su estado actual y su historial de asignaciones. */
  async porId(pedidoId: string, token: string): Promise<Pedido> {
    return pedir<Pedido>(`/api/v1/orders/${pedidoId}`, { token });
  },

  /** Pedidos de un cliente. Requiere rol RESTAURANT (es la vista del comercio). */
  async delCliente(clienteId: string, token: string): Promise<PedidoResumen[]> {
    return pedir<PedidoResumen[]>(`/api/v1/orders/cliente/${clienteId}`, { token });
  },
};

/* --------------------------------------------------------------------------
   Endpoints que este servicio necesita y el backend todavía NO expone.
   Son tareas de backend, no del portal:

   - GET  /api/v1/orders?estado=&desde=&hasta=&zona=&pagina=
       Listado global con filtros y paginación (el panel del administrador no
       puede pedir "los pedidos de un restaurante" cuando quiere verlos todos).
   - POST /api/v1/orders/{id}/assign
       Asignación manual de un domiciliario (hoy la asignación es automática).
   - POST /api/v1/orders/{id}/cancel
   -------------------------------------------------------------------------- */
