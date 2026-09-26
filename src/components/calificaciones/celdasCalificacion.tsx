import { nota } from "@/components/calificaciones/valoresCalificacion";
import type { CalificacionDeRestaurante } from "@/lib/tipos/calificaciones-restaurantes";

/** Cuántos criterios entran en la celda, para que la fila no crezca sola. */
const CRITERIOS_EN_CELDA = 3;

/**
 * Los puntajes por criterio de un restaurante, del mejor al peor.
 *
 * Se ordenan acá y se cortan en tres: la columna se llama "aspectos destacados" y lo que
 * destaca es lo mejor puntuado. Los criterios son texto libre —el contrato lo dice: la API
 * devuelve los que existan, no un conjunto fijo—, así que pueden ser tres o siete; el resto
 * se cuenta en una línea en lugar de estirar la fila.
 */
export function AspectosDeRestaurante({
  aspectos,
}: {
  aspectos: CalificacionDeRestaurante["aspectos"];
}) {
  if (aspectos.length === 0) {
    return <span className="text-[12px] text-texto-3">Sin puntajes por criterio</span>;
  }

  const criterios = [...aspectos].sort((a, b) => b.promedio - a.promedio);
  const resto = criterios.length - CRITERIOS_EN_CELDA;

  return (
    <div className="flex min-w-32 flex-col text-[12px] text-texto-2">
      {criterios.slice(0, CRITERIOS_EN_CELDA).map((aspecto) => (
        <span key={aspecto.criterio} className="flex justify-between gap-2">
          <span className="truncate" title={aspecto.criterio}>
            {aspecto.criterio}
          </span>
          <span className="font-semibold text-texto tabular-nums">{nota(aspecto.promedio)}</span>
        </span>
      ))}

      {resto > 0 ? <span className="text-texto-3">+{resto} criterios más</span> : null}
    </div>
  );
}

/**
 * La barra de la calificación: el promedio sobre cinco.
 *
 * Sin promedio no se dibuja: una barra vacía mide lo mismo que un cero, y el texto de al
 * lado ya dice "Sin dato". Va con `aria-hidden` porque el ancho no dice nada en voz alta
 * —el número que la acompaña es el que se anuncia—.
 */
export function BarraPromedio({ valor }: { valor: number | null }) {
  if (valor === null) return null;

  return (
    <span className="h-1.5 w-full overflow-hidden rounded-full bg-panel-alt" aria-hidden="true">
      <span
        className="block h-full rounded-full bg-acento"
        style={{ width: `${(valor / 5) * 100}%` }}
      />
    </span>
  );
}

/** Un valor opcional del contrato que hoy falta: gris, para que no compita con los números. */
export function CeldaSinDato({ children }: { children: string }) {
  return <span className="text-[12px] text-texto-3">{children}</span>;
}
