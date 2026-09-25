import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { Icono } from "@/components/ui/Icono";
import { ListaDesglose } from "@/components/ui/ListaDesglose";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { numero } from "@/lib/formato";
import type { ResumenDomiciliarios } from "@/lib/tipos/metricas";

/**
 * Estado de la flota de domiciliarios.
 *
 * "En descanso" son los que la réplica marca inactivos, y "en servicio" los que
 * tienen una entrega abierta. Es una foto de la base, no la telemetría en vivo: la
 * posición real de cada domiciliario vive en Redis y se consulta desde el
 * seguimiento de un pedido, no desde el panel.
 */
export function TarjetaDomiciliarios({ resumen }: { resumen: ResumenDomiciliarios }) {
  return (
    <Tarjeta titulo="Domiciliarios" pie={<EnlaceAccion href="/domiciliarios">Ver todos</EnlaceAccion>}>
      <div className="mb-3 flex items-center gap-3">
        <Icono nombre="moto" tamano={22} className="text-exito" />
        <div>
          <div className="text-[26px] leading-none font-bold">{numero(resumen.activos)}</div>
          <div className="text-[13px] text-texto-2">Activos ahora</div>
        </div>
      </div>

      <ListaDesglose
        filas={[
          {
            etiqueta: "Disponibles",
            valor: numero(resumen.disponibles),
            claseValor: "text-exito",
          },
          { etiqueta: "En servicio", valor: numero(resumen.enServicio) },
          { etiqueta: "En descanso", valor: numero(resumen.enDescanso) },
        ]}
      />
    </Tarjeta>
  );
}
