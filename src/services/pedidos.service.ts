import "server-only";

import { pedir } from "@/services/http";
import type {
  FiltrosPedidos,
  PaginaPedidos,
  Pedido,
  PedidoResumen,
} from "@/lib/tipos/pedido";

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

  /**
   * Listado de administración: los pedidos que todavía no tienen domiciliario.
   *
   * Requiere rol ADMIN. Es la cola de trabajo del administrador y la única vista
   * global de pedidos que existe. No se cachea (`revalidar` sin definir): la
   * pantalla sirve para asignar, y una lista de hace cinco minutos haría que el
   * operador intente asignar un pedido que ya tomó otro.
   */
  async sinAsignar(filtros: FiltrosPedidos, token: string): Promise<PaginaPedidos> {
    return pedir<PaginaPedidos>(`/api/v1/admin/orders/sin-asignar${consulta(filtros)}`, {
      token,
    });
  },
};

/**
 * Query string con los filtros que vengan definidos.
 *
 * Los que no vienen no se mandan, así el backend aplica su valor por defecto en
 * lugar de recibir un `zona=` vacío que podría leerse como "zona vacía".
 */
function consulta(filtros: FiltrosPedidos): string {
  const params = new URLSearchParams();

  if (filtros.zona) params.set("zona", filtros.zona);
  if (filtros.prioridad) params.set("prioridad", filtros.prioridad);
  if (filtros.esperaMin !== undefined) params.set("esperaMin", String(filtros.esperaMin));
  if (filtros.pagina !== undefined) params.set("pagina", String(filtros.pagina));
  if (filtros.tamano !== undefined) params.set("tamano", String(filtros.tamano));

  const cadena = params.toString();
  return cadena ? `?${cadena}` : "";
}

/* --------------------------------------------------------------------------
   Endpoints que este servicio necesita y el backend todavía NO expone.
   Son tareas de backend, no del portal:

   - GET /api/v1/admin/orders?estado=&desde=&hasta=&zona=&pagina=
       Listado global con filtros por estado y fecha. Lo que ya existe
       (`sinAsignar`) es solo la cola sin asignar: sirve para esta pantalla, no
       para "todos los pedidos del día", que es lo que necesita el panel.
   - GET /api/v1/orders/{id}/detalle
       El pedido con su historial de intentos de entrega (la pantalla de detalle).
   - POST /api/v1/admin/orders/{id}/cancel
       Cancelar un pedido desde el portal.

   La asignación manual SÍ existe y vive en `entregas.service.ts`
   (`candidatos` / `asignar`), que es el servicio dueño de esa operación.
   -------------------------------------------------------------------------- */
