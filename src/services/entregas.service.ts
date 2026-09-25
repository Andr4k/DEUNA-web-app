import "server-only";

import { pedir } from "@/services/http";
import type { DatosMapa } from "@/lib/tipos/mapa";
import type {
  AsignacionConfirmada,
  CandidatosDePedido,
  UbicacionDomiciliario,
} from "@/lib/tipos/repartidor";

/**
 * Entregas — espejo del servicio Delivery del backend.
 *
 * El domiciliario opera desde su app móvil; el portal lee y, desde acá, asigna.
 * La asignación manual es del administrador: es la operación que reemplaza al
 * reparto automático cuando nadie tomó el pedido.
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

  /**
   * Las tres capas del mapa de la operación: domiciliarios en vivo, puntos de
   * entrega y restaurantes.
   *
   * Requiere rol ADMIN. Es dato vivo —los domiciliarios se mueven—, así que se
   * pide sin caché: el refresco lo maneja quien lo consume, hoy el polling de
   * `MapaEnVivo`. Los domiciliarios con telemetría vieja vienen igual, con
   * `vigente: false`: el backend no los esconde a propósito, y el mapa tiene que
   * poder distinguir "nadie reporta posición" de "no hay flota".
   */
  async mapa(token: string): Promise<DatosMapa> {
    return pedir<DatosMapa>("/api/v1/admin/delivery/mapa", { token, revalidar: 0 });
  },

  /**
   * Domiciliarios candidatos para un pedido, ordenados por cercanía.
   *
   * Requiere rol ADMIN. La lista llega ordenada desde el backend (distancia al
   * punto de entrega) y el portal la respeta: reordenarla acá daría una sugerencia
   * distinta de la que ve la app del domiciliario.
   */
  async candidatos(pedidoId: string, token: string): Promise<CandidatosDePedido> {
    return pedir<CandidatosDePedido>(`/api/v1/admin/delivery/candidatos/${pedidoId}`, {
      token,
    });
  },

  /**
   * Asigna un domiciliario a un pedido.
   *
   * Requiere rol ADMIN. Cuando el backend lo rechaza, `pedir` lanza `ErrorApi` con
   * el estado y el mensaje: los motivos (409 `RepartidorOcupado` /
   * `RepartidorNoEsCandidato`, 400 `EstadoInvalido` / `SinPuntoEntrega`, 404
   * `PedidoNoEncontrado`) los traduce la Server Action, que es quien puede
   * mostrárselos al operador.
   */
  async asignar(
    pedidoId: string,
    repartidorId: string,
    token: string,
  ): Promise<AsignacionConfirmada> {
    return pedir<AsignacionConfirmada>(`/api/v1/admin/delivery/asignar/${pedidoId}`, {
      method: "POST",
      body: { repartidorId },
      token,
    });
  },
};

/* --------------------------------------------------------------------------
   Pendientes en el backend:

   - GET /api/v1/delivery/riders?estado=&zona=
       Listado de domiciliarios con su estado para la pantalla Domiciliarios.
   - GET /api/v1/delivery/riders/{id}/deliveries
       Historial de entregas del domiciliario.
   - GET /api/v1/delivery/fleet
       Quedó sin construir: la posición de TODA la flota se pide por `mapa()`
       (GET /api/v1/admin/delivery/mapa, rol ADMIN), que además trae los pedidos y
       los restaurantes. El mapa de la pantalla de pedidos lo consume.
   - GET /api/v1/feedback/riders/{id}/calificacion
       La calificación del domiciliario EXISTE en el servicio de Feedback, pero el
       portal no tiene endpoint para pedirla: no hay forma de pedirle a Feedback
       los puntajes por domiciliario. Por eso la pantalla de pedidos NO muestra
       "Calificación" en la lista de candidatos —el diseño la pedía—: mostrarla
       obligaría a inventarla o a cruzar servicios desde el portal.
   -------------------------------------------------------------------------- */
