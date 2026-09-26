import "server-only";

import type { FiltrosUsuarios, RespuestaUsuarios } from "@/lib/tipos/usuarios";
import { pedir } from "@/services/http";

/**
 * Usuarios — espejo del servicio Identity del backend.
 *
 * Una función por endpoint real. El endpoint todavía no está desplegado, pero el
 * contrato ya está escrito en `src/lib/tipos/usuarios.ts`: la pantalla se programa
 * contra ese contrato y no contra una ruta inventada, así que el día que el gateway lo
 * exponga esto funciona sin tocar la UI.
 */
export const usuariosService = {
  /**
   * Listado paginado de cuentas, con los desgloses de la cabecera.
   *
   * No se cachea (`revalidar` sin definir): es la lista de cuentas que el operador
   * administra, y una respuesta de hace cinco minutos podría mostrar activa una cuenta
   * que acaba de suspenderse.
   */
  async listado(filtros: FiltrosUsuarios, token: string): Promise<RespuestaUsuarios> {
    return pedir<RespuestaUsuarios>(`/api/v1/admin/identity/usuarios${consulta(filtros)}`, {
      token,
    });
  },
};

/**
 * Query string con los filtros que vengan definidos.
 *
 * Los que no vienen no se mandan, así el backend aplica su valor por defecto en lugar
 * de recibir un `tipo=` vacío que podría leerse como "tipo vacío".
 */
function consulta(filtros: FiltrosUsuarios): string {
  const params = new URLSearchParams();

  if (filtros.buscar) params.set("buscar", filtros.buscar);
  if (filtros.tipo) params.set("tipo", filtros.tipo);
  if (filtros.estado) params.set("estado", filtros.estado);
  if (filtros.pagina !== undefined) params.set("pagina", String(filtros.pagina));
  if (filtros.tamano !== undefined) params.set("tamano", String(filtros.tamano));

  const cadena = params.toString();
  return cadena ? `?${cadena}` : "";
}

/* --------------------------------------------------------------------------
   Lo que este servicio todavía no puede pedir, y por qué no está acá:

   - Los permisos por usuario (el Panel de Permisos del diseño): necesita un endpoint
     de permisos por cuenta que todavía no existe en ningún servicio. Sin él, el panel
     no tendría de dónde leer y mostraría casillas inventadas, así que queda fuera.
   - El alta, la suspensión y la recuperación de acceso: son endpoints de escritura
     —POST/PATCH— y este servicio solo lee. La pantalla tampoco los ofrece todavía.
   -------------------------------------------------------------------------- */
