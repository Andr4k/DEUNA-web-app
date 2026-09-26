import { Estrellas } from "@/components/calificaciones/Estrellas";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { nota } from "@/components/calificaciones/valoresCalificacion";
import type { ResumenCalificacionesRestaurantes as Resumen } from "@/lib/tipos/calificaciones-restaurantes";

/** Un criterio de la encuesta con su promedio. */
type Aspecto = Resumen["aspectos"][number];

/**
 * El puntaje promedio de cada criterio de la encuesta.
 *
 * Los aspectos salen del RESUMEN y no de los restaurantes de la página: este bloque dice
 * el promedio de todo el filtro —es lo que el diseño llama global—, y el resumen lo
 * agrega sobre el mismo conjunto que las filas, así que la tabla y este bloque no pueden
 * decir números distintos. Antes se promediaban los diez restaurantes de la página, que
 * era otra cosa y la interfaz tenía que aclararlo al pie.
 *
 * El orden lo decide la vista por CANTIDAD de calificaciones y no por la nota: el
 * criterio que más gente contestó va arriba, así el bloque muestra primero lo que tiene
 * respaldo y deja abajo lo que son cuatro opiniones. El orden por nota escondería justo
 * esa diferencia —un criterio con tres calificaciones de 5 no merece ir primero—.
 *
 * Se muestran los criterios que existan, no una lista fija de nombres: el criterio es
 * texto libre (decisión de TASK-402), así que además de Sabor y Rapidez aparecen hoy
 * Empaque y Temperatura, y aparece cualquiera que se agregue sin tocar esta pantalla.
 */
export async function PromedioPorAspecto({ datos }: { datos: Promise<Resumen> }) {
  const { aspectos } = await datos;
  const ordenados = porCantidad(aspectos);

  return (
    <Tarjeta titulo="Promedio por aspecto (global)">
      {ordenados.length === 0 ? (
        <EstadoVacio
          icono="estrella"
          titulo="Sin puntajes por criterio"
          descripcion="Con estos filtros no hay calificaciones con puntaje por criterio. Probá ampliar las fechas o limpiar los filtros."
        />
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {ordenados.map((aspecto) => (
            <FilaAspecto key={aspecto.criterio} aspecto={aspecto} />
          ))}
        </ul>
      )}
    </Tarjeta>
  );
}

/** Una fila: el criterio, sus estrellas y la nota, como el diseño. */
function FilaAspecto({ aspecto }: { aspecto: Aspecto }) {
  return (
    <li className="flex items-center gap-3 text-[13px]">
      <span className="min-w-0 flex-1 truncate text-texto-2" title={aspecto.criterio}>
        {aspecto.criterio}
      </span>

      <Estrellas valor={aspecto.promedio} />

      <span className="w-9 shrink-0 text-right font-bold tabular-nums">
        {nota(aspecto.promedio)}
      </span>
    </li>
  );
}

/**
 * Los criterios de mayor a menor cantidad de calificaciones.
 *
 * Se descartan los que no tienen ninguna: un promedio sobre cero encuestas no es 0, es un
 * dato que no existe, y mostrarlo como cero pondría un criterio sin calificaciones por
 * debajo de uno mal calificado, que es lo contrario de lo que dice el dato. El `filter`
 * devuelve un arreglo nuevo, así que ordenar no toca el objeto que vino en la promesa.
 */
function porCantidad(aspectos: Aspecto[]): Aspecto[] {
  return aspectos
    .filter((aspecto) => aspecto.cantidad > 0)
    .sort((a, b) => b.cantidad - a.cantidad);
}
