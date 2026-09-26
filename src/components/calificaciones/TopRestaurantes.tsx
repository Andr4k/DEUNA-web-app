import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { nota } from "@/components/calificaciones/valoresCalificacion";
import { numero } from "@/lib/formato";
import type { ResumenCalificacionesRestaurantes as Resumen } from "@/lib/tipos/calificaciones-restaurantes";

/** El contrato dice top 5; se corta acá igual, por si el backend mandara más. */
const CUANTOS = 5;

/**
 * Los cinco restaurantes mejor calificados del filtro.
 *
 * El orden lo decide el backend —viene ordenado en `top`—: reordenar acá sería repetir
 * la comparación y podría dar distinto con empates, donde el criterio de desempate es
 * del backend y no de la vista. El número de la izquierda es la posición, no un puntaje.
 */
export async function TopRestaurantes({ datos }: { datos: Promise<Resumen> }) {
  const { top } = await datos;
  const mejores = top.slice(0, CUANTOS);

  return (
    <Tarjeta titulo="Top 5 por promedio">
      {mejores.length === 0 ? (
        <EstadoVacio
          icono="estrella"
          titulo="Ningún restaurante calificado"
          descripcion="Con estos filtros no hay restaurantes con calificaciones. Probá ampliar las fechas o limpiar los filtros."
        />
      ) : (
        <ol className="m-0 flex list-none flex-col p-0">
          {mejores.map((restaurante, indice) => (
            <li
              key={restaurante.restauranteId}
              className="flex items-center gap-3 border-b border-borde-suave py-2.5 text-[13px] last:border-b-0"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-borde bg-panel-alt text-[11px] font-bold text-texto-2">
                {indice + 1}
              </span>

              <span className="min-w-0 flex-1 truncate" title={restaurante.nombre}>
                {restaurante.nombre}
              </span>

              <span className="shrink-0 text-[12px] text-texto-3 tabular-nums">
                {numero(restaurante.total)} calif.
              </span>

              <span className="w-9 shrink-0 text-right font-bold tabular-nums">
                {nota(restaurante.promedio)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Tarjeta>
  );
}
