import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Tarjeta } from "@/components/ui/Tarjeta";
import {
  COLOR_ESTRELLA,
  NIVELES,
  conteoDe,
  totalDe,
} from "@/components/calificaciones/valoresCalificacion";
import { numero, porcentaje } from "@/lib/formato";
import type { ResumenCalificacionesRestaurantes as Resumen } from "@/lib/tipos/calificaciones-restaurantes";

/**
 * Cómo se reparten las estrellas.
 * Los conteos vienen del backend y el porcentaje se calcula acá —el contrato lo dice
 * explícitamente—, porque el porcentaje es una forma de mirar el mismo número y no otro
 * dato: si viniera de los dos lados, tarde o temprano diferirían en la última cifra y
 * una barra no cerraría con el total de al lado.
 *
 * La barra de cada nivel va con su color de la escala (`COLOR_ESTRELLA`), la misma que
 * usa la columna de la tabla: el 5 siempre verde y el 1 siempre rojo, aunque cambie el
 * ancho.
 */
export async function DistribucionEstrellas({ datos }: { datos: Promise<Resumen> }) {
  const { distribucion } = await datos;
  const total = totalDe(distribucion);

  return (
    <Tarjeta titulo="Distribución de estrellas">
      {total === 0 ? (
        <EstadoVacio
          icono="estrella"
          titulo="Sin calificaciones en el rango"
          descripcion="Con estos filtros ninguna calificación entra en el rango. Probá ampliar las fechas o limpiar los filtros."
        />
      ) : (
        <>
          <ul className="flex flex-col gap-2.5">
            {NIVELES.map((nivel) => (
              <FilaNivel
                key={nivel}
                nivel={nivel}
                conteo={conteoDe(distribucion, nivel)}
                total={total}
              />
            ))}
          </ul>

          <p className="mt-3 mb-0 text-xs text-texto-3">
            Sobre {numero(total)} calificaciones de los restaurantes filtrados.
          </p>
        </>
      )}
    </Tarjeta>
  );
}

function FilaNivel({
  nivel,
  conteo,
  total,
}: {
  nivel: 1 | 2 | 3 | 4 | 5;
  conteo: number;
  total: number;
}) {
  const parte = (conteo / total) * 100;

  return (
    <li className="flex items-center gap-3 text-[13px]">
      <span className="w-7 shrink-0 text-texto-2">{nivel}★</span>

      <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-panel-alt">
        <span
          className={`block h-full rounded-full ${COLOR_ESTRELLA[nivel]}`}
          style={{ width: `${parte}%` }}
        />
      </span>

      <span className="w-14 shrink-0 text-right font-semibold tabular-nums">
        {numero(conteo)}
      </span>
      <span className="w-10 shrink-0 text-right text-[12px] text-texto-3 tabular-nums">
        {porcentaje(parte)}
      </span>
    </li>
  );
}
