import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { ACTIVIDAD } from "@/lib/datos-ejemplo";
import type { Actividad as ActividadDominio } from "@/lib/tipos";

/** Color del punto según el tipo de novedad. */
const COLOR: Record<ActividadDominio["tipo"], string> = {
  pedido: "bg-exito",
  entrega: "bg-exito",
  dinero: "bg-acento",
  incidencia: "bg-info",
  servicio: "bg-exito",
};

/** Actividad reciente: línea de tiempo con lo último que pasó en la operación. */
export function ActividadReciente() {
  return (
    <Tarjeta
      titulo="Actividad reciente"
      accion={<EnlaceAccion href="/incidencias">Ver toda la actividad</EnlaceAccion>}
    >
      <ol className="flex flex-col">
        {ACTIVIDAD.map((evento, indice) => (
          <li
            key={`${evento.hora}-${indice}`}
            className="grid grid-cols-[74px_10px_1fr] items-start gap-2.5 border-b border-borde-suave py-2.5 text-[13px] last:border-b-0"
          >
            <span className="text-xs whitespace-nowrap text-texto-3">{evento.hora}</span>
            <span className={`mt-1.5 size-2 rounded-full ${COLOR[evento.tipo]}`} />
            <span className="text-texto-2">{evento.texto}</span>
          </li>
        ))}
      </ol>
    </Tarjeta>
  );
}
