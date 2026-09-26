import {
  COLOR_ESTRELLA,
  COLOR_ESTRELLA_TRAZO,
  NIVELES,
  conteoDe,
  totalDe,
} from "@/components/calificaciones/valoresCalificacion";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { numero, porcentaje } from "@/lib/formato";
import type { ResumenCalificacionesRestaurantes as Resumen } from "@/lib/tipos/calificaciones-restaurantes";

type Distribucion = Resumen["distribucion"];

/** La geometría del diseño: radio 15,9 sobre un lienzo de 42, que se muestra a 126 px. */
const TAMANO = 126;
const CENTRO = 21;
const RADIO = 15.9;
const GROSOR = 6;
const VUELTA = 2 * Math.PI * RADIO;

/**
 * Cómo se reparten las estrellas, en un donut con su leyenda al lado.
 *
 * Es un donut y no las barras de antes porque el diseño lo pide así: los cinco niveles
 * suman el total y en una circunferencia eso se lee de un vistazo —el verde ocupa más
 * de la mitad o no—, mientras que cinco barras de distinto ancho obligan a comparar
 * largos. La leyenda que lo acompaña lleva el conteo y el porcentaje de cada nivel, así
 * que no hace falta ir al número exacto con el ojo.
 *
 * Los conteos vienen del backend y el porcentaje se calcula acá —el contrato lo dice
 * explícitamente—, porque el porcentaje es una forma de mirar el mismo número y no otro
 * dato: si viniera de los dos lados, tarde o temprano diferirían en la última cifra y el
 * donut no cerraría con la leyenda.
 */
export async function DistribucionEstrellas({ datos }: { datos: Promise<Resumen> }) {
  const { distribucion } = await datos;
  const total = totalDe(distribucion);

  return (
    <Tarjeta titulo="Distribución de calificaciones">
      {total === 0 ? (
        <EstadoVacio
          icono="estrella"
          titulo="Sin calificaciones en el rango"
          descripcion="Con estos filtros ninguna calificación entra en el rango. Probá ampliar las fechas o limpiar los filtros."
        />
      ) : (
        <div className="flex items-center gap-4">
          <Dona distribucion={distribucion} total={total} />

          <ul className="m-0 flex min-w-0 flex-1 list-none flex-col gap-2.5 p-0">
            {NIVELES.map((nivel) => (
              <FilaLeyenda
                key={nivel}
                nivel={nivel}
                conteo={conteoDe(distribucion, nivel)}
                total={total}
              />
            ))}
          </ul>
        </div>
      )}
    </Tarjeta>
  );
}

/**
 * El donut.
 *
 * Cada nivel es un `circle` del mismo radio con un `stroke-dasharray` del largo de su
 * porción, y el desplazamiento negativo arranca donde terminó el anterior: así los cinco
 * se encadenan sobre una sola vuelta. Es SVG y no un `conic-gradient` porque necesita el
 * hueco del centro —donde va el total— y remates limpios entre porciones.
 */
function Dona({ distribucion, total }: { distribucion: Distribucion; total: number }) {
  let avance = 0;
  const porciones = NIVELES.map((nivel) => {
    const largo = (conteoDe(distribucion, nivel) / total) * VUELTA;
    const desde = avance;
    avance += largo;
    return { nivel, largo, desde };
  });

  return (
    <div className="relative shrink-0" style={{ width: TAMANO, height: TAMANO }}>
      <svg
        width={TAMANO}
        height={TAMANO}
        viewBox="0 0 42 42"
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={CENTRO}
          cy={CENTRO}
          r={RADIO}
          fill="none"
          strokeWidth={GROSOR}
          className="stroke-borde-suave"
        />

        {porciones.map((porcion) => (
          <circle
            key={porcion.nivel}
            cx={CENTRO}
            cy={CENTRO}
            r={RADIO}
            fill="none"
            strokeWidth={GROSOR}
            style={{ stroke: COLOR_ESTRELLA_TRAZO[porcion.nivel] }}
            strokeDasharray={`${porcion.largo} ${VUELTA - porcion.largo}`}
            strokeDashoffset={-porcion.desde}
          />
        ))}
      </svg>

      <span className="absolute inset-0 grid place-items-center text-center">
        <span className="flex flex-col">
          <b className="text-[17px] leading-none">{numero(total)}</b>
          <span className="text-[10px] text-texto-3">Total</span>
        </span>
      </span>
    </div>
  );
}

/** Una fila de la leyenda: el color del nivel, el conteo y su porcentaje. */
function FilaLeyenda({
  nivel,
  conteo,
  total,
}: {
  nivel: 1 | 2 | 3 | 4 | 5;
  conteo: number;
  total: number;
}) {
  return (
    <li className="flex items-center gap-2 text-xs">
      <span className={`size-2 shrink-0 rounded-full ${COLOR_ESTRELLA[nivel]}`} />

      <span className="text-texto-2">{nivel === 1 ? "1 estrella" : `${nivel} estrellas`}</span>

      <span className="ml-auto text-right tabular-nums">
        {numero(conteo)} <span className="text-texto-3">({porcentaje((conteo / total) * 100, 1)})</span>
      </span>
    </li>
  );
}
