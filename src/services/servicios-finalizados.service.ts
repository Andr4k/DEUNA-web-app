import "server-only";

import type {
  FiltrosServiciosFinalizados,
  RespuestaServiciosFinalizados,
} from "@/lib/tipos/servicios-finalizados";
import { instanteDelDia } from "@/lib/ventana";
import { pedir } from "@/services/http";

/**
 * Servicios finalizados — espejo del servicio Orders del backend.
 *
 * Una función por endpoint real. El endpoint todavía no está desplegado, pero el
 * contrato ya está escrito en `src/lib/tipos/servicios-finalizados.ts`: la pantalla
 * se programa contra ese contrato y no contra una ruta inventada, así que el día que
 * el gateway lo exponga esto funciona sin tocar la UI.
 */
export const serviciosFinalizadosService = {
  /**
   * Historial paginado de servicios cerrados, con los KPIs de la cabecera.
   *
   * No se cachea (`revalidar` sin definir): es un historial que incluye el día en
   * curso, y una respuesta de hace cinco minutos mostraría un "hoy" que ya no es.
   */
  async historial(
    filtros: FiltrosServiciosFinalizados,
    token: string,
  ): Promise<RespuestaServiciosFinalizados> {
    return pedir<RespuestaServiciosFinalizados>(
      `/api/v1/admin/orders/servicios-finalizados${consulta(filtros)}`,
      { token },
    );
  },
};

/**
 * Query string con los filtros que vengan definidos.
 *
 * Los que no vienen no se mandan, así el backend aplica su valor por defecto en
 * lugar de recibir un `zona=` vacío que podría leerse como "zona vacía".
 *
 * `desde` y `hasta` llegan como DÍAS (`YYYY-MM-DD`), que es lo que elige el operador,
 * y la traducción a los instantes del contrato —donde `hasta` es EXCLUSIVO— la hace
 * `lib/ventana.ts`. Vive ahí y no acá porque es una decisión del contrato y no de este
 * servicio: la pantalla de calificaciones pide ventanas con la misma regla, y dos copias
 * del huso y de la exclusividad terminarían pidiendo rangos distintos para el mismo día.
 */
function consulta(filtros: FiltrosServiciosFinalizados): string {
  const params = new URLSearchParams();

  const desde = instanteDelDia(filtros.desde, 0);
  const hasta = instanteDelDia(filtros.hasta, 1);

  if (desde) params.set("desde", desde);
  if (hasta) params.set("hasta", hasta);
  if (filtros.restauranteId) params.set("restauranteId", filtros.restauranteId);
  if (filtros.repartidorId) params.set("repartidorId", filtros.repartidorId);
  if (filtros.zona) params.set("zona", filtros.zona);
  if (filtros.calificacionMin !== undefined) {
    params.set("calificacionMin", String(filtros.calificacionMin));
  }
  if (filtros.buscar) params.set("buscar", filtros.buscar);
  if (filtros.pagina !== undefined) params.set("pagina", String(filtros.pagina));
  if (filtros.tamano !== undefined) params.set("tamano", String(filtros.tamano));

  const cadena = params.toString();
  return cadena ? `?${cadena}` : "";
}

/* --------------------------------------------------------------------------
   Lo que este servicio todavía no puede pedir, y por qué no está acá:

   - El detalle de un servicio (rebanada 6, diferible): sin endpoint, la columna
     "Ver detalle" queda deshabilitada en lugar de apuntar a una ruta que no existe.
   - La exportación del historial (rebanada 7, diferible): depende de decidir si
     exporta la página visible o todo el filtro.

   `conIncidencia` y `pago` NO son endpoints faltantes: son filtros que el contrato
   de la petición no tiene porque todavía no tienen fuente (no existe el modelo de
   incidencias y "quién paga" sigue sin decidirse). Mandarlos vacíos afirmaría algo
   que no se sabe.
   -------------------------------------------------------------------------- */
