import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { Actividad, TipoActividad } from "@/lib/tipos/metricas";

/**
 * Color del punto según el dominio que emitió el evento.
 *
 * El tipo viaja crudo desde el backend y el portal decide el color: si mañana
 * `Deuna.Metrics.Service` agrega un dominio nuevo, el Record lo delata acá en lugar
 * de dibujar un punto sin color.
 */
const COLOR: Record<TipoActividad, string> = {
  pedido: "bg-acento",
  entrega: "bg-exito",
  servicio: "bg-info",
};

/** Actividad reciente: línea de tiempo con lo último que pasó en la operación. */
export async function ActividadReciente({ eventos }: { eventos: Promise<Actividad[]> }) {
  const lista = await eventos;

  return (
    <Tarjeta
      titulo="Actividad reciente"
      accion={<EnlaceAccion href="/incidencias">Ver toda la actividad</EnlaceAccion>}
    >
      {lista.length === 0 ? (
        <EstadoVacio
          icono="campana"
          titulo="Sin novedades todavía"
          descripcion="Acá aparecen los pedidos, las entregas y las calificaciones del día."
        />
      ) : (
        <ol className="flex flex-col">
          {lista.map((evento, indice) => (
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
      )}
    </Tarjeta>
  );
}
