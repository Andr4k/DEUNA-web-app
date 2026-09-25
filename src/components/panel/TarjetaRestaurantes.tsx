import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { Icono } from "@/components/ui/Icono";
import { ListaDesglose } from "@/components/ui/ListaDesglose";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { RESTAURANTES } from "@/lib/datos-ejemplo";
import { numero } from "@/lib/formato";

/** Estado de la red de restaurantes. */
export function TarjetaRestaurantes() {
  return (
    <Tarjeta titulo="Restaurantes" pie={<EnlaceAccion href="/restaurantes">Ver todos</EnlaceAccion>}>
      <div className="mb-3 flex items-center gap-3">
        <Icono nombre="tienda" tamano={22} className="text-morado" />
        <div>
          <div className="text-[26px] leading-none font-bold">{numero(RESTAURANTES.activos)}</div>
          <div className="text-[13px] text-texto-2">Activos</div>
        </div>
      </div>

      <ListaDesglose
        filas={[
          {
            etiqueta: "Con pedidos hoy",
            valor: numero(RESTAURANTES.conPedidosHoy),
            claseValor: "text-morado",
          },
          { etiqueta: "Nuevos hoy", valor: numero(RESTAURANTES.nuevosHoy) },
        ]}
      />
    </Tarjeta>
  );
}
