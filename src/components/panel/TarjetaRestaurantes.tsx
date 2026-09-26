import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { Icono } from "@/components/ui/Icono";
import { ListaDesglose } from "@/components/ui/ListaDesglose";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { numero } from "@/lib/formato";
import type { ResumenRestaurantes } from "@/lib/tipos/metricas";

/**
 * Estado de la red de restaurantes.
 *
 * `conPedidosHoy` es el dato que hace visible un problema real: un restaurante
 * activo que no recibió ni un pedido puede estar cerrado sin avisar o con el menú
 * mal cargado. Viene del dominio de pedidos, no del de restaurantes: son dos bases
 * distintas y las une el servicio de métricas.
 */
export function TarjetaRestaurantes({ resumen }: { resumen: ResumenRestaurantes }) {
  return (
    <Tarjeta titulo="Restaurantes" pie={<EnlaceAccion href="/restaurantes">Ver todos</EnlaceAccion>}>
      <div className="mb-3 flex items-center gap-3">
        <Icono nombre="tienda" tamano={22} className="text-morado" />
        <div>
          <div className="text-[26px] leading-none font-bold">{numero(resumen.activos)}</div>
          <div className="text-[13px] text-texto-2">Activos</div>
        </div>
      </div>

      <ListaDesglose
        filas={[
          {
            etiqueta: "Con pedidos hoy",
            valor: numero(resumen.conPedidosHoy),
            claseValor: "text-morado",
          },
          { etiqueta: "Nuevos hoy", valor: numero(resumen.nuevosHoy) },
        ]}
      />
    </Tarjeta>
  );
}
