import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { nota } from "@/components/calificaciones/valoresCalificacion";
import { numero } from "@/lib/formato";
import type {
  CalificacionDeRestaurante,
  PaginaCalificacionesRestaurantes,
} from "@/lib/tipos/calificaciones-restaurantes";

/** Un criterio con su promedio ponderado y sobre cuántas calificaciones se calculó. */
interface AspectoAgregado {
  criterio: string;
  promedio: number;
  cantidad: number;
}

/**
 * El puntaje promedio de cada criterio de la encuesta.
 *
 * Los aspectos son de cada restaurante (`aspectos` en la fila) y el contrato del
 * resumen NO los trae agregados —solo el promedio global—, así que lo que se puede
 * mostrar sin inventar es el promedio de los restaurantes de la página, ponderado por
 * `cantidad`: un criterio con 300 calificaciones no puede pesar lo mismo que uno con 2.
 * El pie lo dice con esas palabras, para que nadie lea este bloque como el promedio de
 * todo el filtro. El día que el resumen exponga los aspectos, se pasa a esa fuente y el
 * bloque queda igual.
 */
export async function PromedioPorAspecto({
  datos,
}: {
  datos: Promise<PaginaCalificacionesRestaurantes>;
}) {
  const { items } = await datos;
  const aspectos = promediar(items);

  return (
    <Tarjeta titulo="Promedio por aspecto">
      {aspectos.length === 0 ? (
        <EstadoVacio
          icono="estrella"
          titulo="Sin puntajes por criterio"
          descripcion="Ninguno de los restaurantes de esta página tiene puntajes por criterio todavía."
        />
      ) : (
        <>
          <ul className="flex flex-col gap-2.5">
            {aspectos.map((aspecto) => (
              <FilaAspecto key={aspecto.criterio} aspecto={aspecto} />
            ))}
          </ul>

          <p className="mt-3 mb-0 text-xs text-texto-3">
            Sobre {numero(items.length)} restaurantes de esta página: el resumen todavía no
            expone los aspectos de todo el filtro.
          </p>
        </>
      )}
    </Tarjeta>
  );
}

function FilaAspecto({ aspecto }: { aspecto: AspectoAgregado }) {
  return (
    <li className="flex items-center gap-3 text-[13px]">
      <span className="w-28 shrink-0 truncate text-texto-2" title={aspecto.criterio}>
        {aspecto.criterio}
      </span>

      <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-panel-alt">
        <span
          className="block h-full rounded-full bg-acento"
          style={{ width: `${(aspecto.promedio / 5) * 100}%` }}
        />
      </span>

      <span className="w-9 shrink-0 text-right font-semibold tabular-nums">
        {nota(aspecto.promedio)}
      </span>
      <span className="w-20 shrink-0 text-right text-[12px] text-texto-3 tabular-nums">
        {numero(aspecto.cantidad)} calif.
      </span>
    </li>
  );
}

/**
 * Promedio ponderado por criterio sobre las filas que vinieron.
 *
 * Se pondera por `cantidad` y se descartan los criterios sin calificaciones: un
 * promedio sobre cero encuestas no es 0, es un dato que no existe, y promediarlo como
 * cero hundiría el criterio sin motivo.
 */
function promediar(items: CalificacionDeRestaurante[]): AspectoAgregado[] {
  const acumulado = new Map<string, { suma: number; cantidad: number }>();

  for (const item of items) {
    for (const aspecto of item.aspectos) {
      if (aspecto.cantidad <= 0) continue;

      const actual = acumulado.get(aspecto.criterio) ?? { suma: 0, cantidad: 0 };
      actual.suma += aspecto.promedio * aspecto.cantidad;
      actual.cantidad += aspecto.cantidad;
      acumulado.set(aspecto.criterio, actual);
    }
  }

  return [...acumulado.entries()]
    .map(([criterio, { suma, cantidad }]) => ({
      criterio,
      promedio: suma / cantidad,
      cantidad,
    }))
    .sort((a, b) => b.promedio - a.promedio);
}
