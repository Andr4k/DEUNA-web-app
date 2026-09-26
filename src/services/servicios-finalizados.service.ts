import "server-only";

import type {
  FiltrosServiciosFinalizados,
  RespuestaServiciosFinalizados,
} from "@/lib/tipos/servicios-finalizados";
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
 * y acá se traducen a los instantes del contrato —donde `hasta` es EXCLUSIVO—. La
 * traducción vive acá y no en la pantalla porque es una decisión del contrato, no de
 * la vista: si viviera en la vista, cada pantalla que consulte el historial tendría
 * que acordarse del huso y de la exclusividad.
 */
function consulta(filtros: FiltrosServiciosFinalizados): string {
  const params = new URLSearchParams();

  const desde = instante(filtros.desde, 0);
  const hasta = instante(filtros.hasta, 1);

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

/**
 * El día que eligió el operador, convertido al instante que espera el contrato.
 *
 * El operador piensa en días de calendario de Colombia y el contrato quiere instantes
 * ISO: se toma la medianoche de ese día en UTC-05:00 —el huso del país no tiene
 * horario de verano, así que desplazar 24 h no desfasa— y, para `hasta`, se avanza un
 * día, porque el rango lo cierra el backend de forma exclusiva. Un día que no se puede
 * parsear se descarta: mandar `Invalid Date` a la API es peor que no mandar el filtro.
 */
function instante(dia: string | undefined, diasDesplazados: number): string | null {
  if (!dia) return null;

  const fecha = new Date(`${dia}T00:00:00-05:00`);
  if (Number.isNaN(fecha.getTime())) return null;

  if (diasDesplazados) fecha.setTime(fecha.getTime() + diasDesplazados * 86_400_000);
  return fecha.toISOString();
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
