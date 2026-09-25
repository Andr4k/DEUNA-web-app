import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { Icono } from "@/components/ui/Icono";
import { ListaDesglose } from "@/components/ui/ListaDesglose";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { DOMICILIARIOS } from "@/lib/datos-ejemplo";
import { numero } from "@/lib/formato";

/** Estado de la flota de domiciliarios. */
export function TarjetaDomiciliarios() {
  return (
    <Tarjeta titulo="Domiciliarios" pie={<EnlaceAccion href="/domiciliarios">Ver todos</EnlaceAccion>}>
      <div className="mb-3 flex items-center gap-3">
        <Icono nombre="moto" tamano={22} className="text-exito" />
        <div>
          <div className="text-[26px] leading-none font-bold">{numero(DOMICILIARIOS.activos)}</div>
          <div className="text-[13px] text-texto-2">Activos ahora</div>
        </div>
      </div>

      <ListaDesglose
        filas={[
          {
            etiqueta: "Disponibles",
            valor: numero(DOMICILIARIOS.disponibles),
            claseValor: "text-exito",
          },
          { etiqueta: "En servicio", valor: numero(DOMICILIARIOS.enServicio) },
          { etiqueta: "En descanso", valor: numero(DOMICILIARIOS.enDescanso) },
        ]}
      />
    </Tarjeta>
  );
}
