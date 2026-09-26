import { Estrellas } from "@/components/calificaciones/Estrellas";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Icono } from "@/components/ui/Icono";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { nota } from "@/components/calificaciones/valoresCalificacion";
import type { ResumenCalificacionesRestaurantes as Resumen } from "@/lib/tipos/calificaciones-restaurantes";

/** El contrato dice top 5; se corta acá igual, por si el backend mandara más. */
const CUANTOS = 5;

/** A dónde lleva "Ver ranking completo": la tabla de restaurantes, más abajo. */
const RANKING = "#ranking-restaurantes";

/**
 * Los cinco restaurantes mejor calificados del filtro.
 *
 * El orden lo decide el backend —viene ordenado en `top`—: reordenar acá sería repetir
 * la comparación y podría dar distinto con empates, donde el criterio de desempate es
 * del backend y no de la vista. El número de la izquierda es la posición, no un puntaje.
 *
 * Cada fila lleva las estrellas de la nota y el número, y no el total de calificaciones:
 * con cinco filas y un cuarto de pantalla de ancho, la nota es lo que se viene a ver y la
 * estrella la ubica sin leer el decimal. El conteo de cada restaurante está en la tabla,
 * a un clic de acá.
 *
 * El botón va a la tabla de esta misma pantalla y no a otra ruta porque no existe una
 * pantalla de ranking aparte: la tabla es la lista completa de restaurantes calificados
 * con su promedio, que es lo que este bloque resume.
 */
export async function TopRestaurantes({ datos }: { datos: Promise<Resumen> }) {
  const { top } = await datos;
  const mejores = top.slice(0, CUANTOS);

  return (
    <Tarjeta titulo="Top 5 restaurantes">
      {mejores.length === 0 ? (
        <EstadoVacio
          icono="estrella"
          titulo="Ningún restaurante calificado"
          descripcion="Con estos filtros no hay restaurantes con calificaciones. Probá ampliar las fechas o limpiar los filtros."
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
            {mejores.map((restaurante, indice) => (
              <li key={restaurante.restauranteId} className="flex items-center gap-2.5 text-[13px]">
                <span className="grid size-5 shrink-0 place-items-center rounded-full border border-borde text-[10px] text-texto-2">
                  {indice + 1}
                </span>

                <span className="min-w-0 flex-1 truncate" title={restaurante.nombre}>
                  {restaurante.nombre}
                </span>

                <Estrellas valor={restaurante.promedio} tamano={10} />

                <span className="w-8 shrink-0 text-right font-bold tabular-nums">
                  {nota(restaurante.promedio)}
                </span>
              </li>
            ))}
          </ol>

          <a
            href={RANKING}
            className="flex items-center justify-center gap-1.5 rounded-control border border-borde px-3 py-1.5 text-xs font-medium text-info transition-colors hover:border-info"
          >
            Ver ranking completo
            <Icono nombre="flecha" tamano={13} />
          </a>
        </div>
      )}
    </Tarjeta>
  );
}
