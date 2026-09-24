import "server-only";

import { pedir } from "@/services/http";
import type {
  Actividad,
  RendimientoDelDia,
  ResumenPanel,
  Zona,
} from "@/lib/tipos/metricas";

/**
 * Métricas del panel — espejo de `Deuna.Metrics.Service`.
 *
 * Ese servicio no tiene base propia: lee las bases de los otros servicios con SQL
 * de solo lectura y devuelve los agregados ya calculados. El portal no suma nada.
 *
 * **Los cinco minutos de caché no son un descuido.** Los agregados son los mismos
 * para cualquier administrador —no hay dato por usuario— así que se pueden
 * reutilizar, y el panel dice justamente que se actualiza cada cinco minutos. Lo
 * que sí es por usuario (la sesión) no pasa por acá.
 */
const CINCO_MINUTOS = 300;

export const metricasService = {
  /** Los cuatro bloques del panel en una sola llamada. */
  async panel(token: string): Promise<ResumenPanel> {
    return pedir<ResumenPanel>("/api/v1/metrics/panel", { token, revalidar: CINCO_MINUTOS });
  },

  async zonas(token: string): Promise<Zona[]> {
    return pedir<Zona[]>("/api/v1/metrics/zonas", { token, revalidar: CINCO_MINUTOS });
  },

  async rendimiento(token: string): Promise<RendimientoDelDia> {
    return pedir<RendimientoDelDia>("/api/v1/metrics/rendimiento", {
      token,
      revalidar: CINCO_MINUTOS,
    });
  },

  async actividad(token: string): Promise<Actividad[]> {
    return pedir<Actividad[]>("/api/v1/metrics/actividad", { token, revalidar: CINCO_MINUTOS });
  },
};

/* --------------------------------------------------------------------------
   Lo que el panel necesita y el backend todavía no expone:

   - GET /api/v1/metrics/pedidos?estado=&desde=&hasta=&pagina=
       Listado global de pedidos con filtros y paginación. Hoy solo existe
       "pedidos de un restaurante" (`pedidosService.delRestaurante`), que no sirve
       para el panel del administrador. Es lo que falta para que la tabla "Últimos
       pedidos" tenga datos.
   - GET /api/v1/metrics/entregas-demoradas
       Pedidos que superan el tiempo estimado. Necesita que el pedido guarde un
       tiempo prometido, que hoy no existe (el radio y el horario están fijos en el
       código de Orders).
   - GET /api/v1/metrics/incidencias
       Incidencias sin resolver. No hay modelo de incidencias todavía.
   -------------------------------------------------------------------------- */
