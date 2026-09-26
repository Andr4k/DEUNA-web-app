import { Icono } from "@/components/ui/Icono";
import type { NombreIcono } from "@/lib/iconos";

interface Props {
  icono: NombreIcono;
  /** Clase de color del icono, p. ej. `text-info`. */
  colorIcono: string;
  etiqueta: string;
  /** El número, ya formateado. */
  valor: string;
  /** Unidad o tope que acompaña al número, p. ej. `/ 5`. */
  sufijo?: string;
  /** De qué sale el número. Va siempre que la tarjeta no lleve variación. */
  contexto?: string;
  /** La variación ya formateada (0,3 · 15,7% · Sin dato). */
  variacion?: string;
  /** Con qué se compara la variación (vs período anterior · vs ayer). */
  comparacion?: string;
  /** `true` cuando bajó. */
  baja?: boolean;
  /** No hay con qué comparar: va en gris, nunca en el verde de "subió". */
  neutro?: boolean;
}

/**
 * Tarjeta de un indicador de la franja superior de calificaciones.
 *
 * Es local y no el `Kpi` de `ui/`: ese rotula la tendencia siempre contra ayer y la
 * separa con una línea, y acá los deltas van contra el período anterior y pegados al
 * pie de la tarjeta, como en el diseño. Comparten el orden icono / etiqueta / valor.
 */
export function KpiMetrica({
  icono,
  colorIcono,
  etiqueta,
  valor,
  sufijo,
  contexto,
  variacion,
  comparacion,
  baja = false,
  neutro = false,
}: Props) {
  return (
    <article className="flex min-h-[8.5rem] min-w-0 flex-col rounded-tarjeta border border-borde bg-panel p-4 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.15)]">
      {/* El icono va grande a la izquierda y el texto forma su propia columna a la
          derecha. Es la organización del diseño: así el título, el valor y las líneas
          del pie quedan alineados entre sí, y no debajo del icono. */}
      <div className="flex min-w-0 flex-1 gap-3">
        <Icono nombre={icono} tamano={30} className={`${colorIcono} mt-0.5 w-8 shrink-0`} />

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-semibold tracking-[0.03em] text-texto-2 uppercase">
            {etiqueta}
          </span>

          <p className="m-0 mt-1 flex items-baseline gap-1.5 text-[28px] leading-tight font-bold">
            {valor}
            {sufijo ? <small className="text-[13px] font-medium text-texto-3">{sufijo}</small> : null}
          </p>

          <div className="mt-auto flex flex-col gap-1 pt-2">
            {contexto ? <p className="m-0 text-xs text-texto-3">{contexto}</p> : null}
            {variacion ? (
              <Delta texto={variacion} comparacion={comparacion} baja={baja} neutro={neutro} />
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

/** La fila de la variación: la flecha, el número y contra qué se compara. */
function Delta({
  texto,
  comparacion,
  baja,
  neutro,
}: {
  texto: string;
  comparacion?: string;
  baja: boolean;
  neutro: boolean;
}) {
  const color = neutro ? "text-texto-3" : baja ? "text-peligro" : "text-exito";

  return (
    <p className={`m-0 flex items-center gap-1 text-xs ${color}`}>
      {neutro ? null : <Icono nombre={baja ? "flecha-abajo" : "flecha-arriba"} tamano={12} />}
      <span className="font-semibold">{texto}</span>
      {comparacion ? <span className="text-texto-3">{comparacion}</span> : null}
    </p>
  );
}