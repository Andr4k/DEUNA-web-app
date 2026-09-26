import {
  COLOR_ESTRELLA,
  NIVELES,
  conteoDe,
  totalDe,
} from "@/components/calificaciones/valoresCalificacion";
import type { ResumenCalificacionesRestaurantes as Resumen } from "@/lib/tipos/calificaciones-restaurantes";

type Distribucion = Resumen["distribucion"];

/**
 * La distribución de estrellas en una sola barra, para la celda de la tabla.
 *
 * Es la misma escala de color que el bloque de distribución (`COLOR_ESTRELLA`) y el
 * ancho de cada segmento es el mismo porcentaje que se calcula en la vista, no un dato
 * aparte. Va con `aria-hidden` porque el ancho de un segmento no dice nada en voz alta:
 * el conteo que la acompaña en la celda es el que se anuncia.
 */
export function BarraApilada({ distribucion }: { distribucion: Distribucion }) {
  const total = totalDe(distribucion);

  return (
    <span className="flex h-1.5 w-full overflow-hidden rounded-full bg-panel-alt" aria-hidden="true">
      {NIVELES.map((nivel) => {
        const parte = total === 0 ? 0 : (conteoDe(distribucion, nivel) / total) * 100;
        return (
          <span
            key={nivel}
            className={`block h-full ${COLOR_ESTRELLA[nivel]}`}
            style={{ width: `${parte}%` }}
          />
        );
      })}
    </span>
  );
}
