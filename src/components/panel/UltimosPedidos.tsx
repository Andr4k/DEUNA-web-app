import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Tarjeta } from "@/components/ui/Tarjeta";

/**
 * Últimos pedidos.
 *
 * **Esta sección no tiene datos y no es un olvido.** La tabla necesita un listado
 * global de pedidos con filtros y paginación, y el backend hoy solo expone "pedidos
 * de un restaurante": un administrador no puede pedir los pedidos de cada comercio
 * uno por uno para armar su panel. Falta
 * `GET /api/v1/metrics/pedidos?estado=&desde=&hasta=&pagina=`.
 *
 * Se deja el hueco visible y dicho, en lugar de llenarlo con pedidos de ejemplo:
 * una tabla con datos inventados en un panel real es peor que una tabla vacía que
 * explica qué falta.
 */
export function UltimosPedidos() {
  return (
    <Tarjeta
      titulo="Últimos pedidos"
      accion={<EnlaceAccion href="/pedidos">Ver todos</EnlaceAccion>}
    >
      <EstadoVacio
        icono="pedidos"
        titulo="Falta el listado global de pedidos"
        descripcion="Esta tabla necesita GET /api/v1/metrics/pedidos con filtros y paginación: el panel de administración no puede usar el listado por restaurante que ya existe."
      />
    </Tarjeta>
  );
}
